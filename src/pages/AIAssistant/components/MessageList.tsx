import React from "react";
import { RobotOutlined } from "@ant-design/icons";
import ThinkingIndicator from "./ThinkingIndicator";
import type { MessageListProps } from "../types";

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isThinking,
  hasStreamingText,
  thinkingStatus,
}) => (
  <div className="ai-message-list">
    {messages
      .filter((message) => message.content)
      .map((message) => (
        <article
          className={`ai-message ai-message--${message.role}`}
          key={message.id}
        >
          <div className="ai-message__avatar">
            {message.role === "assistant" ? <RobotOutlined /> : "我"}
          </div>
          <div className="ai-message__body">
            <div className="ai-message__meta">
              <strong>{message.role === "assistant" ? "AI 助手" : "我"}</strong>
              <span>{message.time}</span>
            </div>
            <p>{message.content}</p>
          </div>
        </article>
      ))}
    {isThinking && !hasStreamingText && (
      <article className="ai-message ai-message--assistant">
        <div className="ai-message__avatar">
          <RobotOutlined />
        </div>
        <div className="ai-message__body">
          <div className="ai-message__meta">
            <strong>AI 助手</strong>
            <span>{thinkingStatus}</span>
          </div>
          <ThinkingIndicator />
        </div>
      </article>
    )}
  </div>
);

export default MessageList;
