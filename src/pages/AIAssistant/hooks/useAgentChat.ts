import { useCallback, useEffect, useRef, useState } from "react";
import { message as antdMessage } from "antd";
import {
  checkAgentHealth,
  streamAgentChat,
  type AgentStreamEvent,
} from "@/services/Agent";
import {
  addConversationMessage,
  createConversation,
  deleteConversationApi,
  getConversationDetail,
  getConversationList,
  updateConversationTitle as apiUpdateConversationTitle,
  type ApiConversationItem,
} from "@/services/Conversation";
import {
  defaultThinkingStatus,
  initialConversationList,
  initialMessages,
  initialWelcomeMessage,
} from "../constants";
import type {
  AgentConnectionStatus,
  ChatMessage,
  ConversationItem,
  ThoughtStep,
} from "../types";

const STORAGE_KEY_CONVS = "marketing_ai_assistant_convs_v1";
const STORAGE_KEY_ACTIVE_KEY = "marketing_ai_assistant_active_key_v1";

const createMessageId = () =>
  `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const formatRelativeTime = (timeStrOrTimestamp?: string | number): string => {
  if (!timeStrOrTimestamp) return "刚刚";
  const timestamp =
    typeof timeStrOrTimestamp === "number"
      ? timeStrOrTimestamp
      : new Date(timeStrOrTimestamp).getTime();

  const diff = Date.now() - timestamp;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < 5 * minute) return "刚刚";
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`;
  if (diff < 30 * day) return `${Math.floor(diff / day)} 天前`;
  return `${Math.floor(diff / (30 * day))} 个月前`;
};

// 从 LocalStorage 安全读取降级数据
const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

export const useAgentChat = () => {
  const [conversations, setConversations] = useState<ConversationItem[]>(() => {
    return loadFromStorage<ConversationItem[]>(
      STORAGE_KEY_CONVS,
      initialConversationList,
    );
  });

  const [activeConversationKey, setActiveConversationKey] = useState<string>(
    () => {
      return loadFromStorage<string>(
        STORAGE_KEY_ACTIVE_KEY,
        conversations[0]?.key || "conv-1",
      );
    },
  );

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [agentStatus, setAgentStatus] =
    useState<AgentConnectionStatus>("checking");
  const [thinkingStatus, setThinkingStatus] = useState(defaultThinkingStatus);
  const [activeThoughts, setActiveThoughts] = useState<ThoughtStep[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const activeRequestRef = useRef<AbortController | null>(null);

  // 1. 获取后端历史会话列表（支持持久化恢复）
  const fetchConversations = useCallback(async () => {
    try {
      const remoteList = await getConversationList();
      if (Array.isArray(remoteList) && remoteList.length > 0) {
        const mappedList: ConversationItem[] = remoteList.map(
          (item: ApiConversationItem) => ({
            key: item.id,
            label: item.title,
            time: formatRelativeTime(item.updatedAt || item.createdAt),
            timestamp: new Date(item.updatedAt || item.createdAt).getTime(),
            group: "历史会话",
          }),
        );
        setConversations(mappedList);

        // 如果当前 activeKey 不在列表里，则默认选中第一个
        const hasCurrent = mappedList.some((c) => c.key === activeConversationKey);
        const targetKey = hasCurrent ? activeConversationKey : mappedList[0].key;
        setActiveConversationKey(targetKey);
        return targetKey;
      }
    } catch {
      // 后端未联通时，使用本地缓存降级
    }
    return activeConversationKey;
  }, [activeConversationKey]);

  // 2. 加载某个具体会话的消息记录
  const loadConversationMessages = useCallback(async (conversationId: string) => {
    if (!conversationId) return;
    setLoadingHistory(true);
    try {
      const detail = await getConversationDetail(conversationId);
      if (detail && Array.isArray(detail.messages)) {
        if (detail.messages.length === 0) {
          setMessages([initialWelcomeMessage]);
        } else {
          const mappedMsgs: ChatMessage[] = detail.messages.map((m) => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.content,
            time: formatRelativeTime(m.createdAt),
          }));
          setMessages(mappedMsgs);
        }
      }
    } catch {
      // 接口请求失败时维持欢迎语
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  // 页面挂载时初始化会话列表与选中会话
  useEffect(() => {
    fetchConversations().then((targetKey) => {
      if (targetKey) {
        loadConversationMessages(targetKey);
      }
    });
  }, []);

  // 持久化当前 activeKey
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_ACTIVE_KEY,
        JSON.stringify(activeConversationKey),
      );
    } catch (e) {
      console.error(e);
    }
  }, [activeConversationKey]);

  // 初始化健康检查
  useEffect(() => {
    const controller = new AbortController();

    checkAgentHealth(controller.signal)
      .then(() => setAgentStatus("online"))
      .catch(() => {
        if (!controller.signal.aborted) {
          setAgentStatus("offline");
        }
      });

    return () => {
      controller.abort();
      activeRequestRef.current?.abort();
      activeRequestRef.current = null;
    };
  }, []);

  const updateAssistantMessage = useCallback(
    (
      id: string,
      updater: (prev: { content: string; thoughtChain?: ThoughtStep[] }) => {
        content: string;
        thoughtChain?: ThoughtStep[];
      },
    ) => {
      setMessages((current) =>
        current.map((msg) => {
          if (msg.id !== id) return msg;
          const updated = updater({
            content: msg.content,
            thoughtChain: msg.thoughtChain,
          });
          return {
            ...msg,
            content: updated.content,
            thoughtChain: updated.thoughtChain,
          };
        }),
      );
    },
    [],
  );

  const handleAgentEvent = useCallback(
    (
      assistantMessageId: string,
      event: AgentStreamEvent,
      thoughtsCollector: { list: ThoughtStep[] },
    ) => {
      let statusDescription = "";

      switch (event.type) {
        case "text": {
          statusDescription = "Agent 正在生成回复...";
          updateAssistantMessage(assistantMessageId, (prev) => ({
            content: prev.content + (event.delta || ""),
            thoughtChain: [...thoughtsCollector.list],
          }));
          break;
        }
        case "step": {
          const stepNum = event.step || thoughtsCollector.list.length + 1;
          statusDescription = `Agent 正在思考第 ${stepNum} 步`;

          thoughtsCollector.list = thoughtsCollector.list.map((item) =>
            item.status === "loading" ? { ...item, status: "success" } : item,
          );

          thoughtsCollector.list.push({
            key: `step-${stepNum}-${Date.now()}`,
            title: `思考步骤 ${stepNum}`,
            description: "分析意图与拆解目标...",
            status: "loading",
          });
          setActiveThoughts([...thoughtsCollector.list]);
          break;
        }
        case "tool-call": {
          statusDescription = `调用工具：${event.toolName || "业务数据服务"}`;
          thoughtsCollector.list.push({
            key: `tool-${Date.now()}`,
            title: `调用工具: ${event.toolName || "业务工具"}`,
            description: event.input
              ? `参数: ${JSON.stringify(event.input)}`
              : "准备读取数据...",
            status: "loading",
          });
          setActiveThoughts([...thoughtsCollector.list]);
          break;
        }
        case "tool-result": {
          statusDescription = `工具 ${event.toolName || "业务工具"} 已响应`;
          thoughtsCollector.list = thoughtsCollector.list.map((item) =>
            item.title.includes(event.toolName || "业务工具")
              ? {
                  ...item,
                  status: "success",
                  description: event.output
                    ? `结果: ${typeof event.output === "object" ? JSON.stringify(event.output) : String(event.output)}`
                    : "执行成功",
                }
              : item,
          );
          setActiveThoughts([...thoughtsCollector.list]);
          break;
        }
        case "continue": {
          statusDescription = "Agent 正在梳理下一步动作";
          break;
        }
        case "max-steps": {
          statusDescription = "已达到最大步数限制";
          break;
        }
        case "done": {
          statusDescription = "生成完毕";
          thoughtsCollector.list = thoughtsCollector.list.map((item) =>
            item.status === "loading" ? { ...item, status: "success" } : item,
          );
          setActiveThoughts([...thoughtsCollector.list]);
          break;
        }
        default:
          break;
      }

      if (statusDescription) {
        setThinkingStatus(statusDescription);
      }
    },
    [updateAssistantMessage],
  );

  const stop = useCallback(() => {
    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
      activeRequestRef.current = null;
      setIsThinking(false);
      setThinkingStatus(defaultThinkingStatus);
      antdMessage.info("已停止当前回复生成");
    }
  }, []);

  // 3. 点击“开启新对话”（调用 POST /conversations）
  const startNewConversation = useCallback(async () => {
    stop();
    setDraft("");
    setIsThinking(false);
    setActiveThoughts([]);
    setThinkingStatus(defaultThinkingStatus);
    setMessages([initialWelcomeMessage]);

    try {
      const newConv = await createConversation("新对话");
      const createdItem: ConversationItem = {
        key: newConv.id,
        label: newConv.title || "新对话",
        time: "刚刚",
        timestamp: Date.now(),
        group: "新对话",
      };
      setConversations((prev) => [createdItem, ...prev]);
      setActiveConversationKey(newConv.id);
    } catch {
      // 降级兜底
      const localKey = `conv-${Date.now()}`;
      setConversations((prev) => [
        {
          key: localKey,
          label: "新对话",
          time: "刚刚",
          timestamp: Date.now(),
          group: "新对话",
        },
        ...prev,
      ]);
      setActiveConversationKey(localKey);
    }
  }, [stop]);

  // 4. 选中会话切换（加载会话历史消息）
  const selectConversation = useCallback(
    (key: string) => {
      if (key === activeConversationKey) return;
      stop();
      setActiveConversationKey(key);
      setActiveThoughts([]);
      setIsThinking(false);
      loadConversationMessages(key);
    },
    [activeConversationKey, loadConversationMessages, stop],
  );

  // 5. 删除会话（调用 DELETE /conversations/:id）
  const deleteConversation = useCallback(
    async (key: string) => {
      try {
        await deleteConversationApi(key);
        antdMessage.success("会话已删除");
      } catch (e) {
        console.error("删除会话接口异常:", e);
      }

      // 计算删除后的剩余会话
      setConversations((prev) => {
        const remaining = prev.filter((c) => c.key !== key);

        // 如果删除的是当前激活会话
        if (activeConversationKey === key) {
          if (remaining.length > 0) {
            // 自动平滑切换到剩余会话中的第一个，并加载其消息，绝不调用创建接口
            const nextActiveKey = remaining[0].key;
            setActiveConversationKey(nextActiveKey);
            loadConversationMessages(nextActiveKey);
          } else {
            // 所有会话被清空，重置到待发问的初始欢迎状态
            setActiveConversationKey("");
            setMessages([initialWelcomeMessage]);
            setActiveThoughts([]);
            setIsThinking(false);
          }
        }

        return remaining;
      });
    },
    [activeConversationKey, loadConversationMessages],
  );

  // 6. 发送消息（自动落库 user + assistant 消息，并智能提炼标题）
  const sendMessage = useCallback(
    async (content?: string) => {
      const textToSend = (content ?? draft).trim();
      if (!textToSend || isThinking) {
        return;
      }

      const nowTimeStr = "刚刚";
      const userMessageId = createMessageId();
      const assistantMessageId = createMessageId();
      const controller = new AbortController();
      activeRequestRef.current = controller;

      const newUserMessage: ChatMessage = {
        id: userMessageId,
        role: "user",
        content: textToSend,
        time: nowTimeStr,
      };

      const newAssistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        time: nowTimeStr,
        isStreaming: true,
        thoughtChain: [],
      };

      setMessages((prev) => [...prev, newUserMessage, newAssistantMessage]);
      setDraft("");
      setIsThinking(true);
      setThinkingStatus("智能引擎正在分析需求...");
      const thoughtsCollector = { list: [] as ThoughtStep[] };
      setActiveThoughts([]);

      // 异步保存用户消息到 Nest 数据库
      addConversationMessage(activeConversationKey, "user", textToSend).catch(
        () => {},
      );

      // 如果当前会话标题是默认名，自动截取首句并更新标题 (PATCH /conversations/:id)
      const currentConv = conversations.find(
        (c) => c.key === activeConversationKey,
      );
      if (
        currentConv &&
        (currentConv.label === "新对话" ||
          currentConv.label === "新会话" ||
          currentConv.label.startsWith("新建对话"))
      ) {
        const smartTitle =
          textToSend.slice(0, 18) + (textToSend.length > 18 ? "..." : "");
        apiUpdateConversationTitle(activeConversationKey, smartTitle).catch(
          () => {},
        );
        setConversations((prev) =>
          prev.map((c) =>
            c.key === activeConversationKey
              ? { ...c, label: smartTitle, time: "刚刚", timestamp: Date.now() }
              : c,
          ),
        );
      }

      let receivedText = "";

      try {
        await streamAgentChat(
          {
            sessionId: activeConversationKey,
            message: textToSend,
          },
          {
            signal: controller.signal,
            onEvent: (event) => {
              if (event.type === "text") {
                receivedText += event.delta || "";
              }
              handleAgentEvent(
                assistantMessageId,
                event,
                thoughtsCollector,
              );
            },
          },
        );

        const finalContent = receivedText.trim()
          ? receivedText
          : "Agent 已完成处理。";

        updateAssistantMessage(assistantMessageId, (prev) => ({
          content: prev.content || finalContent,
          thoughtChain: thoughtsCollector.list,
        }));

        // 异步保存 Assistant 消息到 Nest 数据库
        addConversationMessage(
          activeConversationKey,
          "assistant",
          finalContent,
        ).catch(() => {});

        setAgentStatus("online");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const errorMessage =
          error instanceof Error ? error.message : "Agent 服务暂时不可用";
        updateAssistantMessage(assistantMessageId, (prev) => ({
          content: prev.content || `Agent 暂时无法回答：${errorMessage}`,
          thoughtChain: [
            ...thoughtsCollector.list,
            {
              key: `error-${Date.now()}`,
              title: "请求异常",
              description: errorMessage,
              status: "error",
            },
          ],
        }));
        setAgentStatus("offline");
        antdMessage.error(errorMessage);
      } finally {
        if (activeRequestRef.current === controller) {
          activeRequestRef.current = null;
          setIsThinking(false);
          setThinkingStatus(defaultThinkingStatus);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, isStreaming: false }
                : msg,
            ),
          );
        }
      }
    },
    [
      draft,
      isThinking,
      activeConversationKey,
      conversations,
      handleAgentEvent,
      updateAssistantMessage,
    ],
  );

  return {
    agentStatus,
    activeConversationKey,
    conversations,
    draft,
    hasStreamingText:
      isThinking &&
      messages[messages.length - 1]?.role === "assistant" &&
      messages[messages.length - 1].content.length > 0,
    isThinking,
    messages,
    activeThoughts,
    loadingHistory,
    sendMessage,
    setDraft,
    stop,
    startNewConversation,
    selectConversation,
    deleteConversation,
    thinkingStatus,
  };
};

export default useAgentChat;
