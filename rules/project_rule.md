**项目级规则用于帮助 Agent 理解您的代码库和遵循您的项目约定**

---
trigger: always_on
---

# 项目概览


# 业务文档

# 项目结构
- 目录结构，参考UmiJS官方文档： https://umijs.org/docs/guides/directory-structure
- src/services 存放服务端接口调用代码
- src/**/models/*.ts 存放单个应用内状态管理代码


# 开发规范
- 使用 TypeScript 保证类型安全。
- 遵循 ESLint 配置中定义的编码规范。
- 保证所有组件具有响应式设计并具备可访问性


# AI 交互指南
- 生成代码时，优先采用 TypeScript 和 React 最佳实践。
- 新增的组件应可复用，并遵循现有设计模式。
- 尽量减少 AI 生成的注释，多使用清晰命名的变量与函数。
- 始终校验用户输入并优雅处理错误。
- 在开发新组件和页面时参考现有组件和页面实现。

# 文档资源
- [React 文档](https://react.dev/)
- [UmiJS 文档](https://umijs.org/docs)
- [Ant Design 文档](https://ant.design/docs/react/introduce-cn)
- [Ant Design Pro 文档](https://procomponents.ant.design/components)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)