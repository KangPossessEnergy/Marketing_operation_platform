---
trigger: manual
---

# CIO表格页面AI生成范式

---

## 1. 前言与适用范围    
本范式用于指导大模型自动生成当前项目标准表格页面，兼顾团队开发规范与AI友好性。适用于数据展示、筛选、导出、新增、删除、编辑、状态变更、详情弹窗等标准表格页面。遇到极端定制化或非标准场景，需要让用户提供足够的输入并与用户确认具体需求后再生成。

---

## 2. 输入输出与AI友好指引

### 输入要求
- 必填：字段清单（字段名/是否是筛选项/映射字段）、接口信息（有/无/接口结构）。
- 可选：交互需求、样式偏好、特殊约束。
- 输入不全时，需逐项追问，直至所有必填项补全。

### 输出要求
- 输出完整目录结构、每个文件的代码、并且保障代码可运行。
- 输出内容需包含注释，便于后续理解和维护。

### AI追问策略

- 如用户提及一些交互需求但并没有描述清楚，需追问具体交互细节（如弹窗内容、具体用户操作动线等等）。
- **常见追问点清单：**
  - 字段信息不全：请补充字段类型、是否为筛选项、枚举值等。
  - 接口信息不明确：请补充接口入参、出参结构，是否有分页、mock数据等。
  - 交互需求模糊：请补充弹窗/详情/批量操作的字段、流程、校验规则等。
  - 操作按钮未说明：请补充按钮功能、是否二次确认、操作后是否刷新等。
---

## 3. 生码的目录结构

```plaintext
src/
├── pages/
│   └── [页面名]/                # 页面目录（如 account、user、order 等）
│       ├── index.tsx            # 页面主入口，负责UI渲染、数据绑定、交互逻辑（必需）
│       ├── index.less           # 页面样式（必需）
│       └── components/          # 可复用子组件目录（可选），如弹窗、复杂表单等
├── services/
│   └── [domain].ts                # 按业务领域划分，如 account、user、order 等
├── types/
│   └── [domain].ts              # 领域类型定义（必需）
├── mock/
│   └── [domain].ts              # Mock数据（可选）
```

- `[页面名]` 表示具体页面英文名，建议与业务领域或路由保持一致。
- `[domain]` 表示业务领域模块名，通常与页面相关联。
- 每个页面目录下可包含自己的 components 子目录，用于拆分弹窗、复杂表单等复用组件。
- services 层按领域拆分，仅负责API调用逻辑。
- types 层统一类型管理，按领域划分类型定义文件。
- mock 层用于本地开发或无后端时模拟数据。

---

## 4. 生码的基础代码模版(仅供参考，谨记切勿直接照搬)
### services/
> 如涉及接口，需根据接口层开发规范先生成接口层类型和API方法，再生成页面代码。
### index.tsx
```tsx
import { ProFormDateRangePicker, ProFormSelect, ProTable } from '@ant-design/pro-components';
import { Button, message, Space } from 'antd';
import { useRequest } from 'ahooks';
import { useRef } from 'react';
import useResponsiveItems from '@/hooks/useResponsiveItems';
import useFullScreenStatus from '@/hooks/useFullScreenStatus';
import styles from './index.less';
import CustomIcon from '@/components/my-icon';
import PageContainer from '@/components/page-container';
import type { FormInstance, ActionType } from '@ali/cio-ui';
// 引入接口层代码 - 遵循接口层范式
import { getAccountOptions, queryAccountList } from '@/services/account';
import type { IAccountQueryParamsVO, IAccountInfoDTO, IAccountOptionsVO } from '@/types/account';

export default () => {
  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const itemsPerRow = useResponsiveItems();
  const isFullScreen = useFullScreenStatus();

  // 下拉选项接口 - 使用接口层范式的API方法
  const { data: searchOptions } = useRequest(async () => {
    try {
      return await getAccountOptions();
    } catch (error) {
      console.error('获取选项失败:', error);
      message.error('获取选项失败，请稍后重试');
      return {};
    }
  });

  // 数据查询接口 - 使用接口层范式的查询方法
  const queryDataTable = async (params: IAccountQueryParamsVO) => {
    try {
      const res = await queryAccountList(params);
      return {
        data: res.list || [],
        success: true,
        total: res.total || 0,
      };
    } catch (error) {
      console.error('查询失败:', error);
      message.error('查询失败，请稍后重试');
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  const columns = [
    {
      title: '业务类型',
      dataIndex: 'bizType',
      renderFormItem: () => <ProFormSelect mode="multiple" placeholder="请选择" options={searchOptions?.bizTypeList} />,
      search: { transform: (value: string[]) => ({ bizType: value }) },
    },
    {
      title: '账户名字',
      dataIndex: 'accountName',
      key: 'accountName',
      renderFormItem: () => {
        return <ProFormText placeholder={'请输入'} wrapperCol={{ span: 24 }} />;
      },
    },
    // 不一定有操作请根据用户输入来实现
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right' as const,
      width: 100,
      render: (_: unknown, record: IAccountInfoDTO) => (
        // 重要操作区插槽位置
        <Space split={'|'}>
          <Button type="link" className={styles['table-action-btn']} onClick={() => {}}>
            查看
          </Button>
          <Button type="link" className={styles['table-action-btn']} onClick={() => {}}>
            编辑
          </Button>
        </Space>
      ),
    },
    // ... 可根据业务继续扩展 ...
  ];

  return (
    <PageContainer ghost header={{ title: '', breadcrumb: {} }}>
      <ProTable
        formRef={formRef}
        className={styles['pro-table']}
        actionRef={actionRef}
        columns={columns}
        // 列状态持久化配置
        columnsState={{
          persistenceKey: 'pro-table-account-manage',
          persistenceType: 'localStorage',
        }}
        // 表格功能区配置
        options={{
          fullScreen: true,
          reload: false,
          density: true,
          setting: true,
          densityIcon: <CustomIcon type="icon-aidclist" />,
        }}
        // 横向滚动配置
        scroll={{ x: 'scroll' }}
        // 表格吸顶配置
        sticky={{ offsetHeader: isFullScreen ? 0 : 64, offsetScroll: 0 }}
        // 数据请求方法
        request={queryDataTable}
        // 行唯一 key
        rowKey="key"
        pagination={{ showQuickJumper: true, defaultPageSize: 20 }}
        // 搜索表单默认配置
        search={{
          defaultCollapsed: true,
          defaultColsNumber: 12,
          span: itemsPerRow,
          layout: 'vertical',
          submitterColSpanProps: { span: itemsPerRow },
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
        }}
      />
    </PageContainer>
  );
};

```

### index.less(默认样式，直接原样返回)

```less
.pro-table {
  :global {
    .ant-pro-query-filter {
      background-color: #ffffff;
      box-shadow: 0 2px 16px 0 rgba(25, 25, 26, 0.01);
      border-radius: 16px;
      padding: 16px;
      .ant-pro-query-filter-row {
        row-gap: 16px;
        margin-left: -8px !important;
        margin-right: -8px !important;
        .ant-pro-query-filter-row-split {
          padding-left: 8px !important;
          padding-right: 8px !important;
          .ant-form-item-label {
            padding-bottom: 4px !important;
          }
        }
      }
      .ant-pro-query-filter-actions {
        .ant-form-item-label {
          padding: 0 0 4px;
        }
      }
    }
    .ant-pro-table-search {
      border-radius: 16px;
    }
    .ant-pro-card {
      border-radius: 16px;
      .ant-pro-card-body {
        padding-inline: 16px;
        background-color: #ffffff;
        box-shadow: 0 2px 16px 0 rgba(25, 25, 26, 0.01);
        border-radius: 16px;
      }
    }
  }
}
.table-action-btn {
  padding: 4px 0;
}
```

---

## 5. 页面结构分区

#### 搜索项（columns.renderFormItem）
- 支持多条件筛选，建议在 columns 配置中通过 `renderFormItem` 使用 ProForm 相关组件（如 ProFormSelect、ProFormText，记得不要是使用ProFormInput这种不存在的组件 等）自定义查询表单项。
- 若有服务端返回的搜索项枚举，建议用 ProFormSelect，并通过 options 动态绑定接口返回的数据。
- 支持表单项响应式布局，建议结合 `useResponsiveItems` 实现。
- 支持表单项折叠/展开，默认折叠，表单项数量多时自动收起。一般 `defaultColsNumber` 设置为 12。
- 一行最多展示 6 个筛选项；如遇到范围类（如日期区间）筛选项，建议设置 `colSize: 2`。
- 支持自定义搜索、重置等按钮的顺序和样式，可通过 `optionRender` 实现。

#### 操作区（headerTitle/toolBarRender）
- 主操作按钮建议放在headerTitle（如"新增"、"批量新增"等）。
- 批量操作、导出、设置等建议放在toolBarRender。
- 操作区可灵活放置主操作、次要操作、标题、说明等，按需组合使用。
> 操作区的复杂交互能力、插槽机制及典型实现方式详见第7节"插槽说明与交互增强范式"。

#### 表格区（columns）
- `columns` 配置表格字段，支持自定义渲染、搜索项、表头提示等。
- 每一列建议配置 `title`、`dataIndex`、`key`，如需自定义表单项，使用 `renderFormItem`。
- 支持列固定（如操作列、状态列建议 `fixed: 'right'`）。
- 状态字段建议用 Badge 渲染，保持风格一致。一般成功success，失败error，进行中processing，初始化Default。
- 支持行选中、hover、空态等交互。
- 支持表头吸顶（sticky）。
- 如需自定义表格单元格内容，使用 `render`。
- 如需为表头添加提示信息，使用 `tooltip`。
- 如需自定义列宽，使用 `width`。
- 如遇内容超长，使用 `ellipsis` 自动省略。

#### 操作列（columns.option/render）
- 用于在每一行插入"编辑"、"删除"、"详情"等操作按钮。
- 常规用法为通过render插入按钮，支持基础的点击事件。
- 操作后建议自动刷新表格。
> 如需实现弹窗、二次确认、接口调用等复杂交互，请参见第7节"插槽说明与交互增强范式"。

#### 分页栏（pagination）
- 建议采用ProTable默认分页栏布局。
- 支持快速跳转到指定页码（showQuickJumper）。
- 支持切换每页条数（showSizeChanger），常用选项如 10、20、50、100 条/页。
- 分页栏样式需与整体页面风格保持一致，建议分页栏与表格主体有适当留白，避免拥挤。
- 分页栏通常不需要自定义，直接用 ProTable 的 pagination 配置即可。

---

## 6. 表格开发要点
- 必须使用 `@ant-design/pro-components` 的 `ProTable` 组件，禁止使用 antd 原生 Table。
- 推荐配合团队自研/复用组件（如 `ProFormSelect`）。
- 默认使用 `useRequest`、`useRef`、`useState`、`useResponsiveItems`、`useFullScreenStatus` 等 React Hooks 管理状态和交互。
- 代码需带注释，禁止any、禁止行内样式、禁止直接操作DOM等。


## 7. 插槽与交互增强范式

> **插槽（Slot）定义**：插槽指页面结构中预留的、可插入内容或交互能力的区域（如操作区左侧/右侧、行操作列等），即"放哪里"。
>
> **交互增强（Interaction Enhancement）定义**：指在插槽中插入的复杂交互能力（如弹窗、表单、二次确认、接口调用、页面刷新等），即"交互内容"。
>

### 7.1 插槽区域
| 插槽名称               | 位置说明                 | 适合交互类型         |
|----------------------|------------------------|--------------------|
| 操作区左侧       | 表格操作区左侧（headerTitle） | 新增、批量导入等等 |
| 操作区右侧       | 表格操作区右侧（toolBarRender） | 导出、设置等等 |
| 行操作列              | 表格每一行最右侧(columns.option)         | 详情、编辑、删除等等   |


### 7.2 说明
- 操作区（headerTitle/toolBarRender）可灵活放置主操作、次要操作、标题、说明等，按需组合使用。
- 每个插槽都可以根据业务需求灵活插入交互能力，推荐优先使用团队标准组件和交互流程。
- 交互增强代码一般需包含接口引入、弹窗/表单/确认、接口调用、页面刷新等完整流程。
- 部分具体的API使用可以按8、API总览来

## 8. API 总览
下表梳理了 ProTable（@ant-design/pro-components）中常用一些api使用方法，便于用户进行业务定制

1. **headerTitle**
   - 作用：自定义表格左上角的标题区域。
   - 用法：一般会放一些类似"新增"、"批量导入"等按钮或自定义内容。
   - API：`headerTitle?: React.ReactNode`

2. **toolBarRender** 
   - 作用：自定义表格上方工具栏区域（右侧）。
   - 用法：一般会放一些导出、批量操作等按钮。
   - API：`toolBarRender: (action) => ReactNode[]`
   - 说明：表格的主要交互能力（如操作按钮、批量操作、导出等）通常结合 columns 的能力颗粒（如 render、copyable、ellipsis 等）灵活实现，详见下方 columns 常用属性说明。

3. **columns 列定义**
   - 作用：定义表格的每一列，包括数据展示、操作按钮、搜索表单项等。
   - 用法：通过 `columns` 配置数组，灵活插入操作列（render）、自定义渲染、表单项等。表格的交互能力颗粒（如复制、内容省略、批量操作等）也主要通过 columns 的相关属性实现。
   - API：`columns: ProColumns[]`，其中每一项可用 `render`、`renderFormItem`、`filters` 等属性自定义。
   **常用属性说明：**
   - **tooltip**：表头提示信息。
     类型：`string`
   - **ellipsis**：自动省略超长内容，避免表格撑开。
     类型：`boolean | { showTitle?: boolean }`
   - **copyable**：支持一键复制单元格内容。
     类型：`boolean`
   - **render**：自定义单元格渲染，插入按钮、标签、复杂内容等。
     类型：`(_: unknown, record: T[表格项类型], index: number, action: UseFetchDataAction<T>) => ReactNode | ReactNode[]`
   - **renderFormItem**：自定义查询表单项渲染，适合联动、特殊控件等。
     类型：`(item, { type, defaultRender, formItemProps, fieldProps, ...rest }, form) => ReactNode`
   - **search**：控制该列是否参与搜索表单，或自定义搜索行为。
     类型：`false | { transform: (value: any) => any }`
   - **search.transform**：搜索表单值转换，常用于时间区间、枚举等。
     类型：`(value: any) => any`
   - **colSize**：控制表单项在查询表单中的宽度（栅格占比）。
     类型：`number`
   - **hideInSearch**：是否在查询表单中隐藏该项。
     类型：`boolean`
   - **hideInTable**：是否在表格中隐藏该列。
     类型：`boolean`

---

## 9. 边界与约束
- 仅适用于标准表格页面，极端定制化场景需人工补充。
- 在写代码文件的时候若有接口层的定义优先完成接口层的ts类型和api文件的生成。
- 如涉及接口，需先生成接口层类型和API方法，再生成页面代码。
- 输入不全时需主动追问，让用户补充相关的信息。
- 严格遵循目录结构、核心代码模板、样式片段、交互规范。
- 禁止直接操作DOM、禁止any、禁止行内样式、禁止无注释代码。
- 代码需带注释，便于理解和维护。 
- 保障生成的代码可直接被执行，无任何语法错误、TypeScript类型报错。
