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

type NavigationItem = {
  key: string;
  label: string;
  path?: string;
};

const navigationItems: NavigationItem[] = [
  { key: "mall", label: "商城", path: "/home" },
  { key: "products", label: "商品管理" },
  { key: "orders", label: "订单管理" },
  { key: "customers", label: "客户管理" },
  { key: "projects", label: "项目管理" },
  { key: "pricing", label: "价格管理" },
  { key: "data", label: "商品数据" },
  { key: "quotes", label: "报价管理" },
  { key: "sales", label: "销售运营" },
  { key: "settings", label: "基础设置" },
];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [mallMenuOpen, setMallMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const selectedKey = useMemo(() => {
    if (location.pathname === "/home" || location.pathname === "/") {
      return "mall";
    }
    return location.pathname === "/dashboard" ? "sales" : "mall";
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

  const handleNavigation = (item: NavigationItem) => {
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

      <nav className="app-nav" aria-label="主导航">
        {navigationItems.map((item) => (
          <div
            className={`app-nav__entry${item.key === "mall" ? " app-nav__entry--mall" : ""}`}
            key={item.key}
            onMouseEnter={() => item.key === "mall" && setMallMenuOpen(true)}
            onMouseLeave={() => item.key === "mall" && setMallMenuOpen(false)}
          >
            <button
              className={`app-nav__item${selectedKey === item.key ? " app-nav__item--active" : ""}`}
              type="button"
              onClick={() => handleNavigation(item)}
            >
              {item.label}
            </button>
            {item.key === "mall" && mallMenuOpen && (
              <div
                className="mall-menu"
                onMouseEnter={() => setMallMenuOpen(true)}
                onMouseLeave={() => setMallMenuOpen(false)}
              >
                <div className="mall-menu__aside">
                  <strong>商城</strong>
                </div>
                <div className="mall-menu__content">
                  <div className="mall-menu__heading">商城</div>
                  <div className="mall-menu__links">
                    <button type="button" onClick={() => navigate("/home")}>
                      线上商城
                    </button>
                    <button type="button" onClick={() => message.info("线下商城模块正在建设中")}>
                      线下商城
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

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
