import React from "react";
import {
  ArrowLeftOutlined,
  MenuOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { AssistantTopbarProps } from "../types";

const AssistantTopbar: React.FC<AssistantTopbarProps> = ({
  onOpenSidebar,
  onBackHome,
}) => (
  <header className="ai-workbench__topbar">
    <div className="ai-topbar__left">
      <button
        className="ai-icon-button ai-menu-button"
        type="button"
        aria-label="打开对话列表"
        onClick={onOpenSidebar}
      >
        <MenuOutlined />
      </button>
      <button className="ai-back-button" type="button" onClick={onBackHome}>
        <ArrowLeftOutlined />
        <span>返回首页</span>
      </button>
      <span className="ai-topbar__divider" />
      <span className="ai-topbar__context">运营智能工作台</span>
    </div>
    <div className="ai-topbar__right">
      <span className="ai-live-indicator">
        <span />
        LIVE
      </span>
      <button className="ai-icon-button" type="button" aria-label="工作台设置">
        <SettingOutlined />
      </button>
    </div>
  </header>
);

export default AssistantTopbar;
