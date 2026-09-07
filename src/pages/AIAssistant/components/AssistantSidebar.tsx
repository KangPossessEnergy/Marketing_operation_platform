import React from "react";
import {
  CalculatorOutlined,
  CloseOutlined,
  DeleteOutlined,
  FileDoneOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  SettingOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Conversations } from "@ant-design/x";
import type { ConversationItemType } from "@ant-design/x";
import type {
  AgentConnectionStatus,
  AssistantSidebarProps,
} from "../types";

const statusLabels: Record<AgentConnectionStatus, string> = {
  checking: "服务连接中",
  online: "报价引擎在线",
  offline: "服务离线",
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
  // 转换为 Ant Design X Conversations 格式并映射
  const conversationItems: ConversationItemType[] = conversations.map(
    (item) => ({
      key: item.key,
      label: (
        <div className="assistant-conv-item">
          <span className="assistant-conv-item__icon">
            <FileDoneOutlined />
          </span>
          <div className="assistant-conv-item__text">
            <span className="assistant-conv-item__title">{item.label}</span>
            <span className="assistant-conv-item__time">{item.time}</span>
          </div>
        </div>
      ),
      timestamp: item.timestamp,
      group: item.group || "方案与咨询",
    }),
  );

  return (
    <aside
      className={`assistant-sidebar ${
        isOpen ? "assistant-sidebar--open" : ""
      } ${collapsed ? "assistant-sidebar--collapsed" : ""}`}
    >
      {/* 顶部 Brand 区域 - 对齐 ERP+CRM 售前营销助手 */}
      <div className="assistant-sidebar__brand">
        <div className="assistant-brand-logo">
          <span className="assistant-brand-icon">
            <CalculatorOutlined />
          </span>
          {!collapsed && (
            <div className="assistant-brand-info">
              <span className="assistant-brand-name">AI 售前营销助手</span>
              <span className="assistant-brand-sub">PRE-SALES & CPQ</span>
            </div>
          )}
        </div>

        {onToggleCollapse && (
          <button
            className="assistant-collapse-btn"
            onClick={onToggleCollapse}
            type="button"
            title={collapsed ? "展开侧边栏" : "收起侧边栏"}
          >
            {collapsed ? <RightOutlined /> : <LeftOutlined />}
          </button>
        )}

        <button
          className="assistant-close-mobile-btn"
          type="button"
          aria-label="关闭侧栏"
          onClick={onClose}
        >
          <CloseOutlined />
        </button>
      </div>

      {/* 新建会话操作按钮 */}
      <div className="assistant-sidebar__action">
        <button
          type="button"
          className="assistant-new-chat-btn"
          onClick={onNewConversation}
        >
          <span className="assistant-new-chat-icon">
            <PlusOutlined />
          </span>
          {!collapsed && (
            <span className="assistant-new-chat-label">新建售前方案</span>
          )}
        </button>
      </div>

      {/* 会话列表区域 */}
      <div className="assistant-sidebar__list-wrap">
        {!collapsed && (
          <div className="assistant-list-header">
            <span className="section-kicker">QUOTATIONS & LEADS</span>
            <span className="assistant-list-count">{conversations.length}</span>
          </div>
        )}

        <div className="assistant-conversations-container">
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
                  label: "删除记录",
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
      <div className="assistant-sidebar__footer">
        <div className="assistant-footer-status">
          <span
            className={`assistant-status-dot assistant-status-dot--${agentStatus}`}
          />
          {!collapsed && (
            <span className="assistant-status-text">
              {statusLabels[agentStatus]}
            </span>
          )}
        </div>

        <button className="assistant-footer-btn" type="button" title="设置">
          <SettingOutlined />
          {!collapsed && <span>报价规则配置</span>}
        </button>
      </div>
    </aside>
  );
};

export default AssistantSidebar;
