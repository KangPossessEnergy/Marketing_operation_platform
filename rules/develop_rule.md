---
trigger: always_on
---

# 前端开发基础规范

## 一、基本要求

### 1.1 TypeScript规范
- **必须为函数参数和返回值定义类型**
- **接口定义使用 `interface`，类型别名使用 `type`**

```typescript
// ✅ 正确
interface UserInfo {
  id: number;
  name: string;
  email?: string;
}

const fetchUser = (id: number): Promise<UserInfo> => {
  // 实现逻辑
};
```

### 1.2 React Hooks规范
- **Hooks只能在函数组件顶层调用**
- **自定义Hook必须以 `use` 开头**
- **依赖数组必须包含所有使用的变量**

```typescript
// ✅ 正确用法
useEffect(() => {
  fetchData(id);
}, [id]);

const handleClick = useCallback(() => {
  onSubmit(formData);
}, [formData, onSubmit]);
```

### 1.3 代码注释规范
- **文件头部注释**：必须包含文件用途、作者、创建日期
- **函数注释**：必须使用TSDoc规范，说明功能、参数、返回值
- **复杂逻辑注释**：关键算法和业务逻辑必须添加详细注释
- **注释格式**：
  ```typescript
  /**
   * 获取用户信息
   * @param id 用户ID
   * @returns 用户信息Promise
   */
  async function getUser(id: number): Promise<User> {
    // 特殊处理：VIP用户需要额外查询权限
    if (isVip(id)) {
      await checkVipPermission(id);
    }
    return fetchUser(id);
  }
  ```
- **维护要求**：代码修改时必须同步更新相关注释

### 1.4 命名规范
- **组件使用 PascalCase**：`UserProfile`
- **变量和函数使用 camelCase**：`getUserInfo`
- **常量使用 UPPER_SNAKE_CASE**：`API_BASE_URL`
- **文件名使用 kebab-case**：`user-profile.tsx`

### 1.4 安全要求
- **禁止在前端进行金额计算**

## 二、限制

### 2.1 TypeScript限制
- **禁止使用 `any` 类型**，可以使用 `unknown` 或具体类型
- **禁止使用 `@ts-ignore` 注释**

### 2.2 代码复杂度限制
- **单个文件不得超过 500 行**
- **单个函数不得超过 50 行**
- **条件复杂度不得超过 10**
- **超过限制时，必须按功能模块拆分**

### 2.3 React Hooks限制
- **禁止在循环、条件或嵌套函数中使用 Hooks**
- **禁止遗漏依赖数组中的变量**

```typescript
// ❌ 错误：缺少依赖
useEffect(() => {
  fetchData(id);
}, []); // 缺少 id 依赖
```

### 2.4 代码质量限制
- **不允许单词拼写错误或不符合命名规范**
- **避免在前端直接进行金额计算**（导致精度丢失）