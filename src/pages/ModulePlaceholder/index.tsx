import React from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useLocation } from "umi";
import PageBreadcrumb from "@/components/Common/PageBreadcrumb";
import {
  findHeaderMenuTrail,
  headerMenuData,
} from "@/components/Layout/HeaderMenu";
import "./index.less";

const ModulePlaceholder: React.FC = () => {
  const { pathname } = useLocation();
  const menuTrail = findHeaderMenuTrail(headerMenuData, pathname);
  const title = menuTrail.at(-1)?.label || "业务页面";

  return (
    <div className="module-placeholder-page">
      <div className="module-placeholder-page__header">
        <PageBreadcrumb items={menuTrail.map(({ label }) => ({ title: label }))} />
      </div>

      <section className="module-placeholder" aria-labelledby="module-placeholder-title">
        <ClockCircleOutlined className="module-placeholder__icon" />
        <h1 id="module-placeholder-title">{title}</h1>
        <p>页面待开发</p>
      </section>
    </div>
  );
};

export default ModulePlaceholder;
