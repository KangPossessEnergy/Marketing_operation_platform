import React from "react";
import { PaperClipOutlined, SendOutlined } from "@ant-design/icons";
import type { ChatComposerProps } from "../types";

const ChatComposer: React.FC<ChatComposerProps> = ({
  draft,
  isThinking,
  onDraftChange,
  onSend,
}) => (
  <form
    className="ai-composer"
    onSubmit={(event) => {
      event.preventDefault();
      onSend();
    }}
  >
    <div className="ai-composer__field">
      <textarea
        value={draft}
        rows={1}
        placeholder="描述你的目标，或直接提出一个问题..."
        onChange={(event) => onDraftChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            onSend();
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
    <button
      className="ai-send-button"
      type="submit"
      aria-label="发送消息"
      disabled={!draft.trim() || isThinking}
    >
      <SendOutlined />
    </button>
  </form>
);

export default ChatComposer;
