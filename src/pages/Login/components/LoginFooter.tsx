import React from "react";
import { Col, Row } from "antd";

const LoginFooter: React.FC = () => {
  return (
    <footer className="login-footer">
      <Row align="middle" className="login-footer__row" justify="center">
        <Col flex="none">
          <span>Powered by kkdw 营销运营平台</span>
        </Col>
        <Col flex="none">
          <span className="login-footer__dot" />
        </Col>
        <Col flex="none">
          <span> © 2026 kk集团 版权所有</span>
        </Col>
      </Row>
    </footer>
  );
};

export default LoginFooter;
