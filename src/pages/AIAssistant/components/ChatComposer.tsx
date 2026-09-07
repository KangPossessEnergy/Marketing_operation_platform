import React from "react";
import { PaperClipOutlined } from "@ant-design/icons";
import { Sender } from "@ant-design/x";
import { Button, Tooltip } from "antd";
import type { ChatComposerProps } from "../types";

const ChatComposer: React.FC<ChatComposerProps> = ({
  draft,
  isThinking,
  onDraftChange,
  onSend,
  onCancel,
}) => {
  return (
    <div className="ai-composer-wrapper">
      <Sender
        value={draft}
        onChange={onDraftChange}
        onSubmit={() => {
          if (draft.trim()) {
            onSend(draft);
          }
        }}
        onCancel={onCancel}
        loading={isThinking}
        placeholder="描述您的营销目标，或直接提出具体问题（Shift + Enter 换行）..."
        prefix={
          <Tooltip title="上传素材或数据文件 (支持 CSV/Excel/图片)">
            <Button
              type="text"
              icon={<PaperClipOutlined />}
              shape="circle"
              size="small"
              className="ai-composer-attach-btn"
            />
          </Tooltip>
        }
      />
    </div>
  );
};

export default ChatComposer;
