import React from "react";
import { Tag } from "antd";
import type { ConversationHeaderProps } from "../types";

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  messageCount,
  activeTitle,
}) => (
  <div className="ai-conversation-header">
    <div className="ai-conversation-header__title-wrap">
      <span className="ai-overline">MARKETING AI WORKBENCH</span>
      <h1>{activeTitle || "今天，想让 AI 帮你推进什么？"}</h1>
      <p>{messageCount} 条对话消息 · 实时上下文关联中</p>
    </div>
    <div className="ai-model-badge">
      <Tag color="processing" style={{ borderRadius: 12, padding: "4px 10px", margin: 0 }}>
        ⚡ 深度思考推理 (Reasoning Agent)
      </Tag>
    </div>
  </div>
);

export default ConversationHeader;
