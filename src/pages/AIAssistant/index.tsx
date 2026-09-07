import React, { useEffect, useRef, useState } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "umi";
import RequireAuth from "@/components/Auth/RequireAuth";
import AssistantSidebar from "./components/AssistantSidebar";
import AssistantTopbar from "./components/AssistantTopbar";
import ChatComposer from "./components/ChatComposer";
import ConversationHeader from "./components/ConversationHeader";
import MessageList from "./components/MessageList";
import PromptSuggestions from "./components/PromptSuggestions";
import useAgentChat from "./hooks/useAgentChat";
import "./index.less";

const AIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  // 流式输出、消息更新时，自动滚动到底部
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
      <div className="ai-workbench">
        <AssistantSidebar
          isOpen={isSidebarOpen}
          agentStatus={agentStatus}
          activeConversationKey={activeConversationKey}
          conversations={conversations}
          onSelectConversation={selectConversation}
          onClose={() => setIsSidebarOpen(false)}
          onNewConversation={handleNewConversation}
          onDeleteConversation={deleteConversation}
        />

        <main className="ai-workbench__main">
          <AssistantTopbar
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onBackHome={() => navigate("/home")}
          />

          <section className="ai-workbench__content">
            <ConversationHeader
              messageCount={messages.length}
              activeTitle={currentConv?.label}
            />

            <div className="ai-chat-area" ref={chatAreaRef}>
              <MessageList
                messages={messages}
                isThinking={isThinking}
                hasStreamingText={hasStreamingText}
                thinkingStatus={thinkingStatus}
                activeThoughts={activeThoughts}
              />
              {messages.length <= 1 && !isThinking && (
                <PromptSuggestions onSelect={sendMessage} />
              )}
            </div>

            <ChatComposer
              draft={draft}
              isThinking={isThinking}
              onDraftChange={setDraft}
              onSend={sendMessage}
              onCancel={stop}
            />

            <footer className="ai-workbench__footer">
              <span>
                <ClockCircleOutlined />
                会话实时安全加密
              </span>
              <span>AI 生成内容请结合实际运营业务规则校验</span>
            </footer>
          </section>
        </main>
      </div>
    </RequireAuth>
  );
};

export default AIAssistant;
