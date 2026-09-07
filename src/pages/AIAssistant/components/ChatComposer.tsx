import React from "react";
import {
  AudioOutlined,
  PaperClipOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Sender } from "@ant-design/x";
import { Button, Space, Tooltip } from "antd";
import type { ChatComposerProps } from "../types";

const ChatComposer: React.FC<ChatComposerProps> = ({
  draft,
  isThinking,
  onDraftChange,
  onSend,
  onCancel,
}) => {
  return (
    <div className="assistant-composer-container">
      <div className="assistant-composer-box">
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
          placeholder="输入客户需求、售前咨询问题或输入报价配置诉求..."
          prefix={
            <Tooltip title="上传客户招标文件/户型图/物料清单">
              <Button
                type="text"
                icon={<PaperClipOutlined />}
                shape="circle"
                size="small"
                className="assistant-prefix-icon"
              />
            </Tooltip>
          }
          actions={(_, { SendButton, LoadingButton }) => {
            if (isThinking) {
              return <LoadingButton />;
            }
            return (
              <Space size={10} align="center">
                <span className="assistant-voice-hint">
                  <AudioOutlined style={{ marginRight: 4 }} />
                  Enter 发送 · Shift + Enter 换行 · 支持方案拆解与毛利测算
                </span>
                <SendButton
                  type="primary"
                  icon={<SendOutlined />}
                  disabled={!draft.trim()}
                  className="assistant-send-btn"
                />
              </Space>
            );
          }}
        />
      </div>
    </div>
  );
};

export default ChatComposer;
