# UmiJS Model 编写规范

## 一、概述

本规范适用于基于 UmiJS 4.x 框架的 React 应用中的 Model 层开发，Model 层主要负责状态管理、业务逻辑封装和数据流控制。

## 二、基本要求

### 2.1 文件命名和位置
- **文件位置**：`src/models/` 目录下
- **命名规范**：使用 `camelCase` 命名，如 `userInfo.ts`、`customerPool.ts`
- **文件扩展名**：必须使用 `.ts` 扩展名
- **导出方式**：使用 `export default` 导出函数

### 2.2 基本结构
```typescript
// 导入依赖
import { useState, useCallback } from 'react';
import { message } from 'antd';
import { serviceMethod } from '@/services/domain';

// 类型定义（如果复杂，建议单独文件）
interface ModelState {
  // 状态类型定义
}

export default () => {
  // 状态定义
  const [state, setState] = useState<ModelState>();
  
  // 业务方法
  const businessMethod = useCallback(() => {
    // 业务逻辑
  }, []);

  // 返回状态和方法
  return {
    // 状态
    state,
    setState,
    // 方法
    businessMethod,
  };
};
```

## 三、开发规范

### 3.1 状态管理规范

#### 3.1.1 状态定义
```typescript
export default () => {
  // ✅ 正确：明确类型定义
  const [userInfo, setUserInfo] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  
  // ❌ 错误：缺少类型定义
  const [data, setData] = useState([]);
  
  return {
    userInfo,
    setUserInfo,
    loading,
    setLoading,
    visible,
    setVisible,
  };
};
```

#### 3.1.2 状态命名规范
- **数据状态**：使用具体的业务名称，如 `customerList`、`orderDetail`
- **UI状态**：使用描述性名称，如 `loading`、`visible`、`modalOpen`
- **标识状态**：使用 `is` 或 `has` 前缀，如 `isEdit`、`hasPermission`

### 3.2 业务方法规范

#### 3.2.1 异步方法处理
```typescript
export default () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ 正确：完整的异步处理
  const loadData = useCallback(async (params: QueryParams) => {
    setLoading(true);
    try {
      const res = await serviceMethod(params);
      setData(res.data.list || []);
      return res.data;
    } catch (error: any) {
      console.error('数据加载失败:', error);
      message.error(error?.data?.message || '数据加载失败');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    loadData,
  };
};
```

#### 3.2.2 方法命名规范
- **查询方法**：`load` + 业务名称，如 `loadUserList`、`getUserDetail`
- **操作方法**：动词 + 业务名称，如 `addUser`、`updateOrder`、`deleteCustomer`
- **校验方法**：`check` + 校验内容，如 `checkUserName`、`validateForm`
- **工具方法**：具体功能描述，如 `formatData`、`resetForm`

### 3.3 错误处理规范

#### 3.3.1 统一错误处理
```typescript
// ✅ 正确：统一的错误处理模式
const handleApiCall = async (apiMethod: Function, params: any, errorMsg: string) => {
  try {
    const res = await apiMethod(params);
    return res.data;
  } catch (error: any) {
    console.error(`${errorMsg}:`, error);
    message.error(error?.data?.message || errorMsg);
    return null;
  }
};

// 使用示例
const loadData = useCallback(async () => {
  const result = await handleApiCall(
    serviceMethod,
    queryParams,
    '数据加载失败'
  );
  if (result) {
    setData(result.list || []);
  }
}, []);
```

### 3.4 性能优化规范

#### 3.4.1 使用 useCallback
```typescript
export default () => {
  const [data, setData] = useState([]);

  // ✅ 正确：使用 useCallback 优化性能
  const addItem = useCallback((newItem: Item) => {
    setData(prev => [...prev, newItem]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<Item>) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  return {
    data,
    addItem,
    updateItem,
  };
};
```

## 四、类型定义规范

### 4.1 接口定义
```typescript
// ✅ 推荐：在 model 文件中定义简单接口
interface TabType {
  key: string;
  name: string;
  path: string;
  closable?: boolean;
}

interface QueryParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
}

// ✅ 复杂类型建议单独文件
// 参考：src/types/domain.ts
```

### 4.2 泛型使用
```typescript
// ✅ 正确：使用泛型提高复用性
const useListModel = <T>() => {
  const [list, setList] = useState<T[]>([]);
  const [total, setTotal] = useState<number>(0);

  const updateList = useCallback((newList: T[]) => {
    setList(newList);
  }, []);

  return {
    list,
    total,
    setList,
    setTotal,
    updateList,
  };
};
```

## 五、常见模式和最佳实践

### 5.1 列表管理模式
```typescript
export default () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState({
    pageNum: 1,
    pageSize: 20,
  });
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await serviceMethod(query);
      setData(res.data.list || []);
      setTotal(res.data.total || 0);
    } catch (error: any) {
      message.error(error?.data?.message || '查询失败');
    } finally {
      setLoading(false);
    }
  }, [query]);

  return {
    data,
    total,
    query,
    loading,
    setQuery,
    loadData,
  };
};
```

### 5.2 表单管理模式
```typescript
export default () => {
  const [formData, setFormData] = useState({});
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const openModal = useCallback((editData?: any) => {
    setIsEdit(!!editData);
    setFormData(editData || {});
    setVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setVisible(false);
    setFormData({});
    setIsEdit(false);
  }, []);

  const submitForm = useCallback(async (values: any) => {
    setLoading(true);
    try {
      const apiMethod = isEdit ? updateService : createService;
      await apiMethod(values);
      message.success(isEdit ? '更新成功' : '创建成功');
      closeModal();
      return true;
    } catch (error: any) {
      message.error(error?.data?.message || '操作失败');
      return false;
    } finally {
      setLoading(false);
    }
  }, [isEdit]);

  return {
    formData,
    visible,
    isEdit,
    loading,
    openModal,
    closeModal,
    submitForm,
  };
};
```

### 5.3 标签页管理模式
```typescript
export default () => {
  const [tabs, setTabs] = useState<TabType[]>([]);
  const [activeKey, setActiveKey] = useState('');

  const addTab = useCallback((newTab: TabType) => {
    const exists = tabs.some(tab => tab.key === newTab.key);
    if (!exists) {
      setTabs(prev => [...prev, newTab]);
    }
    setActiveKey(newTab.key);
  }, [tabs]);

  const removeTab = useCallback((targetKey: string) => {
    const newTabs = tabs.filter(tab => tab.key !== targetKey);
    setTabs(newTabs);
    
    if (activeKey === targetKey && newTabs.length > 0) {
      setActiveKey(newTabs[newTabs.length - 1].key);
    }
  }, [tabs, activeKey]);

  return {
    tabs,
    activeKey,
    addTab,
    removeTab,
    setActiveKey,
  };
};
```

## 六、数据持久化规范

### 6.1 本地存储
```typescript
const STORAGE_KEY = 'model_data_key';

export default () => {
  const [data, setData] = useState(() => {
    // 初始化时从存储读取
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const saveToStorage = useCallback((newData: any) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    setData(newData);
  }, []);

  return {
    data,
    saveToStorage,
  };
};
```

## 七、注释规范

### 7.1 文件头注释
```typescript
/**
 * 客户池管理 Model
 * 负责客户数据的状态管理和业务逻辑处理
 * @author 开发者姓名
 * @date 2024-01-01
 */
```

### 7.2 方法注释
```typescript
/**
 * 获取客户详情数据
 * @param id 客户ID
 * @returns 客户详情数据或null
 */
const getCustomerDetail = useCallback(async (id: number) => {
  // 实现逻辑
}, []);
```

## 八、禁止事项

### 8.1 代码质量
- ❌ **禁止使用 `any` 类型**
- ❌ **禁止直接操作 DOM**
- ❌ **禁止在 Model 中写行内样式**
- ❌ **禁止无注释的复杂逻辑**

### 8.2 状态管理
- ❌ **禁止在 Model 中直接调用路由跳转**（应通过组件处理）
- ❌ **禁止在 Model 中处理 UI 交互逻辑**（如弹窗显示隐藏应在组件中处理）
- ❌ **禁止状态过度嵌套**（超过3层嵌套应考虑拆分）

## 九、测试建议

### 9.1 单元测试
```typescript
// 建议为复杂的业务逻辑编写单元测试
describe('CustomerModel', () => {
  test('should load customer data correctly', async () => {
    // 测试逻辑
  });
});
```

## 十、迁移指南

### 10.1 从旧版本迁移
- 将 `dva` 模式的 Model 改写为 Hook 模式
- 将 `effects` 改写为 `useCallback` 包装的异步方法
- 将 `reducers` 改写为 `useState` 的 setter 方法

### 10.2 性能优化建议
- 合理使用 `useCallback` 和 `useMemo`
- 避免不必要的状态更新
- 大数据量时考虑分页和虚拟滚动
- 复杂计算考虑使用 Web Worker

## 十一、示例模板

```typescript
/**
 * [业务名称] Model
 * [业务描述]
 * @author [开发者]
 * @date [日期]
 */

import { useState, useCallback } from 'react';
import { message } from 'antd';
import { serviceMethod } from '@/services/domain';

// 类型定义
interface ModelState {
  // 状态类型
}

interface QueryParams {
  // 查询参数类型
}

export default () => {
  // 状态定义
  const [data, setData] = useState<ModelState[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 业务方法
  const loadData = useCallback(async (params: QueryParams) => {
    setLoading(true);
    try {
      const res = await serviceMethod(params);
      setData(res.data || []);
      return res.data;
    } catch (error: any) {
      console.error('数据加载失败:', error);
      message.error(error?.data?.message || '数据加载失败');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 返回状态和方法
  return {
    data,
    loading,
    setData,
    loadData,
  };
};
```

---

**注意事项**：
1. 本规范基于 UmiJS 4.x 和 React 18+ 版本
2. 建议结合项目实际情况灵活应用
3. 复杂业务逻辑建议拆分多个 Model
4. 定期 review 和重构 Model 代码，保持代码质量