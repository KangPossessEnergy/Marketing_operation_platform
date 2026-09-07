import React from "react";
import { Outlet } from "umi";
import RequireAuth from "@/components/Auth/RequireAuth";
import Header from "@/components/Layout/Header";
import "./index.less";

// 全局布局:登录页、错误页已通过路由配置 layout: false 排除在外
const GlobalLayout: React.FC = () => {
  return (
    <RequireAuth>
      <div className="app-layout">
        <Header />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </RequireAuth>
  );
};

export default GlobalLayout;
