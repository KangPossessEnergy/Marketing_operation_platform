import type { ElementType, ReactNode } from "react";

export type ThoughtStep = {
  key: string;
  title: string;
  status: "loading" | "success" | "error" | "abort";
  description?: ReactNode;
  content?: ReactNode;
  extra?: ReactNode;
};

export type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  time: string;
  thoughtChain?: ThoughtStep[];
  isStreaming?: boolean;
};

export type AgentConnectionStatus = "checking" | "online" | "offline";

export type PromptSuggestion = {
  key: string;
  label: string;
  description: string;
  icon: ElementType;
};

export type ConversationItem = {
  key: string;
  label: string;
  time: string;
  pinned?: boolean;
};

export type AssistantSidebarProps = {
  isOpen: boolean;
  agentStatus: AgentConnectionStatus;
  activeConversationKey: string;
  conversations: ConversationItem[];
  onSelectConversation: (key: string) => void;
  onClose: () => void;
  onNewConversation: () => void;
  onDeleteConversation?: (key: string) => void;
};

export type AssistantTopbarProps = {
  onOpenSidebar: () => void;
  onBackHome: () => void;
};

export type ConversationHeaderProps = {
  messageCount: number;
  activeTitle?: string;
};

export type MessageListProps = {
  messages: ChatMessage[];
  isThinking: boolean;
  hasStreamingText: boolean;
  thinkingStatus: string;
  activeThoughts?: ThoughtStep[];
};

export type PromptSuggestionsProps = {
  onSelect: (prompt: string) => void;
};

export type ChatComposerProps = {
  draft: string;
  isThinking: boolean;
  onDraftChange: (draft: string) => void;
  onSend: (content?: string) => void;
  onCancel?: () => void;
};
