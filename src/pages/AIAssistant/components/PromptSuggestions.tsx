import React from "react";
import { Prompts } from "@ant-design/x";
import type { PromptsItemType } from "@ant-design/x";
import { promptSuggestions } from "../constants";
import type { PromptSuggestionsProps } from "../types";

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onSelect }) => {
  const items: PromptsItemType[] = promptSuggestions.map((item) => {
    const IconComponent = item.icon;
    return {
      key: item.key,
      icon: IconComponent ? (
        <IconComponent style={{ fontSize: 16, color: "#475569" }} />
      ) : undefined,
      label: item.label,
      description: item.description,
    };
  });

  return (
    <div className="sitor-prompts-section">
      <div className="sitor-prompts-subtitle">或者试试这些</div>
      <Prompts
        items={items}
        wrap
        onItemClick={(info) => {
          const matched = promptSuggestions.find((p) => p.key === info.data.key);
          if (matched) {
            onSelect(matched.label);
          }
        }}
        styles={{
          item: {
            borderRadius: 9999,
            padding: "8px 18px",
            border: "1px solid #e2e8f0",
            background: "#ffffff",
            cursor: "pointer",
            fontSize: 13,
            color: "#334155",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            transition: "all 0.2s ease",
          },
        }}
      />
    </div>
  );
};

export default PromptSuggestions;
