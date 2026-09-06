import React, { useMemo, useState } from "react";
import { Dropdown, MenuProps, message } from "antd";
import {
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { LoginServices } from "@/services/Login";
import { clearAll } from "@/utils/localStorage";
import { publishSuccess } from "@/utils/mitt";
import { useLocation, useNavigate } from "umi";
import "./Header.less";
import HeaderMenu, { type HeaderMenuNode } from "./HeaderMenu";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const selectedKey = useMemo(() => {
    if (location.pathname === "/home" || location.pathname === "/") {
      return "mall";
    }
    if (location.pathname === "/dashboard") {
      return "sales";
    }
    if (location.pathname.startsWith("/settings/")) {
      return "settings";
    }
    return "mall";
  }, [location.pathname]);

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "账户信息",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "个人设置",
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: isLoggingOut ? "退出中..." : "退出登录",
      danger: true,
      disabled: isLoggingOut,
    },
  ];

  const handleNavigation = (item: HeaderMenuNode) => {
    if (item.path) {
      navigate(item.path);
      return;
    }

    message.info(`${item.label}模块正在建设中`);
  };

  const handleUserMenuClick: MenuProps["onClick"] = async ({ key }) => {
    if (key === "logout") {
      if (isLoggingOut) {
        return;
      }

      setIsLoggingOut(true);
      try {
        await LoginServices.logoutApi();
        publishSuccess("已退出登录");
      } catch {
        // 请求错误由全局发布订阅监听器统一提示。
      } finally {
        clearAll();
        setIsLoggingOut(false);
        navigate("/login", { replace: true });
      }
      return;
    }

    message.info("该功能将在后续版本开放");
  };

  return (
    <header className="app-header">
      <button className="app-brand" type="button" onClick={() => navigate("/home")}>
        <span className="app-brand__mark" aria-hidden="true">
          <span className="app-brand__roof" />
          <span className="app-brand__base" />
          <span className="app-brand__door" />
        </span>
        <span className="app-brand__name">KKdw运营平台</span>
      </button>

      <HeaderMenu activeKey={selectedKey} onSelect={handleNavigation} />

      <Dropdown
        menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
        open={open}
        onOpenChange={setOpen}
        placement="bottomRight"
        trigger={["click"]}
      >
        <button className="app-account" type="button" aria-expanded={open}>
          <span className="app-account__details">
            <strong>187****9192</strong>
            <span>内部</span>
          </span>
          <DownOutlined className="app-account__arrow" />
        </button>
      </Dropdown>
    </header>
  );
};

export default Header;
