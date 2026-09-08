import React, { useEffect, useRef, useState } from "react";
import {
  CalculatorOutlined,
  MenuOutlined,
  RollbackOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { useNavigate } from "umi";
import RequireAuth from "@/components/Auth/RequireAuth";
import AssistantSidebar from "./components/AssistantSidebar";
import ChatComposer from "./components/ChatComposer";
import MessageList from "./components/MessageList";
import PromptSuggestions from "./components/PromptSuggestions";
import useAgentChat from "./hooks/useAgentChat";
import "./index.less";

const AIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isExitingAssistant, setIsExitingAssistant] = useState(false);
  const [portalOrigin, setPortalOrigin] = useState({ x: 0, y: 0 });
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const handleBackHome = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isExitingAssistant) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setPortalOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setIsExitingAssistant(true);

    window.setTimeout(() => {
      navigate("/home", { state: { fromAssistant: true } });
    }, 720);
  };

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
    setIsSidebarCollapsed(false);
    setIsSidebarOpen(true);
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
      <div className="assistant-workbench">
        {/* 背景科技网格质感（契合 Home 页面） */}
        <div className="assistant-workbench__grid" aria-hidden="true" />
        <div className="assistant-workbench__ambient" aria-hidden="true" />

        {/* 左侧售前方案与会话侧边栏 */}
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
        <main className="assistant-workbench__main">
          {/* 顶部现代化 Topbar */}
          <header className="assistant-topbar">
            <div className="assistant-topbar__left">
              <button
                className="assistant-icon-btn assistant-menu-btn"
                type="button"
                aria-label="打开侧边栏"
                onClick={() => setIsSidebarOpen(true)}
              >
                <MenuOutlined />
              </button>
              <div className="assistant-topbar-title-wrap">
                <span className="section-kicker">ERP + CRM · PRE-SALES & CPQ</span>
                <span className="assistant-topbar-title">
                  {currentConv?.label || "AI 售前营销助手"}
                </span>
              </div>
            </div>

            <div className="assistant-topbar__right">
              <div className="assistant-topbar-status">
                <span className="assistant-topbar-status__dot" />
                <span className="assistant-topbar-status__text">PRE-SALES ENGINE READY</span>
              </div>

              <button
                className="assistant-topbar-back-btn"
                type="button"
                onClick={handleBackHome}
              >
                <RollbackOutlined />
                <span>返回工作台</span>
              </button>
            </div>
          </header>

          {/* 中央主体区域 */}
          <div className="assistant-workbench__content">
            <div className="assistant-chat-scroll-area" ref={chatAreaRef}>
              {isFirstScreen ? (
                /* 首屏展示：契合 Home 页面 Entry 风格的智能科技核心 Hero 与推荐场景 */
                <div className="assistant-hero-section">
                  <div className="assistant-hero-entry">
                    <div className="assistant-hero-orbit" aria-hidden="true">
                      <span className="assistant-hero-ring assistant-hero-ring--outer" />
                      <span className="assistant-hero-ring assistant-hero-ring--middle" />
                      <span className="assistant-hero-ring assistant-hero-ring--inner" />
                      <span className="assistant-hero-core">
                        <CalculatorOutlined />
                      </span>
                      <span className="assistant-hero-node assistant-hero-node--one" />
                      <span className="assistant-hero-node assistant-hero-node--two" />
                      <span className="assistant-hero-node assistant-hero-node--three" />
                    </div>

                    <div className="assistant-hero-copy">
                      <div className="assistant-hero-eyebrow">
                        <span className="assistant-hero-signal" />
                        <span>PRE-SALES & MARKETING COPILOT</span>
                      </div>
                      <h1 className="assistant-hero-title">AI 售前营销助手</h1>
                      <p className="assistant-hero-desc">
                        基于 CRM 客户需求与 ERP 供应链物料库，快速完成智能配置选型、实时成本与毛利测算、生成标准化报价方案与售前赢单话术。
                      </p>
                    </div>
                  </div>

                  <div className="assistant-hero-prompts">
                    <PromptSuggestions onSelect={sendMessage} />
                  </div>
                </div>
              ) : (
                /* 真实对话消息流 */
                <div className="assistant-messages-container">
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
            <div className="assistant-composer-dock">
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

        {/* 返回工作台圆形波纹扩展 Portal 动效 */}
        {isExitingAssistant && (
          <div
            className="assistant-transition"
            style={
              {
                "--transition-x": `${portalOrigin.x}px`,
                "--transition-y": `${portalOrigin.y}px`,
              } as React.CSSProperties
            }
            role="status"
            aria-live="polite"
          >
            <div className="assistant-transition__ring assistant-transition__ring--one" />
            <div className="assistant-transition__ring assistant-transition__ring--two" />
            <div className="assistant-transition__ring assistant-transition__ring--three" />
            <div className="assistant-transition__flash" />
            <div className="assistant-transition__label">
              <span className="assistant-transition__label-mark">
                <RollbackOutlined />
              </span>
              <span>正在返回工作台</span>
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
};

export default AIAssistant;
