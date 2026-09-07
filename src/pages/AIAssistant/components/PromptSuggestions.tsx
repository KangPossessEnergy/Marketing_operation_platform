import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { promptSuggestions } from "../constants";
import type { PromptSuggestionsProps } from "../types";

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onSelect }) => (
  <div className="ai-suggestions">
    <div className="ai-suggestions__heading">
      <span>从一个方向开始</span>
      <small>快速唤起常用能力</small>
    </div>
    <div className="ai-suggestion-grid">
      {promptSuggestions.map((suggestion) => (
        <PromptSuggestion
          key={suggestion.title}
          suggestion={suggestion}
          onSelect={onSelect}
        />
      ))}
    </div>
  </div>
);

type PromptSuggestionItemProps = {
  suggestion: (typeof promptSuggestions)[number];
  onSelect: (prompt: string) => void;
};

const PromptSuggestion: React.FC<PromptSuggestionItemProps> = ({
  suggestion,
  onSelect,
}) => {
  const SuggestionIcon = suggestion.icon;

  return (
    <button
      className="ai-suggestion"
      type="button"
      onClick={() => onSelect(suggestion.title)}
    >
      <span className="ai-suggestion__icon">
        <SuggestionIcon />
      </span>
      <span>
        <strong>{suggestion.title}</strong>
        <small>{suggestion.description}</small>
      </span>
      <ArrowLeftOutlined />
    </button>
  );
};

export default PromptSuggestions;
