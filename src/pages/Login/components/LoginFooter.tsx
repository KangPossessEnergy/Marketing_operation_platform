import React from "react";
import { Col, Row } from "antd";

const LoginFooter: React.FC = () => {
  
  const currentYear = new Date().getFullYear();//获取当前年份

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
          <span>© {currentYear} kk集团 版权所有。</span>
        </Col>
      </Row>
    </footer>
  );
};

export default LoginFooter;
