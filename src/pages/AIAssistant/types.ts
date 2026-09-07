import type { ElementType } from "react";

export type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  time: string;
};

export type AgentConnectionStatus = "checking" | "online" | "offline";

export type PromptSuggestion = {
  title: string;
  description: string;
  icon: ElementType;
};

export type Conversation = {
  title: string;
  time: string;
  active: boolean;
};

export type AssistantSidebarProps = {
  isOpen: boolean;
  agentStatus: AgentConnectionStatus;
  onClose: () => void;
  onNewConversation: () => void;
};

export type AssistantTopbarProps = {
  onOpenSidebar: () => void;
  onBackHome: () => void;
};

export type ConversationHeaderProps = {
  messageCount: number;
};

export type MessageListProps = {
  messages: ChatMessage[];
  isThinking: boolean;
  thinkingStatus: string;
};

export type PromptSuggestionsProps = {
  onSelect: (prompt: string) => void;
};

export type ChatComposerProps = {
  draft: string;
  isThinking: boolean;
  onDraftChange: (draft: string) => void;
  onSend: () => void;
};
