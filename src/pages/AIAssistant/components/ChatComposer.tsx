import React from "react";
import {
  AudioOutlined,
  CloseCircleOutlined,
  PaperClipOutlined,
  SendOutlined,
  ThunderboltOutlined,
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
      {/* 悬浮战术底座顶部的能量刻度线 */}
      <div className="assistant-composer-deck-indicator">
        <span className="deck-marker deck-marker--left" />
        <span className="deck-center-label">
          <ThunderboltOutlined style={{ marginRight: 4, color: "#00f2fe" }} />
          TACTICAL CPQ COMMAND DECK
        </span>
        <span className="deck-marker deck-marker--right" />
      </div>

      <div className={`assistant-composer-box ${isThinking ? "assistant-composer-box--active" : ""}`}>
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
          placeholder="输入客户采购需求、物料清单选型或售前方案诉求..."
          prefix={
            <Tooltip title="解析客户招标文件 / CAD户型图 / BOM物料清单">
              <Button
                type="text"
                icon={<PaperClipOutlined />}
                shape="circle"
                size="small"
                className="assistant-prefix-icon"
              />
            </Tooltip>
          }
          actions={(_, { SendButton }) => {
            if (isThinking) {
              return (
                <button
                  type="button"
                  className="assistant-abort-btn"
                  onClick={onCancel}
                  title="强行中止当前神经推理与流式生成"
                >
                  <CloseCircleOutlined />
                  <span>中止生成</span>
                </button>
              );
            }
            return (
              <Space size={12} align="center">
                <span className="assistant-voice-hint">
                  <AudioOutlined style={{ marginRight: 4, color: "#00f2fe" }} />
                  按 Enter 发送指令 · Shift+Enter 换行
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
