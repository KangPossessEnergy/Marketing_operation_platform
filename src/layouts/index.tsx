import React from "react";
import { Outlet } from "umi";

// 全局布局:登录页、错误页已通过路由配置 layout: false 排除在外
const GlobalLayout: React.FC = () => {
  return <Outlet />;
};

export default GlobalLayout;
