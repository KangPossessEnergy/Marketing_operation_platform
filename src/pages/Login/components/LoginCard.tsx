import React from "react";
import LoginForm, { LoginFormProps } from "./LoginForm";
import LoginTabs from "./LoginTabs";
import { LoginMode } from "@/types/Login";

interface LoginCardProps {
  mode: LoginMode;
  formProps: LoginFormProps;
  onModeChange: (mode: LoginMode) => void;
  onRegister: () => void;
}

const LoginCard: React.FC<LoginCardProps> = ({
  mode,
  formProps,
  onModeChange,
  onRegister,
}) => {
  return (
    <div className="login-card">
      <div className="login-card__intro">
        <p className="login-card__eyebrow">MARKETING OPERATIONS PLATFORM</p>
        <h1>欢迎登录</h1>
        <p className="login-card__description">
          连接数据、内容与增长，让每一次营销决策更有价值
        </p>
      </div>

      <LoginTabs mode={mode} onModeChange={onModeChange} />
      <LoginForm {...formProps} />

      <p className="login-card__register">
        还没有账号？
        <button
          className="text-button text-button--accent"
          onClick={onRegister}
          type="button"
        >
          立即注册
        </button>
      </p>
    </div>
  );
};

export default LoginCard;
