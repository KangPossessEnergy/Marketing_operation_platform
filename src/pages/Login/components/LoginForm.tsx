import React, { FormEvent } from "react";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  EyeInvisibleOutlined,
  EyeOutlined,
  ArrowRightOutlined,
  LockOutlined,
  MobileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Col, Row } from "antd";
import LoginField from "./LoginField";
import { LoginMode } from "@/types/Login";

export interface LoginFormProps {
  mode: LoginMode;
  account: string;
  password: string;
  code: string;
  showPassword: boolean;
  remember: boolean;
  isSubmitting: boolean;
  codeSent: boolean;
  onAccountChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onTogglePassword: () => void;
  onRememberChange: (value: boolean) => void;
  onSendCode: () => void;
  onForgotPassword: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  mode,
  account,
  password,
  code,
  showPassword,
  remember,
  isSubmitting,
  codeSent,
  onAccountChange,
  onPasswordChange,
  onCodeChange,
  onTogglePassword,
  onRememberChange,
  onSendCode,
  onForgotPassword,
  onSubmit,
}) => {
  const isPasswordMode = mode === "password";

  return (
    <form className="login-form" onSubmit={onSubmit}>
      <LoginField
        autoComplete="username"
        icon={isPasswordMode ? <UserOutlined /> : <MobileOutlined />}
        onChange={onAccountChange}
        placeholder={isPasswordMode ? "手机号 / 企业账号" : "请输入手机号"}
        type={isPasswordMode ? "text" : "tel"}
        value={account}
        action={
          account ? (
            <button
              aria-label="清空账号"
              className="login-field__action"
              onClick={() => onAccountChange("")}
              type="button"
            >
              <CloseCircleFilled />
            </button>
          ) : null
        }
      />

      {isPasswordMode ? (
        <LoginField
          autoComplete="current-password"
          icon={<LockOutlined />}
          onChange={onPasswordChange}
          placeholder="请输入登录密码"
          type={showPassword ? "text" : "password"}
          value={password}
          action={
            <button
              aria-label={showPassword ? "隐藏密码" : "显示密码"}
              className="login-field__action"
              onClick={onTogglePassword}
              type="button"
            >
              {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </button>
          }
        />
      ) : (
        <LoginField
          autoComplete="one-time-code"
          icon={<CheckCircleFilled />}
          onChange={onCodeChange}
          placeholder="请输入验证码"
          value={code}
          action={
            <button
              className="verification-button"
              onClick={onSendCode}
              type="button"
            >
              {codeSent ? "已发送" : "获取验证码"}
            </button>
          }
        />
      )}

      <Row
        align="middle"
        className="login-form__meta"
        justify="space-between"
      >
        <Col flex="auto">
          <label className="remember-option">
            <input
              checked={remember}
              onChange={(event) => onRememberChange(event.target.checked)}
              type="checkbox"
            />
            <span>记住我</span>
          </label>
        </Col>
        <Col flex="none">
          <button className="text-button" onClick={onForgotPassword} type="button">
            忘记密码？
          </button>
        </Col>
      </Row>

      <button className="submit-button" disabled={isSubmitting} type="submit">
        <span>{isSubmitting ? "登录中..." : "登录"}</span>
        {!isSubmitting && <ArrowRightOutlined />}
      </button>
    </form>
  );
};

export default LoginForm;
