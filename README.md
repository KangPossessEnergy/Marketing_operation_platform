# web_marketing_operation_platform

营销运营平台前端项目，对标天猫精灵运营系统平台的学习项目，本项目不做盈利。

## 技术栈

- **框架**:Umi 4(React 18)
- **UI 组件库**:Ant Design 5 + @ant-design/pro-components
- **语言**:TypeScript 5
- **网络请求**:axios
- **包管理器**:pnpm(锁定版本，请勿使用 npm/yarn 安装依赖)

## 环境要求

- Node.js >= 16(推荐 18+)
- pnpm >= 8

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器(默认端口 8081)
pnpm dev

# 构建生产包
pnpm build
```

启动后访问 http://localhost:8081/,会自动重定向到登录页 `/login`。

## 常见问题

### pnpm install / pnpm dev 报 ERR_PNPM_IGNORED_BUILDS

新版 pnpm 默认禁止依赖的安装脚本(postinstall),本项目已批准 `esbuild`、`core-js`、`core-js-pure` 的构建脚本,配置写在 **`pnpm-workspace.yaml`** 的 `allowBuilds` 字段中。该文件和 `pnpm-lock.yaml` 都必须提交到 git,不要加入 .gitignore,否则换机器/换人会复现此报错。


## 目录结构

```
├── config/              # umi 配置
│   ├── config.ts        #   构建/打包配置
│   └── routes.ts        #   路由与菜单配置
├── src/
│   ├── layouts/         # 全局布局(umi 约定,勿留空文件)
│   ├── pages/           # 页面:Login / Dashboard / Home / ErrorPage
│   ├── components/      # 组件(Business 业务组件 / Common 通用组件)
│   ├── services/        # 接口请求
│   ├── models/          # 全局数据模型
│   ├── hooks/           # 自定义 hooks
│   ├── utils/           # 工具:http 封装、localStorage、mitt、toast
│   ├── types/           # 类型定义
│   └── app.ts           # 运行时配置(getInitialState 等)
├── pnpm-workspace.yaml  # pnpm 配置(allowBuilds,必须提交)
└── pnpm-lock.yaml       # 锁文件(必须提交)
```

## 参与贡献

1. Fork 本仓库
2. 新建 Feat_xxx 分支
3. 提交代码
4. 新建 Pull Request
