---
trigger: glob
glob: *.tsx, *.jsx
---

# Form（表单组件）
- 独立优先使用ProForm，表单弹窗优先使用ProFormModal，表单抽屉优先使用ProFormDrawer
- 优先使用Ant Design Pro的Form组件，如果无法满足需求，再考虑使用Ant Design的Form组件。例如，表单中的选择框，优先使用ProFormSelect，仅当功能不满足时使用Form.Item和Select.
- 表单项联动，优先使用ProFormDependency.