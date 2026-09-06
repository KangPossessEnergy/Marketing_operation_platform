import React, { useState } from "react";
import "./index.less";

export type HeaderMenuNode = {
  key: string;
  label: string;
  path?: string;
  children?: HeaderMenuNode[];
};

export const headerMenuData: HeaderMenuNode[] = [
  {
    key: "mall",
    label: "商城",
    path: "/home",
    children: [
      {
        key: "mall-platform",
        label: "商城",
        children: [
          { key: "online-mall", label: "线上商城", path: "/home" },
          { key: "offline-mall", label: "线下商城" },
        ],
      },
    ],
  },
  { key: "products", label: "商品管理" },
  { key: "orders", label: "订单管理" },
  { key: "customers", label: "客户管理" },
  { key: "projects", label: "项目管理" },
  { key: "pricing", label: "价格管理" },
  { key: "data", label: "商品数据" },
  { key: "quotes", label: "报价管理" },
  {
    key: "settings",
    label: "基础设置",
    children: [
      {
        key: "organization",
        label: "组织管理",
        children: [
          {
            key: "organization-structure",
            label: "组织架构",
            path: "/settings/organization-structure",
          },
        ],
      },
      {
        key: "store",
        label: "门店管理",
        children: [
          {
            key: "store-information",
            label: "门店信息",
            path: "/settings/store-information",
          },
          {
            key: "construction-information",
            label: "施工信息",
            path: "/settings/construction-information",
          },
        ],
      },
      {
        key: "account",
        label: "账号管理",
        children: [
          {
            key: "account-information",
            label: "账号信息",
            path: "/settings/account-information",
          },
        ],
      },
      {
        key: "configuration",
        label: "配置管理",
        children: [
          {
            key: "announcement-configuration",
            label: "公告配置",
            path: "/settings/announcement-configuration",
          },
          {
            key: "material-upload",
            label: "物料上传",
            path: "/settings/material-upload",
          },
        ],
      },
      {
        key: "delivery",
        label: "交付管理",
        children: [
          {
            key: "family-management",
            label: "家庭管理",
            path: "/settings/family-management",
          },
        ],
      },
    ],
  },
];

type HeaderMenuProps = {
  activeKey: string;
  menuItems?: HeaderMenuNode[];
  onSelect: (item: HeaderMenuNode) => void;
};

const HeaderMenu: React.FC<HeaderMenuProps> = ({
  activeKey,
  menuItems = headerMenuData,
  onSelect,
}) => {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const closeMenu = () => setOpenKey(null);

  const handlePrimarySelect = (item: HeaderMenuNode) => {
    if (item.children?.length) {
      setOpenKey(item.key);
    }

    if (item.path) {
      onSelect(item);
    } else if (!item.children?.length) {
      onSelect(item);
    }
  };

  const handleLeafSelect = (item: HeaderMenuNode) => {
    onSelect(item);
    closeMenu();
  };

  return (
    <nav className="header-menu" aria-label="主导航" onMouseLeave={closeMenu}>
      {menuItems.map((item) => {
        const hasChildren = Boolean(item.children?.length);
        const isOpen = openKey === item.key;
        const isActive = activeKey === item.key || isOpen;

        return (
          <div
            className="header-menu__entry"
            key={item.key}
            onMouseEnter={() => hasChildren && setOpenKey(item.key)}
          >
            <button
              aria-expanded={hasChildren ? isOpen : undefined}
              className={`header-menu__item${isActive ? " header-menu__item--active" : ""}`}
              type="button"
              onClick={() => handlePrimarySelect(item)}
            >
              {item.label}
            </button>

            {isOpen && item.children && (
              <section className="header-menu__panel" aria-label={`${item.label}菜单`}>
                <aside className="header-menu__aside">
                  <strong>{item.label}</strong>
                </aside>
                <div className="header-menu__content">
                  <div className="header-menu__groups">
                    {item.children.map((group) => (
                      <section className="header-menu__group" key={group.key}>
                        <h2>{group.label}</h2>
                        <div className="header-menu__links">
                          {group.children?.map((leaf) => (
                            <button
                              key={leaf.key}
                              type="button"
                              onClick={() => handleLeafSelect(leaf)}
                            >
                              {leaf.label}
                            </button>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default HeaderMenu;
