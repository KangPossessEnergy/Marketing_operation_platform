import React from "react";
import { Prompts } from "@ant-design/x";
import type { PromptsItemType } from "@ant-design/x";
import { Typography } from "antd";
import { promptSuggestions } from "../constants";
import type { PromptSuggestionsProps } from "../types";

const { Title } = Typography;

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onSelect }) => {
  const items: PromptsItemType[] = promptSuggestions.map((item) => {
    const IconComponent = item.icon;
    return {
      key: item.key,
      icon: <IconComponent style={{ fontSize: 18, color: "#2563eb" }} />,
      label: item.label,
      description: item.description,
    };
  });

  return (
    <div className="ai-prompts-section">
      <div className="ai-prompts-header">
        <Title level={5} style={{ margin: 0, color: "#64748b" }}>
          💡 您可以从以下场景开始提问：
        </Title>
      </div>
      <Prompts
        items={items}
        onItemClick={(info) => {
          const matched = promptSuggestions.find((p) => p.key === info.data.key);
          if (matched) {
            onSelect(`请帮我${matched.label}：${matched.description}`);
          }
        }}
        styles={{
          item: {
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            transition: "all 0.2s ease",
            background: "#ffffff",
          },
        }}
      />
    </div>
  );
};

export default PromptSuggestions;
