import React from "react";
import {
  CheckCircleFilled,
  CloseOutlined,
  HistoryOutlined,
  MessageOutlined,
  PlusOutlined,
  RobotOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { conversationList } from "../constants";
import type {
  AgentConnectionStatus,
  AssistantSidebarProps,
} from "../types";

const statusLabels: Record<AgentConnectionStatus, string> = {
  checking: "正在连接智能引擎",
  online: "智能引擎在线",
  offline: "智能引擎离线",
};

const AssistantSidebar: React.FC<AssistantSidebarProps> = ({
  isOpen,
  agentStatus,
  onClose,
  onNewConversation,
}) => (
  <aside
    className={`ai-workbench__sidebar ${
      isOpen ? "ai-workbench__sidebar--open" : ""
    }`}
  >
    <div className="ai-workbench__brand">
      <span className="ai-workbench__brand-mark">
        <span className="ai-workbench__brand-orbit" />
        <RobotOutlined />
      </span>
      <span>
        <strong>AI 助手</strong>
        <small>运营智能工作台</small>
      </span>
      <button
        className="ai-icon-button ai-icon-button--mobile"
        type="button"
        aria-label="关闭侧栏"
        onClick={onClose}
      >
        <CloseOutlined />
      </button>
    </div>

    <button className="ai-new-chat" type="button" onClick={onNewConversation}>
      <PlusOutlined />
      <span>开启新对话</span>
      <kbd>⌘ K</kbd>
    </button>

    <div className="ai-sidebar-section">
      <div className="ai-sidebar-section__heading">
        <span>最近对话</span>
        <HistoryOutlined />
      </div>
      <div className="ai-conversation-list">
        {conversationList.map((conversation) => (
          <button
            className={`ai-conversation ${
              conversation.active ? "ai-conversation--active" : ""
            }`}
            key={conversation.title}
            type="button"
            onClick={onClose}
          >
            <MessageOutlined />
            <span>
              <strong>{conversation.title}</strong>
              <small>{conversation.time}</small>
            </span>
          </button>
        ))}
      </div>
    </div>

    <div className="ai-sidebar-bottom">
      <div className="ai-sidebar-status">
        <span
          className={`ai-sidebar-status__dot ai-sidebar-status__dot--${agentStatus}`}
        />
        <span>{statusLabels[agentStatus]}</span>
        {agentStatus === "offline" ? <CloseOutlined /> : <CheckCircleFilled />}
      </div>
      <button className="ai-sidebar-link" type="button">
        <SettingOutlined />
        <span>工作台设置</span>
      </button>
    </div>
  </aside>
);

export default AssistantSidebar;
