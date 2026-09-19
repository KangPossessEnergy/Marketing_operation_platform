import React, { useEffect, useState } from "react";
import {
  DownOutlined,
  ThunderboltOutlined,
  UpOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Bubble } from "@ant-design/x";
import { Avatar, Space, Typography } from "antd";
import type { ChatMessage, MessageListProps } from "../types";

const { Text } = Typography;

type ReasoningSectionProps = {
  messageId: string;
  reasoning: string;
  streaming: boolean;
  expanded: boolean;
  onToggle: (messageId: string) => void;
};

const ReasoningSection: React.FC<ReasoningSectionProps> = ({
  messageId,
  reasoning,
  streaming,
  expanded,
  onToggle,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (streaming) {
      const startTime = Date.now();
      timer = setInterval(() => {
        setElapsedSeconds(Math.round(((Date.now() - startTime) / 1000) * 10) / 10);
      }, 100);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [streaming]);

  return (
    <div
      className={`ai-reasoning-wrapper ${
        expanded
          ? "ai-reasoning-wrapper--expanded"
          : "ai-reasoning-wrapper--collapsed"
      } ${streaming ? "ai-reasoning-wrapper--streaming" : ""}`}
    >
      <div className="ai-reasoning-header">
        <div className="ai-reasoning-title">
          {/* 量子跳动神经元波形 */}
          <div className="ai-neuron-wave" aria-hidden="true">
            <span className="ai-neuron-bar" />
            <span className="ai-neuron-bar" />
            <span className="ai-neuron-bar" />
            <span className="ai-neuron-bar" />
          </div>

          <Text strong className="ai-reasoning-title__label">
            NEURAL REASONING
          </Text>

          {streaming ? (
            <span className="ai-reasoning-badge ai-reasoning-badge--active">
              <span className="ai-reasoning-badge__spinner" />
              神经流式演算中 {elapsedSeconds > 0 ? `· ${elapsedSeconds.toFixed(1)}s` : ""}
            </span>
          ) : (
            <span className="ai-reasoning-badge ai-reasoning-badge--completed">
              ✓ 推理收敛
            </span>
          )}
        </div>

        <button
          className="ai-reasoning-toggle"
          type="button"
          aria-expanded={expanded}
          aria-controls={`reasoning-${messageId}`}
          onClick={() => onToggle(messageId)}
        >
          {expanded ? <UpOutlined /> : <DownOutlined />}
          <span>{expanded ? "收起思考舱" : "展开思考舱"}</span>
        </button>
      </div>

      <div id={`reasoning-${messageId}`} hidden={!expanded}>
        <div className="ai-reasoning-text">
          {reasoning}
          {streaming && <span className="ai-streaming-cursor" aria-hidden="true" />}
        </div>
      </div>
    </div>
  );
};

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isThinking,
  hasStreamingText,
  thinkingStatus,
}) => {
  const [expandedReasoning, setExpandedReasoning] = useState<
    Record<string, boolean>
  >({});

  const renderReasoning = (message: ChatMessage) => {
    const streaming = Boolean(message.isStreaming && !message.content);
    const expanded = expandedReasoning[message.id] ?? streaming;
    return (
      <ReasoningSection
        messageId={message.id}
        reasoning={message.reasoning || ""}
        streaming={streaming}
        expanded={expanded}
        onToggle={(messageId) =>
          setExpandedReasoning((current) => ({
            ...current,
            [messageId]: !expanded,
          }))
        }
      />
    );
  };

  const lastMessage = messages[messages.length - 1];
  const hasStreamingReasoning = Boolean(
    isThinking &&
      lastMessage &&
      lastMessage.role === "assistant" &&
      lastMessage.reasoning,
  );

  return (
    <div className="ai-message-list-container">
      {messages.map((message) => {
        const isUser = message.role === "user";
        const hasReasoning = Boolean(message.reasoning);

        if (!message.content && !hasReasoning) {
          return null;
        }

        return (
          <div
            key={message.id}
            className={`ai-bubble-item ${
              isUser ? "ai-bubble-item--user" : "ai-bubble-item--ai"
            }`}
          >
            <Bubble
              placement={isUser ? "end" : "start"}
              avatar={
                isUser ? (
                  <div className="ai-avatar-user">
                    <UserOutlined />
                  </div>
                ) : (
                  <div className="ai-avatar-holo">
                    <ThunderboltOutlined />
                    <span className="ai-avatar-halo" />
                  </div>
                )
              }
              header={
                <Space size={8} className="ai-bubble-header">
                  <span className="ai-sender-name">
                    {isUser ? "USER PILOT" : "NEURAL CORE AI"}
                  </span>
                  <span className="ai-msg-time">{message.time}</span>
                  {!isUser && message.isStreaming && (
                    <span className="ai-streaming-tag">STREAMING</span>
                  )}
                </Space>
              }
              content={
                <div className="ai-bubble-content">
                  {!isUser && hasReasoning && renderReasoning(message)}
                  {message.content && (
                    <div className="ai-bubble-text">
                      {message.content}
                      {message.isStreaming && !isUser && (
                        <span className="ai-streaming-cursor" aria-hidden="true" />
                      )}
                    </div>
                  )}
                </div>
              }
              typing={
                message.isStreaming
                  ? { effect: "typing", step: 3, interval: 20 }
                  : undefined
              }
            />
          </div>
        );
      })}

      {/* 初始规划状态指示卡 */}
      {isThinking && !hasStreamingText && !hasStreamingReasoning && (
        <div className="ai-bubble-item ai-bubble-item--ai">
          <Bubble
            placement="start"
            avatar={
              <div className="ai-avatar-holo">
                <ThunderboltOutlined />
                <span className="ai-avatar-halo" />
              </div>
            }
            header={
              <Space size={8} className="ai-bubble-header">
                <span className="ai-sender-name">NEURAL CORE AI</span>
                <span className="ai-streaming-tag">INITIALIZING</span>
              </Space>
            }
            loading
            content={
              <div className="ai-initializing-pod">
                <div className="ai-initializing-laser" />
                <span className="ai-initializing-text">
                  {thinkingStatus || "量子规划路径锁定中，正在实时检索 CPQ 物料与 CRM 数据链..."}
                </span>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};

export default MessageList;
