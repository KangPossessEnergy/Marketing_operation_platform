import { useCallback, useEffect, useRef, useState } from "react";
import { message as antdMessage } from "antd";
import {
  checkAgentHealth,
  streamAgentChat,
  type AgentStreamEvent,
} from "@/services/Agent";
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

const createSessionId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `web-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

const createMessageId = () =>
  `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const formatCurrentTime = () =>
  new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());

export const useAgentChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId, setSessionId] = useState(createSessionId);
  const [agentStatus, setAgentStatus] =
    useState<AgentConnectionStatus>("checking");
  const [thinkingStatus, setThinkingStatus] = useState(defaultThinkingStatus);
  const [activeThoughts, setActiveThoughts] = useState<ThoughtStep[]>([]);
  const [conversations, setConversations] = useState<ConversationItem[]>(
    initialConversationList,
  );
  const [activeConversationKey, setActiveConversationKey] =
    useState<string>("conv-1");

  const activeRequestRef = useRef<AbortController | null>(null);

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

          // 标记上一条为 success
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

  const startNewConversation = useCallback(() => {
    stop();
    const newSessionId = createSessionId();
    const newConvKey = `conv-${Date.now()}`;
    setSessionId(newSessionId);
    setMessages([initialWelcomeMessage]);
    setDraft("");
    setIsThinking(false);
    setActiveThoughts([]);
    setThinkingStatus(defaultThinkingStatus);

    setConversations((prev) => [
      {
        key: newConvKey,
        label: "新建对话",
        time: "刚刚",
      },
      ...prev,
    ]);
    setActiveConversationKey(newConvKey);
  }, [stop]);

  const selectConversation = useCallback(
    (key: string) => {
      stop();
      setActiveConversationKey(key);
      const conv = conversations.find((c) => c.key === key);
      // 切换会话时可加载对应记录，此处重置并显示会话名称
      setMessages([
        {
          id: `welcome-${key}`,
          role: "assistant",
          content: `已切换至会话【${conv?.label || "未命名会话"}】。请告诉我需要为您处理什么？`,
          time: conv?.time || "刚刚",
        },
      ]);
      setSessionId(createSessionId());
      setActiveThoughts([]);
    },
    [conversations, stop],
  );

  const deleteConversation = useCallback(
    (key: string) => {
      setConversations((prev) => prev.filter((c) => c.key !== key));
      if (activeConversationKey === key) {
        startNewConversation();
      }
    },
    [activeConversationKey, startNewConversation],
  );

  const sendMessage = useCallback(
    async (content?: string) => {
      const textToSend = (content ?? draft).trim();
      if (!textToSend || isThinking) {
        return;
      }

      const now = formatCurrentTime();
      const userMessageId = createMessageId();
      const assistantMessageId = createMessageId();
      const controller = new AbortController();
      activeRequestRef.current = controller;

      const newUserMessage: ChatMessage = {
        id: userMessageId,
        role: "user",
        content: textToSend,
        time: now,
      };

      const newAssistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        time: now,
        isStreaming: true,
        thoughtChain: [],
      };

      setMessages((prev) => [...prev, newUserMessage, newAssistantMessage]);
      setDraft("");
      setIsThinking(true);
      setThinkingStatus("智能引擎正在分析需求...");
      const thoughtsCollector = { list: [] as ThoughtStep[] };
      setActiveThoughts([]);

      // 更新会话标题
      setConversations((prev) =>
        prev.map((conv) =>
          conv.key === activeConversationKey && conv.label === "新建对话"
            ? {
                ...conv,
                label:
                  textToSend.slice(0, 16) + (textToSend.length > 16 ? "..." : ""),
              }
            : conv,
        ),
      );

      let receivedText = "";

      try {
        await streamAgentChat(
          {
            sessionId,
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

        if (!receivedText.trim()) {
          updateAssistantMessage(assistantMessageId, (prev) => ({
            content: "Agent 已完成处理，但本轮未返回文本内容。",
            thoughtChain: thoughtsCollector.list,
          }));
        } else {
          updateAssistantMessage(assistantMessageId, (prev) => ({
            content: prev.content,
            thoughtChain: thoughtsCollector.list,
          }));
        }

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
      sessionId,
      activeConversationKey,
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
