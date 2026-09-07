import React from "react";
import type { ConversationHeaderProps } from "../types";

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  messageCount,
}) => (
  <div className="ai-conversation-header">
    <div>
      <span className="ai-overline">CONVERSATION 01</span>
      <h1>今天，想让 AI 帮你推进什么？</h1>
      <p>{messageCount} 条消息 · 上下文已准备就绪</p>
    </div>
    <div className="ai-model-badge">
      <span className="ai-model-badge__dot" />
      <span>
        <strong>运营专家</strong>
        <small>Reasoning mode</small>
      </span>
    </div>
  </div>
);

export default ConversationHeader;
