import React, { FormEvent, useState } from "react";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleFilled,
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Col, Row, message } from "antd";
import { useNavigate } from "umi";
import { LoginServices } from "@/services/Login";
import { publishSuccess } from "@/utils/mitt";
import LoginBackdrop from "@/pages/Login/components/LoginBackdrop";
import LoginFooter from "@/pages/Login/components/LoginFooter";
import LoginHeader from "@/pages/Login/components/LoginHeader";
import LoginField from "@/pages/Login/components/LoginField";
import "../Login/index.less";
import "./index.less";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!account.trim()) {
      message.warning("请输入手机号或企业账号");
      return;
    }

    if (password.length < 6) {
      message.warning("密码长度不能少于 6 位");
      return;
    }

    if (password !== confirmPassword) {
      message.warning("两次输入的密码不一致");
      return;
    }

    if (!agreed) {
      message.warning("请先阅读并同意用户协议和隐私政策");
      return;
    }

    setIsSubmitting(true);
    try {
      await LoginServices.registerApi({
        username: account.trim(),
        password,
      });

      publishSuccess("注册成功，请使用新账号登录");
      navigate("/login", { replace: true });
    } catch {
      // 请求错误由全局发布订阅监听器统一提示。
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page register-page">
      <LoginBackdrop />
      <LoginHeader onLanguageClick={() => message.info("Language switching is coming soon")} />
      <section className="login-shell register-shell" aria-label="注册区域">
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
            <div className="login-card register-card">
              <div className="login-card__intro">
                <p className="login-card__eyebrow">MARKETING OPERATIONS PLATFORM</p>
                <h1>创建账号</h1>
                <p className="login-card__description">
                  注册后即可开始管理营销内容、数据与增长任务
                </p>
              </div>

              <form className="register-form" onSubmit={handleSubmit}>
                <LoginField
                  autoComplete="username"
                  icon={<UserOutlined />}
                  onChange={setAccount}
                  placeholder="手机号 / 企业账号"
                  value={account}
                />

                <LoginField
                  autoComplete="new-password"
                  icon={<LockOutlined />}
                  onChange={setPassword}
                  placeholder="请输入登录密码（至少 6 位）"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  action={
                    <button
                      aria-label={showPassword ? "隐藏密码" : "显示密码"}
                      className="login-field__action"
                      onClick={() => setShowPassword((visible) => !visible)}
                      type="button"
                    >
                      {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    </button>
                  }
                />

                <LoginField
                  autoComplete="new-password"
                  icon={<CheckCircleFilled />}
                  onChange={setConfirmPassword}
                  placeholder="请再次输入登录密码"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  action={
                    <button
                      aria-label={
                        showConfirmPassword ? "隐藏确认密码" : "显示确认密码"
                      }
                      className="login-field__action"
                      onClick={() =>
                        setShowConfirmPassword((visible) => !visible)
                      }
                      type="button"
                    >
                      {showConfirmPassword ? (
                        <EyeOutlined />
                      ) : (
                        <EyeInvisibleOutlined />
                      )}
                    </button>
                  }
                />

                <div className="register-agreement">
                  <input
                    checked={agreed}
                    onChange={(event) => setAgreed(event.target.checked)}
                    type="checkbox"
                  />
                  <span>
                    我已阅读并同意
                    <button
                      className="text-button text-button--accent"
                      onClick={(event) => event.preventDefault()}
                      type="button"
                    >
                      用户协议
                    </button>
                    和
                    <button
                      className="text-button text-button--accent"
                      onClick={(event) => event.preventDefault()}
                      type="button"
                    >
                      隐私政策
                    </button>
                  </span>
                </div>

                <button
                  className="submit-button"
                  disabled={isSubmitting}
                  type="submit"
                >
                  <span>{isSubmitting ? "注册中..." : "注册"}</span>
                  {!isSubmitting && <ArrowRightOutlined />}
                </button>
              </form>

              <button
                className="register-back-button"
                onClick={() => navigate("/login")}
                type="button"
              >
                <ArrowLeftOutlined />
                返回登录
              </button>
            </div>
          </Col>
        </Row>
      </section>
      <LoginFooter />
    </div>
  );
};

export default Register;
