import React, { useMemo, useState } from "react";
import {
  ArrowLeftOutlined,
  BulbOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  CloseOutlined,
  FileSearchOutlined,
  HistoryOutlined,
  MenuOutlined,
  MessageOutlined,
  PaperClipOutlined,
  PlusOutlined,
  RobotOutlined,
  SendOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useNavigate } from "umi";
import "./index.less";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  content: string;
  time: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: "assistant",
    content: "你好，我是你的运营助手。告诉我今天想推进什么，我会把目标拆成清晰可执行的下一步。",
    time: "刚刚",
  },
];

const promptSuggestions = [
  { title: "生成运营方案", description: "围绕新品或活动快速起草方案", icon: <BulbOutlined /> },
  { title: "分析经营数据", description: "从销售、库存中提炼关键结论", icon: <FileSearchOutlined /> },
  { title: "优化商品文案", description: "让卖点表达更准确、更有转化力", icon: <ThunderboltOutlined /> },
];

const conversationList = [
  { title: "新品发布会运营方案", time: "今天 10:42", active: true },
  { title: "本周商城数据复盘", time: "昨天 16:08", active: false },
  { title: "全屋智能产品卖点提炼", time: "9月 04日", active: false },
];

const formatTime = () =>
  new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());

const getAssistantReply = (content: string) => {
  if (content.includes("数据") || content.includes("分析")) {
    return "可以。我会先按销售额、订单量、库存周转和异常波动四个维度整理，再输出一版适合汇报的结论。你也可以直接上传数据文件，我会继续往下处理。";
  }

  if (content.includes("文案") || content.includes("商品")) {
    return "收到。我建议先明确目标人群和核心场景，再把功能翻译成用户能感知的利益点。把商品信息发给我，我可以直接给你三种风格的版本。";
  }

  return "好的。我会先拆解目标、受众和关键动作，再给你一版可直接修改的执行框架。你可以补充预算、时间和期望结果，让方案更贴近实际。";
};

const AIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const messageCountLabel = useMemo(() => `${messages.length} 条消息`, [messages.length]);

  const startNewConversation = () => {
    setMessages(initialMessages);
    setDraft("");
    setIsThinking(false);
    setIsSidebarOpen(false);
  };

  const sendMessage = (content = draft) => {
    const trimmedContent = content.trim();
    if (!trimmedContent || isThinking) {
      return;
    }

    const now = formatTime();
    setMessages((currentMessages) => [
      ...currentMessages,
      { id: Date.now(), role: "user", content: trimmedContent, time: now },
    ]);
    setDraft("");
    setIsThinking(true);

    window.setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: getAssistantReply(trimmedContent),
          time: formatTime(),
        },
      ]);
      setIsThinking(false);
    }, 650);
  };

  return (
    <div className="ai-workbench">
      <aside className={`ai-workbench__sidebar ${isSidebarOpen ? "ai-workbench__sidebar--open" : ""}`}>
        <div className="ai-workbench__brand">
          <span className="ai-workbench__brand-mark">
            <span className="ai-workbench__brand-orbit" />
            <RobotOutlined />
          </span>
          <span>
            <strong>AI 助手</strong>
            <small>运营智能工作台</small>
          </span>
          <button
            className="ai-icon-button ai-icon-button--mobile"
            type="button"
            aria-label="关闭侧栏"
            onClick={() => setIsSidebarOpen(false)}
          >
            <CloseOutlined />
          </button>
        </div>

        <button className="ai-new-chat" type="button" onClick={startNewConversation}>
          <PlusOutlined />
          <span>开启新对话</span>
          <kbd>⌘ K</kbd>
        </button>

        <div className="ai-sidebar-section">
          <div className="ai-sidebar-section__heading">
            <span>最近对话</span>
            <HistoryOutlined />
          </div>
          <div className="ai-conversation-list">
            {conversationList.map((conversation) => (
              <button
                className={`ai-conversation ${conversation.active ? "ai-conversation--active" : ""}`}
                key={conversation.title}
                type="button"
                onClick={() => setIsSidebarOpen(false)}
              >
                <MessageOutlined />
                <span>
                  <strong>{conversation.title}</strong>
                  <small>{conversation.time}</small>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="ai-sidebar-bottom">
          <div className="ai-sidebar-status">
            <span className="ai-sidebar-status__dot" />
            <span>智能引擎在线</span>
            <CheckCircleFilled />
          </div>
          <button className="ai-sidebar-link" type="button">
            <SettingOutlined />
            <span>工作台设置</span>
          </button>
        </div>
      </aside>

      <main className="ai-workbench__main">
        <header className="ai-workbench__topbar">
          <div className="ai-topbar__left">
            <button
              className="ai-icon-button ai-menu-button"
              type="button"
              aria-label="打开对话列表"
              onClick={() => setIsSidebarOpen(true)}
            >
              <MenuOutlined />
            </button>
            <button className="ai-back-button" type="button" onClick={() => navigate("/home")}>
              <ArrowLeftOutlined />
              <span>返回首页</span>
            </button>
            <span className="ai-topbar__divider" />
            <span className="ai-topbar__context">运营智能工作台</span>
          </div>
          <div className="ai-topbar__right">
            <span className="ai-live-indicator">
              <span />
              LIVE
            </span>
            <button className="ai-icon-button" type="button" aria-label="工作台设置">
              <SettingOutlined />
            </button>
          </div>
        </header>

        <section className="ai-workbench__content">
          <div className="ai-conversation-header">
            <div>
              <span className="ai-overline">CONVERSATION 01</span>
              <h1>今天，想让 AI 帮你推进什么？</h1>
              <p>{messageCountLabel} · 上下文已准备就绪</p>
            </div>
            <div className="ai-model-badge">
              <span className="ai-model-badge__dot" />
              <span>
                <strong>运营专家</strong>
                <small>Reasoning mode</small>
              </span>
            </div>
          </div>

          <div className="ai-chat-area">
            <div className="ai-message-list">
              {messages.map((message) => (
                <article
                  className={`ai-message ai-message--${message.role}`}
                  key={message.id}
                >
                  <div className="ai-message__avatar">
                    {message.role === "assistant" ? <RobotOutlined /> : "我"}
                  </div>
                  <div className="ai-message__body">
                    <div className="ai-message__meta">
                      <strong>{message.role === "assistant" ? "AI 助手" : "我"}</strong>
                      <span>{message.time}</span>
                    </div>
                    <p>{message.content}</p>
                  </div>
                </article>
              ))}
              {isThinking && (
                <article className="ai-message ai-message--assistant">
                  <div className="ai-message__avatar">
                    <RobotOutlined />
                  </div>
                  <div className="ai-message__body">
                    <div className="ai-message__meta">
                      <strong>AI 助手</strong>
                      <span>正在思考</span>
                    </div>
                    <div className="ai-thinking">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </article>
              )}
            </div>

            {messages.length === 1 && !isThinking && (
              <div className="ai-suggestions">
                <div className="ai-suggestions__heading">
                  <span>从一个方向开始</span>
                  <small>快速唤起常用能力</small>
                </div>
                <div className="ai-suggestion-grid">
                  {promptSuggestions.map((suggestion) => (
                    <button
                      className="ai-suggestion"
                      type="button"
                      key={suggestion.title}
                      onClick={() => sendMessage(suggestion.title)}
                    >
                      <span className="ai-suggestion__icon">{suggestion.icon}</span>
                      <span>
                        <strong>{suggestion.title}</strong>
                        <small>{suggestion.description}</small>
                      </span>
                      <ArrowLeftOutlined />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form
            className="ai-composer"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <div className="ai-composer__field">
              <textarea
                value={draft}
                rows={1}
                placeholder="描述你的目标，或直接提出一个问题..."
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <div className="ai-composer__tools">
                <button className="ai-composer__tool" type="button" aria-label="添加附件">
                  <PaperClipOutlined />
                </button>
                <span>Shift + Enter 换行</span>
              </div>
            </div>
            <button className="ai-send-button" type="submit" aria-label="发送消息" disabled={!draft.trim() || isThinking}>
              <SendOutlined />
            </button>
          </form>

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
  );
};

export default AIAssistant;
