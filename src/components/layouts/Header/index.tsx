import React, { useMemo, useState } from "react";
import { Dropdown, MenuProps, message } from "antd";
import {
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { LoginServices } from "@/services/Login";
import { clearAll, getUserInfo } from "@/utils/localStorage";
import { publishSuccess } from "@/utils/mitt";
import { useLocation, useNavigate } from "umi";
import "./index.less";
import HeaderMenu, {
  findHeaderMenuTrail,
  headerMenuData,
  type HeaderMenuNode,
} from "../HeaderMenu";

type CurrentUser = {
  id?: string;
  username?: string | null;
  phone?: string | null;
};

const maskPhone = (phone?: string | null) => {
  if (!phone) {
    return "";
  }

  return phone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
};

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const currentUser = getUserInfo() as CurrentUser;
  const accountName =
    currentUser.username?.trim() ||
    maskPhone(currentUser.phone) ||
    "当前用户";
  const accountDescription =
    currentUser.username && currentUser.phone
      ? maskPhone(currentUser.phone)
      : currentUser.username
        ? "用户名登录"
        : currentUser.phone
          ? "手机号登录"
          : "未获取到登录信息";

  const selectedKey = useMemo(() => {
    return findHeaderMenuTrail(headerMenuData, location.pathname)[0]?.key || "";
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
            <strong>{accountName}</strong>
            <span>{accountDescription}</span>
          </span>
          <DownOutlined className="app-account__arrow" />
        </button>
      </Dropdown>
    </header>
  );
};

export default Header;
