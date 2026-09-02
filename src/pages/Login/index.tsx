import React, { FormEvent, useState } from "react";
import "./index.less";

import { Col, message, Row } from "antd";
import { LoginMode } from "@/types/Login";
import LoginCard from "./components/LoginCard";
import LoginFooter from "./components/LoginFooter";
import LoginHeader from "./components/LoginHeader";
import LoginBackdrop from "./components/LoginBackdrop";
import { LoginFormProps } from "./components/LoginForm";

const Login: React.FC = () => {
  const [mode, setMode] = useState<LoginMode>("password");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!account.trim()) {
      message.warning("请输入手机号或企业账号");
      return;
    }

    if (mode === "password" && !password) {
      message.warning("请输入登录密码");
      return;
    }

    if (mode === "sms" && !code) {
      message.warning("请输入验证码");
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      message.success("演示登录成功，欢迎进入营销运营平台");
    }, 650);
  };

  const handleSendCode = () => {
    if (!account.trim()) {
      message.warning("请先输入手机号");
      return;
    }

    setCodeSent(true);
    message.success("验证码已发送");
  };

  const formProps: LoginFormProps = {
    mode,
    account,
    password,
    code,
    showPassword,
    remember,
    isSubmitting,
    codeSent,
    onAccountChange: setAccount,
    onPasswordChange: setPassword,
    onCodeChange: setCode,
    onTogglePassword: () => setShowPassword((visible) => !visible),
    onRememberChange: setRemember,
    onSendCode: handleSendCode,
    onForgotPassword: () => message.info("请联系管理员重置密码"),
    onSubmit: handleSubmit,
  };

  return (
    <div className="login-page">
      <LoginBackdrop />
      <LoginHeader onLanguageClick={() => message.info("Language switching is coming soon")} />
      <section className="login-shell" aria-label="登录区域">
        <Row align="middle" className="login-shell__row" justify="center">
          <Col
            className="login-shell__col"
            xs={22}
            sm={18}
            md={14}
            lg={10}
            xl={8}
            xxl={6}
          >
            <LoginCard
              formProps={formProps}
              mode={mode}
              onModeChange={setMode}
              onRegister={() => message.info("请联系企业管理员开通账号")}
            />
          </Col>
        </Row>
      </section>
      <LoginFooter />
    </div>
  );
};

export default Login;
