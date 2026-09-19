import React, { useState } from "react";
import {
  BulbOutlined,
  DownOutlined,
  RobotOutlined,
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
}) => (
  <div
    className={`ai-reasoning-wrapper ${
      expanded
        ? "ai-reasoning-wrapper--expanded"
        : "ai-reasoning-wrapper--collapsed"
    } ${streaming ? "ai-reasoning-wrapper--streaming" : ""}`}
  >
    <div className="ai-reasoning-header">
      <div className="ai-reasoning-title">
        <span className="ai-reasoning-pulse-dot" aria-hidden="true" />
        <BulbOutlined className="ai-reasoning-title__icon" aria-hidden="true" />
        <Text strong className="ai-reasoning-title__label">深度推理</Text>
        {streaming ? (
          <span className="ai-reasoning-badge ai-reasoning-badge--active">
            <span className="ai-reasoning-badge__spinner" />
            思考演算中
          </span>
        ) : (
          <span className="ai-reasoning-badge ai-reasoning-badge--completed">
            已完成推理
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
        <span>{expanded ? "收起思考" : "展开思考"}</span>
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

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isThinking,
  hasStreamingText,
  thinkingStatus,
}) => {
  const [expandedReasoning, setExpandedReasoning] = useState<
    Record<string, boolean>
  >({});

  // 推理块默认在「正在思考且正文未开始」时展开，正文输出后自动折叠，用户可手动切换
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
                  <Avatar
                    style={{ backgroundColor: "#10b981" }}
                    icon={<UserOutlined />}
                  />
                ) : (
                  <Avatar
                    style={{ backgroundColor: "#2563eb" }}
                    icon={<RobotOutlined />}
                  />
                )
              }
              header={
                <Space size={8}>
                  <Text strong>{isUser ? "我" : "AI 助手"}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {message.time}
                  </Text>
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
                  ? { effect: "typing", step: 2, interval: 30 }
                  : undefined
              }
            />
          </div>
        );
      })}

      {/* 当助手正在初始思考且尚未有文本/推理流时 */}
      {isThinking &&
        !hasStreamingText &&
        !hasStreamingReasoning && (
          <div className="ai-bubble-item ai-bubble-item--ai">
            <Bubble
              placement="start"
              avatar={
                <Avatar
                  style={{ backgroundColor: "#2563eb" }}
                  icon={<RobotOutlined />}
                />
              }
              header={
                <Space size={8}>
                  <Text strong>AI 助手</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    思考中...
                  </Text>
                </Space>
              }
              loading
              content={
                <Text type="secondary">
                  {thinkingStatus || "正在规划执行路径并检索相关数据..."}
                </Text>
              }
            />
          </div>
        )}
    </div>
  );
};

export default MessageList;
