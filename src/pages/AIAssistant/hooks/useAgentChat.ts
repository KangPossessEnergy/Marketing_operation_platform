import { useEffect, useRef, useState } from "react";
import { message as antdMessage } from "antd";
import {
  checkAgentHealth,
  streamAgentChat,
  type AgentStreamEvent,
} from "@/services/Agent";
import { defaultThinkingStatus, initialMessages } from "../constants";
import type { AgentConnectionStatus, ChatMessage } from "../types";

const createSessionId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `web-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const createMessageId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const formatTime = () =>
  new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());

const getThinkingStatus = (event: AgentStreamEvent) => {
  switch (event.type) {
    case "text":
      return "Agent 正在生成回复";
    case "step":
      return `Agent 正在思考第 ${event.step || 1} 步`;
    case "tool-call":
      return `正在调用工具：${event.toolName || "业务工具"}`;
    case "tool-result":
      return `工具已返回：${event.toolName || "业务工具"}`;
    case "continue":
      return "Agent 正在整理下一步";
    case "max-steps":
      return "Agent 已达到本轮处理上限";
    case "done":
      return "回复完成";
    default:
      return undefined;
  }
};

const useAgentChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId, setSessionId] = useState(createSessionId);
  const [agentStatus, setAgentStatus] =
    useState<AgentConnectionStatus>("checking");
  const [thinkingStatus, setThinkingStatus] = useState(defaultThinkingStatus);
  const activeRequestRef = useRef<AbortController | null>(null);

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
      const activeRequest = activeRequestRef.current;
      activeRequestRef.current = null;
      activeRequest?.abort();
    };
  }, []);

  const updateAssistantMessage = (
    id: string,
    updater: (content: string) => string,
  ) => {
    setMessages((currentMessages) =>
      currentMessages.map((currentMessage) =>
        currentMessage.id === id
          ? { ...currentMessage, content: updater(currentMessage.content) }
          : currentMessage,
      ),
    );
  };

  const handleAgentEvent = (
    assistantMessageId: string,
    event: AgentStreamEvent,
  ) => {
    if (event.type === "text") {
      updateAssistantMessage(
        assistantMessageId,
        (content) => content + (event.delta || ""),
      );
    }

    const nextThinkingStatus = getThinkingStatus(event);
    if (nextThinkingStatus) {
      setThinkingStatus(nextThinkingStatus);
    }
  };

  const startNewConversation = () => {
    activeRequestRef.current?.abort();
    activeRequestRef.current = null;
    setMessages(initialMessages);
    setDraft("");
    setIsThinking(false);
    setThinkingStatus(defaultThinkingStatus);
    setSessionId(createSessionId());
  };

  const sendMessage = async (content = draft) => {
    const trimmedContent = content.trim();
    if (!trimmedContent || isThinking) {
      return;
    }

    const now = formatTime();
    const assistantMessageId = createMessageId();
    const controller = new AbortController();
    activeRequestRef.current = controller;
    setMessages((currentMessages) => [
      ...currentMessages,
      { id: createMessageId(), role: "user", content: trimmedContent, time: now },
      { id: assistantMessageId, role: "assistant", content: "", time: formatTime() },
    ]);
    setDraft("");
    setIsThinking(true);
    setThinkingStatus(defaultThinkingStatus);

    let receivedText = "";

    try {
      await streamAgentChat(
        {
          sessionId,
          message: trimmedContent,
        },
        {
          signal: controller.signal,
          onEvent: (event) => {
            if (event.type === "text") {
              receivedText += event.delta || "";
            }
            handleAgentEvent(assistantMessageId, event);
          },
        },
      );
      if (!receivedText.trim()) {
        updateAssistantMessage(
          assistantMessageId,
          () => "Agent 已完成处理，但本轮没有返回文本内容。",
        );
      }
      setAgentStatus("online");
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      const errorMessage =
        error instanceof Error ? error.message : "Agent 服务暂时不可用";
      updateAssistantMessage(
        assistantMessageId,
        (currentContent) =>
          currentContent || `Agent 暂时无法回答：${errorMessage}`,
      );
      setAgentStatus("offline");
      antdMessage.error(errorMessage);
    } finally {
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
        setIsThinking(false);
        setThinkingStatus(defaultThinkingStatus);
      }
    }
  };

  return {
    agentStatus,
    draft,
    hasStreamingText:
      isThinking &&
      messages[messages.length - 1]?.role === "assistant" &&
      messages[messages.length - 1].content.length > 0,
    isThinking,
    messages,
    sendMessage,
    setDraft,
    startNewConversation,
    thinkingStatus,
  };
};

export default useAgentChat;
