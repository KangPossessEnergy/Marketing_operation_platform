import React from "react";
import { RobotOutlined, UserOutlined } from "@ant-design/icons";
import { Bubble, ThoughtChain } from "@ant-design/x";
import type { ThoughtChainItemProps } from "@ant-design/x";
import { Avatar, Space, Typography } from "antd";
import type { MessageListProps } from "../types";

const { Text } = Typography;

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isThinking,
  hasStreamingText,
  thinkingStatus,
  activeThoughts,
}) => {
  return (
    <div className="ai-message-list-container">
      {messages.map((message) => {
        const isUser = message.role === "user";
        const hasThoughtChain =
          message.thoughtChain && message.thoughtChain.length > 0;

        // 如果是正在生成的助手消息且没有文本，显示占位思考状态
        if (
          !isUser &&
          !message.content &&
          isThinking &&
          activeThoughts &&
          activeThoughts.length > 0
        ) {
          const thoughtItems: ThoughtChainItemProps[] = activeThoughts.map(
            (t) => ({
              key: t.key,
              title: t.title,
              description: t.description,
              status: t.status,
            }),
          );

          return (
            <div key={message.id} className="ai-bubble-item ai-bubble-item--ai">
              <Bubble
                placement="start"
                avatar={
                  <Avatar
                    style={{ backgroundColor: "#2563eb" }}
                    icon={<RobotOutlined />}
                  />
                }
                header={
                  <Space size={8}>
                    <Text strong>AI 助手</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {message.time}
                    </Text>
                  </Space>
                }
                content={
                  <div className="ai-bubble-content">
                    <div className="ai-thought-wrapper">
                      <ThoughtChain
                        items={thoughtItems}
                        style={{ marginBottom: 8 }}
                      />
                    </div>
                    <Text type="secondary" italic>
                      {thinkingStatus}
                    </Text>
                  </div>
                }
              />
            </div>
          );
        }

        if (!message.content && !hasThoughtChain) {
          return null;
        }

        const thoughtItems: ThoughtChainItemProps[] = (
          message.thoughtChain || []
        ).map((t) => ({
          key: t.key,
          title: t.title,
          description: t.description,
          status: t.status,
        }));

        return (
          <div
            key={message.id}
            className={`ai-bubble-item ${
              isUser ? "ai-bubble-item--user" : "ai-bubble-item--ai"
            }`}
          >
            <Bubble
              placement={isUser ? "end" : "start"}
              avatar={
                isUser ? (
                  <Avatar
                    style={{ backgroundColor: "#10b981" }}
                    icon={<UserOutlined />}
                  />
                ) : (
                  <Avatar
                    style={{ backgroundColor: "#2563eb" }}
                    icon={<RobotOutlined />}
                  />
                )
              }
              header={
                <Space size={8}>
                  <Text strong>{isUser ? "我" : "AI 助手"}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {message.time}
                  </Text>
                </Space>
              }
              content={
                <div className="ai-bubble-content">
                  {hasThoughtChain && (
                    <div className="ai-thought-wrapper">
                      <ThoughtChain
                        items={thoughtItems}
                        style={{ marginBottom: 12 }}
                      />
                    </div>
                  )}
                  <div className="ai-bubble-text">{message.content}</div>
                </div>
              }
              typing={
                message.isStreaming
                  ? { effect: "typing", step: 2, interval: 30 }
                  : undefined
              }
            />
          </div>
        );
      })}

      {/* 当助手正在初始思考且尚未有文本流时 */}
      {isThinking && !hasStreamingText && (!activeThoughts || activeThoughts.length === 0) && (
        <div className="ai-bubble-item ai-bubble-item--ai">
          <Bubble
            placement="start"
            avatar={
              <Avatar
                style={{ backgroundColor: "#2563eb" }}
                icon={<RobotOutlined />}
              />
            }
            header={
              <Space size={8}>
                <Text strong>AI 助手</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  思考中...
                </Text>
              </Space>
            }
            loading
            content={
              <Text type="secondary">
                {thinkingStatus || "正在规划执行路径并检索相关数据..."}
              </Text>
            }
          />
        </div>
      )}
    </div>
  );
};

export default MessageList;
