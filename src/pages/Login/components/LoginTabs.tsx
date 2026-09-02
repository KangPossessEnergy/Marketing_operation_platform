import React from "react";
import { LoginMode } from "../types";

interface LoginTabsProps {
  mode: LoginMode;
  onModeChange: (mode: LoginMode) => void;
}

const LoginTabs: React.FC<LoginTabsProps> = ({ mode, onModeChange }) => {
  return (
    <div className="login-tabs" role="tablist" aria-label="登录方式">
      <button
        className={mode === "password" ? "is-active" : ""}
        onClick={() => onModeChange("password")}
        role="tab"
        aria-selected={mode === "password"}
        type="button"
      >
        密码登录
      </button>
      <button
        className={mode === "sms" ? "is-active" : ""}
        onClick={() => onModeChange("sms")}
        role="tab"
        aria-selected={mode === "sms"}
        type="button"
      >
        短信登录
      </button>
    </div>
  );
};

export default LoginTabs;
