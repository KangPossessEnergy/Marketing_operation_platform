import React from "react";
import { RightOutlined } from "@ant-design/icons";
import { promptSuggestions } from "../constants";
import type { PromptSuggestionsProps } from "../types";

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onSelect }) => {
  return (
    <div className="assistant-suggestions-section">
      <div className="assistant-suggestions-heading">
        <span className="section-kicker">SMART RECOMMENDATIONS</span>
        <h3 className="assistant-suggestions-title">推荐探索场景</h3>
      </div>

      <div className="assistant-suggestions-grid">
        {promptSuggestions.map((item) => {
          const IconComp = item.icon;
          const tone = item.tone || "blue";

          return (
            <button
              key={item.key}
              type="button"
              className="assistant-suggestion-card"
              onClick={() => onSelect(item.label)}
            >
              <div className="assistant-suggestion-card__header">
                {IconComp && (
                  <span
                    className={`assistant-card-icon assistant-card-icon--${tone}`}
                  >
                    <IconComp />
                  </span>
                )}
                {item.category && (
                  <span className={`assistant-card-badge assistant-card-badge--${tone}`}>
                    {item.category}
                  </span>
                )}
              </div>

              <div className="assistant-suggestion-card__body">
                <span className="assistant-suggestion-card__title">
                  {item.label}
                </span>
                {item.description && (
                  <span className="assistant-suggestion-card__desc">
                    {item.description}
                  </span>
                )}
              </div>

              <span className="assistant-suggestion-card__arrow" aria-hidden="true">
                <RightOutlined />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PromptSuggestions;
