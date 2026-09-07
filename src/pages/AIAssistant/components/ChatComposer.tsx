import React from "react";
import {
  AudioOutlined,
  CompassOutlined,
  GlobalOutlined,
  PaperClipOutlined,
  RobotOutlined,
  WechatOutlined,
  GithubOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { Sender } from "@ant-design/x";
import { Button, Space, Tag, Tooltip } from "antd";
import type { ChatComposerProps } from "../types";

const ChatComposer: React.FC<ChatComposerProps> = ({
  draft,
  isThinking,
  onDraftChange,
  onSend,
  onCancel,
}) => {
  return (
    <div className="sitor-composer-container">
      <div className="sitor-composer-box">
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
          placeholder="你想学什么？"
          prefix={
            <Space size={8} className="sitor-composer-prefix-actions">
              <Tooltip title="上传素材或知识库文件">
                <Button
                  type="text"
                  icon={<PaperClipOutlined />}
                  shape="circle"
                  size="small"
                  className="sitor-prefix-icon"
                />
              </Tooltip>
              <Tooltip title="机器人模式">
                <Button
                  type="text"
                  icon={<RobotOutlined />}
                  shape="circle"
                  size="small"
                  className="sitor-prefix-icon"
                />
              </Tooltip>
              <Tooltip title="企微 / 微信通道">
                <Button
                  type="text"
                  icon={<WechatOutlined />}
                  shape="circle"
                  size="small"
                  className="sitor-prefix-icon"
                />
              </Tooltip>
              <Tooltip title="代码仓库">
                <Button
                  type="text"
                  icon={<GithubOutlined />}
                  shape="circle"
                  size="small"
                  className="sitor-prefix-icon"
                />
              </Tooltip>
              <Tag color="orange" className="sitor-tag-badge">
                ☕ 温暖私教
              </Tag>
              <Tag color="default" className="sitor-tag-badge sitor-tag-badge--subtle">
                🌐 深度调研 •
              </Tag>
            </Space>
          }
          actions={(_, { SendButton, LoadingButton }) => {
            if (isThinking) {
              return <LoadingButton />;
            }
            return (
              <Space size={8} align="center">
                <span className="sitor-voice-hint">
                  <AudioOutlined style={{ marginRight: 4 }} />
                  长按 ⌥ Option 语音输入
                </span>
                <SendButton
                  type="primary"
                  icon={<ArrowUpOutlined />}
                  disabled={!draft.trim()}
                  className="sitor-send-btn"
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
