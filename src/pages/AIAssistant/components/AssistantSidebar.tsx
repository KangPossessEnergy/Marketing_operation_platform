import React from "react";
import {
  CheckCircleFilled,
  CloseOutlined,
  CommentOutlined,
  DeleteOutlined,
  HistoryOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  RobotOutlined,
  SettingOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Conversations } from "@ant-design/x";
import type { ConversationItemType } from "@ant-design/x";
import { Button, Tooltip } from "antd";
import type {
  AgentConnectionStatus,
  AssistantSidebarProps,
} from "../types";

const statusLabels: Record<AgentConnectionStatus, string> = {
  checking: "引擎连接中",
  online: "引擎在线",
  offline: "引擎离线",
};

const AssistantSidebar: React.FC<AssistantSidebarProps> = ({
  isOpen,
  collapsed = false,
  onToggleCollapse,
  agentStatus,
  activeConversationKey,
  conversations,
  onSelectConversation,
  onClose,
  onNewConversation,
  onDeleteConversation,
}) => {
  // 转换为 Ant Design X Conversations 格式并映射时间分组 (模仿 Sitor)
  const conversationItems: ConversationItemType[] = conversations.map(
    (item) => ({
      key: item.key,
      label: (
        <div className="sitor-conv-item">
          <CommentOutlined className="sitor-conv-item__icon" />
          <div className="sitor-conv-item__text">
            <span className="sitor-conv-item__title">{item.label}</span>
            <span className="sitor-conv-item__time">{item.time}</span>
          </div>
        </div>
      ),
      timestamp: item.timestamp,
      group: item.group || "新对话",
    }),
  );

  return (
    <aside
      className={`sitor-sidebar ${
        isOpen ? "sitor-sidebar--open" : ""
      } ${collapsed ? "sitor-sidebar--collapsed" : ""}`}
    >
      {/* 顶部 Brand 区域 */}
      <div className="sitor-sidebar__brand">
        <div className="sitor-brand-logo">
          <span className="sitor-brand-icon">
            <RobotOutlined />
          </span>
          {!collapsed && (
            <div className="sitor-brand-info">
              <span className="sitor-brand-name">AI Assistant</span>
              <span className="sitor-brand-sub">营销运营私教</span>
            </div>
          )}
        </div>

        {onToggleCollapse && (
          <button
            className="sitor-collapse-btn"
            onClick={onToggleCollapse}
            type="button"
            title={collapsed ? "展开侧边栏" : "收起侧边栏"}
          >
            {collapsed ? <RightOutlined /> : <LeftOutlined />}
          </button>
        )}

        <button
          className="sitor-close-mobile-btn"
          type="button"
          aria-label="关闭侧栏"
          onClick={onClose}
        >
          <CloseOutlined />
        </button>
      </div>

      {/* 新建会话操作按钮 */}
      <div className="sitor-sidebar__action">
        <Button
          type="default"
          icon={<PlusOutlined />}
          className="sitor-new-chat-btn"
          onClick={onNewConversation}
          block
        >
          {!collapsed && <span>新对话</span>}
        </Button>
      </div>

      {/* 会话列表区域 */}
      <div className="sitor-sidebar__list-wrap">
        {!collapsed && (
          <div className="sitor-list-header">
            <span>新对话</span>
            <span className="sitor-list-count">{conversations.length}</span>
          </div>
        )}

        <div className="sitor-conversations-container">
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

      {/* 底部功能栏 */}
      <div className="sitor-sidebar__footer">
        <div className="sitor-footer-status">
          <span
            className={`sitor-status-dot sitor-status-dot--${agentStatus}`}
          />
          {!collapsed && (
            <span className="sitor-status-text">
              {statusLabels[agentStatus]}
            </span>
          )}
        </div>

        <button className="sitor-footer-btn" type="button" title="设置">
          <SettingOutlined />
          {!collapsed && <span>助手配置</span>}
        </button>
      </div>
    </aside>
  );
};

export default AssistantSidebar;
