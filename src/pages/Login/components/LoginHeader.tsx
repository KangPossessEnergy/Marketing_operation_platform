import React from "react";
import { AreaChartOutlined, GlobalOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";

interface LoginHeaderProps {
  onLanguageClick: () => void;
}

const LoginHeader: React.FC<LoginHeaderProps> = ({ onLanguageClick }) => {
  return (
    <header className="login-header">
      <Row
        align="middle"
        className="login-header__row"
        justify="space-between"
        wrap={false}
      >
        <Col className="login-header__brand-col" flex="auto">
          <div className="login-header__brand">
            <div className="brand">
              <span className="brand-mark">
                <AreaChartOutlined />
              </span>
              <span className="brand-name">营销运营平台</span>
            </div>
          </div>
        </Col>
        <Col className="login-header__language-col" flex="none">
          <button
            className="language-switcher"
            onClick={onLanguageClick}
            type="button"
            aria-label="切换语言"
          >
            <GlobalOutlined />
            <span className="language-switcher__label">EN</span>
          </button>
        </Col>
      </Row>
    </header>
  );
};

export default LoginHeader;
