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
  description?: string;
  icon?: ElementType;
  category?: string;
  tone?: "blue" | "cyan" | "violet" | "orange";
};

export type ConversationItem = {
  key: string;
  label: string;
  time: string; // 相对时间或具体时间，如 "刚刚"、"6 天前"
  timestamp: number; // 毫秒时间戳用于排序与时间分组
  group?: string; // "今天" | "7 天前" | "更早" | "学习足迹"
  pinned?: boolean;
};

export type AssistantSidebarProps = {
  isOpen: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
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
  sidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: () => void;
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
