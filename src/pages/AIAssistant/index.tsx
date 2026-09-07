import React, { useState } from "react";
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
  const {
    agentStatus,
    draft,
    isThinking,
    messages,
    sendMessage,
    setDraft,
    startNewConversation,
    thinkingStatus,
  } = useAgentChat();

  const handleNewConversation = () => {
    startNewConversation();
    setIsSidebarOpen(false);
  };

  return (
    <RequireAuth>
      <div className="ai-workbench">
        <AssistantSidebar
          isOpen={isSidebarOpen}
          agentStatus={agentStatus}
          onClose={() => setIsSidebarOpen(false)}
          onNewConversation={handleNewConversation}
        />

        <main className="ai-workbench__main">
          <AssistantTopbar
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onBackHome={() => navigate("/home")}
          />

          <section className="ai-workbench__content">
            <ConversationHeader messageCount={messages.length} />

            <div className="ai-chat-area">
              <MessageList
                messages={messages}
                isThinking={isThinking}
                thinkingStatus={thinkingStatus}
              />
              {messages.length === 1 && !isThinking && (
                <PromptSuggestions onSelect={sendMessage} />
              )}
            </div>

            <ChatComposer
              draft={draft}
              isThinking={isThinking}
              onDraftChange={setDraft}
              onSend={sendMessage}
            />

            <footer className="ai-workbench__footer">
              <span>
                <ClockCircleOutlined />
                对话内容仅保存在当前工作区
              </span>
              <span>AI 生成内容请结合实际业务校验</span>
            </footer>
          </section>
        </main>
      </div>
    </RequireAuth>
  );
};

export default AIAssistant;
