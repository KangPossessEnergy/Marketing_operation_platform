import React from "react";

const LoginBackdrop: React.FC = () => {
  return (
    <div className="login-page__backdrop" aria-hidden="true">
      <span className="login-page__glow login-page__glow--top" />
      <span className="login-page__glow login-page__glow--bottom" />
      <span className="login-page__wave login-page__wave--left" />
      <span className="login-page__wave login-page__wave--right" />
      <span className="login-page__grid" />
    </div>
  );
};

export default LoginBackdrop;
