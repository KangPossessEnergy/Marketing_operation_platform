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
          { key: "online-mall", label: "线上商城", path: "/modules/mall/online-mall" },
          { key: "offline-mall", label: "线下商城", path: "/modules/mall/offline-mall" },
        ],
      },
    ],
  },
  {
    key: "products",
    label: "商品管理",
    children: [
      {
        key: "product-management",
        label: "商品管理",
        children: [
          {
            key: "product-list",
            label: "商品管理",
            path: "/modules/products/product-list",
          },
        ],
      },
    ],
  },
  {
    key: "orders",
    label: "订单管理",
    children: [
      {
        key: "order-management",
        label: "订单管理",
        children: [
          {
            key: "order-list",
            label: "订单管理",
            path: "/modules/orders/order-list",
          },
        ],
      },
    ],
  },
  {
    key: "customers",
    label: "客户管理",
    children: [
      {
        key: "customer-management",
        label: "客户管理",
        children: [
          {
            key: "customer-pool",
            label: "客户池",
            path: "/modules/customers/customer-pool",
          },
          {
            key: "my-customers",
            label: "我的客户",
            path: "/modules/customers/my-customers",
          },
        ],
      },
    ],
  },
  {
    key: "projects",
    label: "项目管理",
    children: [
      {
        key: "family-management",
        label: "家庭管理",
        children: [
          {
            key: "family-list",
            label: "家庭管理",
            path: "/modules/projects/family-list",
          },
        ],
      },
    ],
  },
  {
    key: "pricing",
    label: "价格管理",
    children: [
      {
        key: "price-management",
        label: "价格管理",
        children: [
          {
            key: "product-pricing",
            label: "商品价格",
            path: "/modules/pricing/product-pricing",
          },
        ],
      },
    ],
  },
  {
    key: "data",
    label: "商品数据",
    children: [
      {
        key: "brand-product-library",
        label: "品牌产品库",
        children: [
          {
            key: "brand-product-list",
            label: "品牌产品库",
            path: "/modules/product-data/brand-product-list",
          },
        ],
      },
      {
        key: "store-product-library",
        label: "门店产品库",
        children: [
          {
            key: "store-product-list",
            label: "门店产品库",
            path: "/modules/product-data/store-product-list",
          },
        ],
      },
      {
        key: "store-featured-products",
        label: "门店优选产品",
        children: [
          {
            key: "store-featured-product-list",
            label: "门店优选产品",
            path: "/modules/product-data/store-featured-product-list",
          },
        ],
      },
    ],
  },
  {
    key: "quotes",
    label: "报价管理",
    children: [
      {
        key: "quick-quote",
        label: "快速报价",
        children: [
          {
            key: "quick-quote-list",
            label: "快速报价",
            path: "/modules/quotes/quick-quote-list",
          },
        ],
      },
      {
        key: "solution-design",
        label: "方案设计",
        children: [
          {
            key: "solution-design-list",
            label: "方案设计",
            path: "/modules/quotes/solution-design-list",
          },
        ],
      },
    ],
  },
  {
    key: "sales",
    label: "销售运营",
    children: [
      {
        key: "sales-dashboard",
        label: "数据看板",
        children: [
          {
            key: "inventory-statistics",
            label: "进销存数据统计",
            path: "/modules/sales/inventory-statistics",
          },
          {
            key: "rebate-statistics",
            label: "返利统计",
            path: "/modules/sales/rebate-statistics",
          },
        ],
      },
      {
        key: "inventory",
        label: "库存查看",
        children: [
          {
            key: "inventory-data",
            label: "库存数据",
            path: "/modules/sales/inventory-data",
          },
        ],
      },
      {
        key: "ordering",
        label: "订货管理",
        children: [
          {
            key: "fd-account-binding-statistics",
            label: "FD账号绑定统计",
            path: "/modules/sales/fd-account-binding-statistics",
          },
        ],
      },
    ],
  },
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

export const findHeaderMenuTrail = (
  menuItems: HeaderMenuNode[],
  pathname: string,
  ancestors: HeaderMenuNode[] = [],
): HeaderMenuNode[] => {
  for (const item of menuItems) {
    const trail = [...ancestors, item];

    if (item.path === pathname) {
      return trail;
    }

    if (item.children?.length) {
      const matchedTrail = findHeaderMenuTrail(item.children, pathname, trail);
      if (matchedTrail.length) {
        return matchedTrail;
      }
    }
  }

  return [];
};

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
