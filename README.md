# Marketing Operation Platform · 全屋智能营销运营平台

营销运营平台前端项目，对标**天猫精灵全屋智能营销运营系统**的学习与实战项目。系统深度融合了 **ERP 物料与供应链管理**、**CRM 客户与商机推进** 以及 **AI 售前营销与智能报价 Copilot**，构建面向全屋智能与企业级营销的现代化运营工作台。

---

## 🌟 核心业务功能与亮点

### 1. AI 售前营销与智能报价工作台 (`/ai-assistant`)
专为 ERP+CRM 营销与售前咨询打造的智能工作台，基于 **Ant Design X** 深度构建：
- **实时 SSE 流式输出**：支持服务推送事件（Server-Sent Events）的 Token 级打字机流式响应，低延迟呈现复杂回复。
- **Agent 思维链（ThoughtChain）**：完整呈现智能体的深度思考过程、思考状态（检索物料库/计算报价规则/匹配施工标准）与 Tool-call 过程。
- **六大典型售前与智能报价业务场景**：
  - **智能配置选型与报价清单**：基于户型与预算，自动选型产品物料、测算工时与毛利率。
  - **售前需求深度调研**：安防、调光、温控及中控痛点挖掘与量身定制。
  - **竞品攻坚与促单话术**：提炼差异化优势、化解客户顾虑并提供高情商反驳策略。
  - **ERP 供应链与交期核算**：联动库存数据，核算交期并提供备件替代方案。
  - **CRM 商机促成与推进**：分析客户决策路径，制定主动跟进策略。
  - **技术方案建议书生成**：一键生成含系统拓扑与实施计划的标准化方案建议。
- **全功能多会话管理**：
  - 会话新增、切换、删除（CRUD）及 LocalStorage 离线与接口双重同步机制。
  - 侧边栏折叠/展开、自适应响应式布局与智能平滑滚动。
- **极致科技感视效与转场动效**：
  - **核心 Orbit 动效**：多重同心轨道旋转、外层椭圆自转与能量核心脉冲呼吸。
  - **双向对称 Portal 圆形扩散转场**：从工作台唤醒 AI 助手，或从 AI 助手返回工作台，皆以鼠标点击坐标为中心触发环形扩散波纹与空间折叠感。
  - **“水波涟漪 · 荡然而入”流体渐入**：从 AI 助手返回商城工作台时，触发中央水波涟漪扩散（`home-ripple-wave`）与多层卡片级联高斯模糊渐清（`home-cascade-in`）。

### 2. 商城运营工作台 (`/home`)
- **智能化运营中心 Hero**：呈现系统状态、环境信息及日期标识。
- **AI 助手专属接入 Entry**：集成了动态声波扫描线、三层行星轨道仪及快捷唤醒入口。
- **运营核心板块**：
  - **方案设计**：高效设计智能产品方案与施工图纸。
  - **进销存数据统计**：把控出入库流转、物料周转率与供应链态势。
  - **家庭管理**：交付与维系终端家庭客户智能化设备网络。
  - **商城运营**：把控商品上架、活动定价与经营动态。
- **最新动态与快捷入口**：全屋智能渠道政策公告与商品中心、订单中心高频入口。

### 3. 权限与安全机制
- **路由鉴权守卫 (`RequireAuth`)**：拦截非登录态访问，保障企业数据安全。
- **Token 过期与无感拦截**：登录态过期自动重定向回 `/login`，支持回跳源路径记录。

---

## 🛠️ 技术栈

- **前端框架**：[Umi 4](https://umijs.org/) (基于 React 18)
- **AI 交互组件库**：[@ant-design/x](https://x.ant.design/)（Ant Design 官方专为 AI 驱动应用打造的 React UI 库）
- **通用 UI 组件库**：[Ant Design 5](https://ant.design/) + [@ant-design/pro-components](https://procomponents.ant.design/) + `@ant-design/icons`
- **语言与规范**：TypeScript 5
- **样式方案**：Less + CSS 变量系统 + 高性能关键帧动效
- **网络与通信**：Axios + SSE (Server-Sent Events) 流式协议
- **包管理器**：pnpm（严苛版本锁定与安全构建机制）

---

## 💻 环境要求

- **Node.js**：>= 18.0.0（推荐 Node 20 LTS）
- **pnpm**：>= 8.0.0

---

## 🚀 快速开始

```bash
# 1. 克隆项目到本地
git clone <repository-url>
cd Marketing_operation_platform

# 2. 安装依赖 (请务必使用 pnpm，勿使用 npm 或 yarn)
pnpm install

# 3. 启动本地开发服务 (默认端口 8081)
pnpm dev

# 4. 构建生产环境产物
pnpm build
```

启动后访问 `http://localhost:8081/`，系统将自动进行权限验证；未登录时会自动重定向到登录页 `/login`。

---

## 📂 项目结构

```
Marketing_operation_platform/
├── config/                      # UmiJS 构建与路由配置
│   ├── config.ts                # 打包构建、代理及插件配置
│   └── routes.ts                # 页面路由与权限映射表
├── src/
│   ├── components/              # 全局通用与业务组件
│   │   ├── Auth/                # 权限守卫组件 (RequireAuth)
│   │   └── ...
│   ├── layouts/                 # 全局布局体系
│   ├── pages/                   # 核心页面
│   │   ├── AIAssistant/         # 🤖 AI 售前营销助手工作台
│   │   │   ├── components/      # 侧边栏、对话流、输入框、场景推荐等组件
│   │   │   ├── hooks/           # useAgentChat 等自定义业务 Hook
│   │   │   ├── constants.ts     # 预设场景、欢迎语与测试历史
│   │   │   ├── types.ts         # 会话、消息、思维链数据类型
│   │   │   ├── index.tsx        # AI 助手页面入口
│   │   │   └── index.less       # 样式与核心轨道/扩散动效
│   │   ├── Home/                # 🏬 商城运营工作台 (Hero/看板/快捷入口/转场动效)
│   │   ├── Login/               # 🔐 用户登录鉴权页
│   │   └── ErrorPage/           # 404 / 500 异常缺省页
│   ├── services/                # 接口请求层 (Axios 实例与 Conversation 服务)
│   ├── utils/                   # 工具类库 (存储、HTTP封装、事件总线等)
│   ├── models/                  # 全局状态管理
│   ├── app.ts                   # Umi 运行时配置 (getInitialState、request)
│   └── global.less              # 全局通用样式
├── pnpm-workspace.yaml          # pnpm 构建脚本白名单配置 (allowBuilds)
├── pnpm-lock.yaml               # 依赖版本锁文件 (请勿手动篡改)
├── tsconfig.json                # TypeScript 编译配置
└── package.json                 # 项目依赖与 Scripts
```

---

## ⚠️ 常见问题说明

### 1. `pnpm install` 或 `pnpm dev` 出现 `ERR_PNPM_IGNORED_BUILDS`
新版 pnpm 出于安全考量默认禁止第三方依赖运行 `postinstall` 安装脚本。本项目已在 **`pnpm-workspace.yaml`** 的 `allowBuilds` 字段中显式批准了 `esbuild`、`core-js`、`core-js-pure` 的执行。
> **注意**：`pnpm-workspace.yaml` 与 `pnpm-lock.yaml` 均包含工程级配置，请务必纳入版本控制，切勿忽略。

### 2. AI 助手工作台如何对接后端流式服务？
前端在 `useAgentChat.ts` 中内置了标准 SSE 流式解析层：
- 当后端 API 可用时，调用 `fetch` 流式接口按行读取 `text`、`step`、`tool-call`、`tool-result`、`done` 等事件。
- 当本地离线或无后端服务时，具备高保真 Mock 流式降级能力，便于单兵前端独立演练与功能展示。

---

## 🤝 参与贡献

1. Fork 本仓库
2. 新建功能分支：`git checkout -b feature/YourFeature`
3. 提交代码：`git commit -m 'feat: Add YourFeature'`
4. 推送分支：`git push origin feature/YourFeature`
5. 新建 Pull Request
