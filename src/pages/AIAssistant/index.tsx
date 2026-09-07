import React, { useEffect, useRef, useState } from "react";
import {
  BulbOutlined,
  CompassOutlined,
  HeartOutlined,
  LineChartOutlined,
  MenuOutlined,
  ReadOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Button, Tag, Typography } from "antd";
import { useNavigate } from "umi";
import RequireAuth from "@/components/Auth/RequireAuth";
import AssistantSidebar from "./components/AssistantSidebar";
import AssistantTopbar from "./components/AssistantTopbar";
import ChatComposer from "./components/ChatComposer";
import MessageList from "./components/MessageList";
import PromptSuggestions from "./components/PromptSuggestions";
import useAgentChat from "./hooks/useAgentChat";
import "./index.less";

const { Title, Paragraph } = Typography;

const AIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const {
    agentStatus,
    activeConversationKey,
    conversations,
    draft,
    hasStreamingText,
    isThinking,
    messages,
    activeThoughts,
    sendMessage,
    setDraft,
    stop,
    startNewConversation,
    selectConversation,
    deleteConversation,
    thinkingStatus,
  } = useAgentChat();

  const handleNewConversation = () => {
    startNewConversation();
    setIsSidebarOpen(false);
  };

  const currentConv = conversations.find(
    (c) => c.key === activeConversationKey,
  );

  // 判定是否是初始首屏状态（仅有欢迎语/未发送过对话）
  const isFirstScreen = messages.length <= 1 && !isThinking;

  // 消息更新或流式输出时平滑滚动到底部
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTo({
        top: chatAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isThinking, activeThoughts]);

  return (
    <RequireAuth>
      <div className="sitor-workbench">
        {/* 左侧会话侧边栏（仿 Sitor 风格） */}
        <AssistantSidebar
          isOpen={isSidebarOpen}
          collapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          agentStatus={agentStatus}
          activeConversationKey={activeConversationKey}
          conversations={conversations}
          onSelectConversation={selectConversation}
          onClose={() => setIsSidebarOpen(false)}
          onNewConversation={handleNewConversation}
          onDeleteConversation={deleteConversation}
        />

        {/* 右侧主交互区 */}
        <main className="sitor-workbench__main">
          {/* 顶部极简 Topbar */}
          <header className="sitor-topbar">
            <div className="sitor-topbar__left">
              <button
                className="sitor-icon-btn sitor-menu-btn"
                type="button"
                aria-label="打开侧边栏"
                onClick={() => setIsSidebarOpen(true)}
              >
                <MenuOutlined />
              </button>
              <div className="sitor-topbar-title-wrap">
                <span className="sitor-topbar-title">
                  {currentConv?.label || "AI Assistant"}
                </span>
                <span className="sitor-topbar-subtitle">AI 1v1 精通私教</span>
              </div>
            </div>

            <div className="sitor-topbar__right">
              <Tag color="gold" className="sitor-pro-badge">
                PRO
              </Tag>
              <button
                className="sitor-topbar-back-btn"
                type="button"
                onClick={() => navigate("/home")}
              >
                返回首页
              </button>
            </div>
          </header>

          {/* 中央主体区域（单屏不出现整体滚动条） */}
          <div className="sitor-workbench__content">
            <div className="sitor-chat-scroll-area" ref={chatAreaRef}>
              {isFirstScreen ? (
                /* 首屏展示：居中 Sitor 极简大标语与 6 宫格药丸推荐卡片 */
                <div className="sitor-hero-section">
                  <div className="sitor-hero-mark">
                    <span className="sitor-hero-brain-icon">💡</span>
                  </div>
                  <h1 className="sitor-hero-title">你好，我是 Sitor</h1>
                  <p className="sitor-hero-desc">
                    告诉我你对什么感兴趣，从零到精通，我带你
                  </p>

                  <div className="sitor-hero-prompts">
                    <PromptSuggestions onSelect={sendMessage} />
                  </div>
                </div>
              ) : (
                /* 真实对话消息流 */
                <div className="sitor-messages-container">
                  <MessageList
                    messages={messages}
                    isThinking={isThinking}
                    hasStreamingText={hasStreamingText}
                    thinkingStatus={thinkingStatus}
                    activeThoughts={activeThoughts}
                  />
                </div>
              )}
            </div>

            {/* 底部悬浮输入框 */}
            <div className="sitor-composer-dock">
              <ChatComposer
                draft={draft}
                isThinking={isThinking}
                onDraftChange={setDraft}
                onSend={sendMessage}
                onCancel={stop}
              />
            </div>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default AIAssistant;
