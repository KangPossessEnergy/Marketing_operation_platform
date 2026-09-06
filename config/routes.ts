//路由信息
export const routes:any = [
  { path: "/", redirect: "/login" },
  {
    name: "登陆页",
    path: "/login",
    component: "@/pages/Login", //去src下找pages目录下的login组件
    layout: false,
  },
  //   {
  //     name: "全局布局",
  //     component: "@/layouts/layout",
  //     routes: [
  //       {
  //         path: "/welcome",
  //         redirect: "/welcome",
  //       },
  //       {
  //         name: "欢迎页",
  //         path: "/welcome",
  //         component: "@/pages/Welcome",
  //       },
  //       {
  //         name: "首页",
  //         path: "/home",
  //         component: "@/pages/Home",
  //       },
  //     ],
  //   },
  {
    name: "欢迎页",
    path: "/dashboard",
    component: "@/pages/Dashboard",
  },
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
    key: "dashboard",
    label: "看版页",
  },
  {
    key: "home",
    label: "首页",
  },
];
