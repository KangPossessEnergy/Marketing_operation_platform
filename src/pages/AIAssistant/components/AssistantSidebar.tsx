import React from "react";
import {
  CheckCircleFilled,
  CloseOutlined,
  DeleteOutlined,
  HistoryOutlined,
  PlusOutlined,
  RobotOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Conversations } from "@ant-design/x";
import type { ConversationItemType } from "@ant-design/x";
import { Button, Tooltip } from "antd";
import type {
  AgentConnectionStatus,
  AssistantSidebarProps,
} from "../types";

const statusLabels: Record<AgentConnectionStatus, string> = {
  checking: "智能引擎连接中",
  online: "智能引擎在线",
  offline: "智能引擎离线",
};

const AssistantSidebar: React.FC<AssistantSidebarProps> = ({
  isOpen,
  agentStatus,
  activeConversationKey,
  conversations,
  onSelectConversation,
  onClose,
  onNewConversation,
  onDeleteConversation,
}) => {
  const conversationItems: ConversationItemType[] = conversations.map(
    (item) => ({
      key: item.key,
      label: item.label,
      timestamp: item.time,
    }),
  );

  return (
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
        <div className="ai-workbench__brand-text">
          <strong>AI 营销运营助手</strong>
          <small>Ant Design X 驱动</small>
        </div>
        <button
          className="ai-icon-button ai-icon-button--mobile"
          type="button"
          aria-label="关闭侧栏"
          onClick={onClose}
        >
          <CloseOutlined />
        </button>
      </div>

      <div className="ai-sidebar-action-wrap">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="ai-new-chat-btn"
          onClick={onNewConversation}
          block
        >
          开启新对话
        </Button>
      </div>

      <div className="ai-sidebar-section">
        <div className="ai-sidebar-section__heading">
          <span>历史会话</span>
          <HistoryOutlined />
        </div>
        <div className="ai-conversations-container">
          <Conversations
            items={conversationItems}
            activeKey={activeConversationKey}
            onActiveChange={(key) => {
              onSelectConversation(key);
              onClose();
            }}
            menu={(item) => ({
              items: [
                {
                  key: "delete",
                  label: "删除会话",
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => onDeleteConversation?.(item.key),
                },
              ],
            })}
          />
        </div>
      </div>

      <div className="ai-sidebar-bottom">
        <div className="ai-sidebar-status">
          <span
            className={`ai-sidebar-status__dot ai-sidebar-status__dot--${agentStatus}`}
          />
          <span className="ai-sidebar-status__text">
            {statusLabels[agentStatus]}
          </span>
          {agentStatus === "offline" ? (
            <Tooltip title="服务不可用，请检查后端状态">
              <CloseOutlined style={{ color: "#ef4444" }} />
            </Tooltip>
          ) : (
            <CheckCircleFilled style={{ color: "#10b981" }} />
          )}
        </div>
        <button className="ai-sidebar-link" type="button">
          <SettingOutlined />
          <span>助手配置与权限</span>
        </button>
      </div>
    </aside>
  );
};

export default AssistantSidebar;
