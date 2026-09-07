//路由信息
export const routes: any = [
  { path: "/", redirect: "/login" },
  {
    name: "登陆页",
    path: "/login",
    component: "@/pages/Login", //去src下找pages目录下的login组件
    layout: false,
  },
  {
    name: "注册页",
    path: "/register",
    component: "@/pages/Register",
    layout: false,
  },
  {
    name: "AI助手工作台",
    path: "/ai-assistant",
    component: "@/pages/AIAssistant",
    layout: false,
  },
  {
    name: "全局布局",
    component: "@/layouts/index",
    layout: false,
    routes: [
      {
        name: "首页",
        path: "/home",
        component: "@/pages/Home",
      },
      {
        name: "基础设置",
        path: "/settings/:section",
        component: "@/pages/BasicSettings",
      },
      {
        name: "业务模块",
        path: "/modules/:module/:page",
        component: "@/pages/ModulePlaceholder",
      },
    ],
  },

  {
    name: "ErrorPage",
    path: "/*",
    component: "@/pages/ErrorPage/index",
    layout: false,
  },
];

export const menuData: any = [
  {
    key: "login",
    label: "登录页",
  },
  {
    key: "home",
    label: "首页",
  },
];
