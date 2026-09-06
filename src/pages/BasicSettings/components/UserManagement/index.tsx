import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Modal,
  Row,
  Space,
  Switch,
  Tabs,
  Tag,
  message,
} from "antd";
import {
  ModalForm,
  ProForm,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { publishSuccess } from "@/utils/mitt";
import "./index.less";

type UserStatus = "启用" | "停用";

type UserRecord = {
  id: string;
  username: string;
  roleName: string;
  status: UserStatus;
  mobile: string;
  firstAgent: string;
  secondAgent: string;
  storeName: string;
  exportPermission: boolean;
  creator: string;
  updater: string;
  updatedAt: string;
};

type UserSearchValues = {
  username?: string;
  mobile?: string;
  roleName?: string;
  storeName?: string;
  firstAgent?: string;
  secondAgent?: string;
};

type UserFormValues = {
  username: string;
  mobile: string;
  roleName: string;
  storeName: string;
  firstAgent: string;
  secondAgent: string;
  status: boolean;
  exportPermission: boolean;
};

const roleOptions = [
  { label: "超级管理员", value: "超级管理员" },
  { label: "店长", value: "店长" },
  { label: "店员", value: "店员" },
  { label: "运营专员", value: "运营专员" },
];

const storeOptions = [
  { label: "德清专卖店", value: "德清专卖店" },
  { label: "杭州旗舰店", value: "杭州旗舰店" },
  { label: "宁波体验店", value: "宁波体验店" },
];

const agentOptions = [
  { label: "无", value: "--" },
  { label: "华东代理商", value: "华东代理商" },
  { label: "浙江代理商", value: "浙江代理商" },
  { label: "德清代理商", value: "德清代理商" },
];

const mockUsers: UserRecord[] = [
  {
    id: "user-1",
    username: "花花",
    roleName: "-",
    status: "启用",
    mobile: "15096287300",
    firstAgent: "-",
    secondAgent: "-",
    storeName: "-",
    exportPermission: false,
    creator: "花花",
    updater: "-",
    updatedAt: "2026-09-05 11:51:24",
  },
  {
    id: "user-2",
    username: "小葵",
    roleName: "-",
    status: "启用",
    mobile: "15546120350",
    firstAgent: "-",
    secondAgent: "-",
    storeName: "-",
    exportPermission: false,
    creator: "小葵",
    updater: "-",
    updatedAt: "2026-09-05 14:49:26",
  },
  {
    id: "user-3",
    username: "张鹏飞",
    roleName: "-",
    status: "启用",
    mobile: "13623671688",
    firstAgent: "-",
    secondAgent: "-",
    storeName: "-",
    exportPermission: false,
    creator: "张鹏飞",
    updater: "-",
    updatedAt: "2026-09-05 10:09:44",
  },
  {
    id: "user-4",
    username: "德清谢瑜娇",
    roleName: "店员",
    status: "启用",
    mobile: "15957231213",
    firstAgent: "-",
    secondAgent: "-",
    storeName: "德清专卖店",
    exportPermission: true,
    creator: "应俊杰",
    updater: "应俊杰",
    updatedAt: "2026-09-05 10:08:09",
  },
  {
    id: "user-5",
    username: "德清余伟芬",
    roleName: "店长",
    status: "启用",
    mobile: "13867258999",
    firstAgent: "-",
    secondAgent: "-",
    storeName: "德清专卖店",
    exportPermission: true,
    creator: "应俊杰",
    updater: "应俊杰",
    updatedAt: "2026-09-04 14:08:25",
  },
  {
    id: "user-6",
    username: "德清朱双英",
    roleName: "店长",
    status: "启用",
    mobile: "13567265852",
    firstAgent: "-",
    secondAgent: "-",
    storeName: "德清专卖店",
    exportPermission: true,
    creator: "应俊杰",
    updater: "应俊杰",
    updatedAt: "2026-09-04 14:05:45",
  },
  {
    id: "user-7",
    username: "德清谢锦平",
    roleName: "店员",
    status: "启用",
    mobile: "13655722720",
    firstAgent: "-",
    secondAgent: "-",
    storeName: "德清专卖店",
    exportPermission: true,
    creator: "应俊杰",
    updater: "应俊杰",
    updatedAt: "2026-09-04 14:17:57",
  },
  {
    id: "user-8",
    username: "德清费红英",
    roleName: "店员",
    status: "启用",
    mobile: "13867265518",
    firstAgent: "-",
    secondAgent: "-",
    storeName: "德清专卖店",
    exportPermission: true,
    creator: "应俊杰",
    updater: "应俊杰",
    updatedAt: "2026-09-04 14:09:35",
  },
  {
    id: "user-9",
    username: "德清何芳",
    roleName: "店员",
    status: "启用",
    mobile: "13655822528",
    firstAgent: "-",
    secondAgent: "-",
    storeName: "德清专卖店",
    exportPermission: true,
    creator: "应俊杰",
    updater: "应俊杰",
    updatedAt: "2026-09-04 14:08:32",
  },
];

const getNow = () => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

const normalizeValue = (value?: string) => value?.trim().toLowerCase() || "";

const UserManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [users, setUsers] = useState<UserRecord[]>(mockUsers);
  const [filters, setFilters] = useState<UserSearchValues>({});
  const [activeTab, setActiveTab] = useState("users");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord>();

  useEffect(() => {
    actionRef.current?.reload();
  }, [filters, users]);

  const tableColumns = useMemo<ProColumns<UserRecord>[]>(
    () => [
      {
        title: "用户名称",
        dataIndex: "username",
        key: "username",
        width: 150,
        render: (_, record) => (
          <div className="account-user-name">
            <span className="account-user-name__avatar">
              <UserOutlined />
            </span>
            <strong>{record.username}</strong>
          </div>
        ),
      },
      {
        title: "角色",
        dataIndex: "roleName",
        key: "roleName",
        width: 120,
      },
      {
        title: "用户状态",
        dataIndex: "status",
        key: "status",
        width: 110,
        render: (_, record) => (
          <Switch
            checked={record.status === "启用"}
            onChange={(checked) => handleToggleStatus(record, checked)}
            size="small"
          />
        ),
      },
      {
        title: "手机号码",
        dataIndex: "mobile",
        key: "mobile",
        width: 145,
      },
      {
        title: "一级代理商",
        dataIndex: "firstAgent",
        key: "firstAgent",
        width: 130,
      },
      {
        title: "二级代理商",
        dataIndex: "secondAgent",
        key: "secondAgent",
        width: 130,
      },
      {
        title: "门店",
        dataIndex: "storeName",
        key: "storeName",
        width: 140,
      },
      {
        title: "导出权限",
        dataIndex: "exportPermission",
        key: "exportPermission",
        width: 110,
        align: "center",
        render: (value) =>
          value ? (
            <CheckCircleFilled className="permission-icon permission-icon--enabled" />
          ) : (
            <CloseCircleFilled className="permission-icon permission-icon--disabled" />
          ),
      },
      {
        title: "创建人",
        dataIndex: "creator",
        key: "creator",
        width: 110,
      },
      {
        title: "修改人",
        dataIndex: "updater",
        key: "updater",
        width: 110,
      },
      {
        title: "更新时间",
        dataIndex: "updatedAt",
        key: "updatedAt",
        width: 175,
      },
      {
        title: "操作",
        key: "action",
        fixed: "right",
        width: 120,
        render: (_, record) => (
          <Space size={4}>
            <Button
              className="account-table-action"
              icon={<EditOutlined />}
              onClick={() => handleOpenEdit(record)}
              type="link"
            >
              编辑
            </Button>
            <Button
              className="account-table-action account-table-action--danger"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              type="link"
            >
              删除
            </Button>
          </Space>
        ),
      },
    ],
    []
  );

  const handleToggleStatus = (record: UserRecord, checked: boolean) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === record.id
          ? {
              ...user,
              status: checked ? "启用" : "停用",
              updater: "当前用户",
              updatedAt: getNow(),
            }
          : user
      )
    );
    publishSuccess(`${record.username} 已${checked ? "启用" : "停用"}`);
  };

  const handleOpenCreate = () => {
    setEditingUser(undefined);
    setModalOpen(true);
  };

  const handleOpenEdit = (record: UserRecord) => {
    setEditingUser(record);
    setModalOpen(true);
  };

  const handleDelete = (record: UserRecord) => {
    Modal.confirm({
      title: "确认删除用户？",
      content: `删除后将无法恢复“${record.username}”的账号信息。`,
      okText: "确认删除",
      cancelText: "取消",
      okButtonProps: { danger: true },
      onOk: () => {
        setUsers((currentUsers) =>
          currentUsers.filter((user) => user.id !== record.id)
        );
        publishSuccess(`用户“${record.username}”已删除`);
      },
    });
  };

  const handleSaveUser = async (values: UserFormValues) => {
    const username = values.username.trim();
    const duplicate = users.some(
      (user) => user.username === username && user.id !== editingUser?.id
    );

    if (duplicate) {
      message.warning("用户名已存在，请更换后重试");
      return false;
    }

    const nextUser: UserRecord = {
      id: editingUser?.id || `user-${Date.now()}`,
      username,
      roleName: values.roleName || "-",
      status: values.status ? "启用" : "停用",
      mobile: values.mobile.trim(),
      firstAgent: values.firstAgent || "-",
      secondAgent: values.secondAgent || "-",
      storeName: values.storeName || "-",
      exportPermission: values.exportPermission,
      creator: editingUser?.creator || "当前用户",
      updater: "当前用户",
      updatedAt: getNow(),
    };

    setUsers((currentUsers) => {
      if (editingUser) {
        return currentUsers.map((user) =>
          user.id === editingUser.id ? nextUser : user
        );
      }

      return [nextUser, ...currentUsers];
    });
    setModalOpen(false);
    setEditingUser(undefined);
    publishSuccess(editingUser ? "用户信息已更新" : "用户已创建");
    return true;
  };

  const handleExport = () => {
    const header = [
      "用户名称",
      "角色",
      "用户状态",
      "手机号码",
      "一级代理商",
      "二级代理商",
      "门店",
      "导出权限",
      "创建人",
      "修改人",
      "更新时间",
    ];
    const rows = users.map((user) => [
      user.username,
      user.roleName,
      user.status,
      user.mobile,
      user.firstAgent,
      user.secondAgent,
      user.storeName,
      user.exportPermission ? "有" : "无",
      user.creator,
      user.updater,
      user.updatedAt,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${value}"`).join(","))
      .join("\n");
    const blob = new Blob([`\ufeff${csv}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `用户列表-${getNow().replace(/[: ]/g, "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    publishSuccess("用户数据已导出");
  };

  const requestUsers = async (
    params: UserSearchValues & { current?: number; pageSize?: number }
  ) => {
    const activeFilters = {
      username: normalizeValue(params.username ?? filters.username),
      mobile: normalizeValue(params.mobile ?? filters.mobile),
      roleName: normalizeValue(params.roleName ?? filters.roleName),
      storeName: normalizeValue(params.storeName ?? filters.storeName),
      firstAgent: normalizeValue(params.firstAgent ?? filters.firstAgent),
      secondAgent: normalizeValue(params.secondAgent ?? filters.secondAgent),
    };
    const filteredUsers = users.filter((user) => {
      const fields = {
        username: normalizeValue(user.username),
        mobile: normalizeValue(user.mobile),
        roleName: normalizeValue(user.roleName),
        storeName: normalizeValue(user.storeName),
        firstAgent: normalizeValue(user.firstAgent),
        secondAgent: normalizeValue(user.secondAgent),
      };

      return Object.entries(activeFilters).every(
        ([key, value]) => !value || fields[key as keyof typeof fields].includes(value)
      );
    });

    return {
      data: filteredUsers,
      success: true,
      total: filteredUsers.length,
    };
  };

  const modalInitialValues: UserFormValues = editingUser
    ? {
        username: editingUser.username,
        mobile: editingUser.mobile,
        roleName: editingUser.roleName === "-" ? undefined : editingUser.roleName,
        storeName: editingUser.storeName === "-" ? undefined : editingUser.storeName,
        firstAgent: editingUser.firstAgent === "-" ? undefined : editingUser.firstAgent,
        secondAgent:
          editingUser.secondAgent === "-" ? undefined : editingUser.secondAgent,
        status: editingUser.status === "启用",
        exportPermission: editingUser.exportPermission,
      }
    : {
        username: "",
        mobile: "",
        roleName: "店员",
        storeName: "德清专卖店",
        firstAgent: "--",
        secondAgent: "--",
        status: true,
        exportPermission: true,
      };

  return (
    <section className="account-workspace" aria-label="账号信息用户管理">
      <div className="account-filter-panel">
        <ProForm<UserSearchValues>
          className="account-filter-form"
          layout="horizontal"
          labelCol={{ flex: "68px" }}
          onFinish={async (values) => {
            setFilters(values);
          }}
          onReset={() => setFilters({})}
          submitter={{
            searchConfig: {
              resetText: "清空",
              submitText: "搜索",
            },
            render: (_, dom) => (
              <Space className="account-filter-actions">{dom}</Space>
            ),
          }}
        >
          <Row gutter={[18, 0]}>
            <Col xs={24} sm={12} lg={8} xl={4}>
              <ProFormText
                fieldProps={{ allowClear: true, placeholder: "请输入用户名" }}
                label="用户名"
                name="username"
              />
            </Col>
            <Col xs={24} sm={12} lg={8} xl={4}>
              <ProFormText
                fieldProps={{ allowClear: true, placeholder: "请输入手机号" }}
                label="手机号码"
                name="mobile"
              />
            </Col>
            <Col xs={24} sm={12} lg={8} xl={4}>
              <ProFormText
                fieldProps={{ allowClear: true, placeholder: "请输入角色名称" }}
                label="角色名称"
                name="roleName"
              />
            </Col>
            <Col xs={24} sm={12} lg={8} xl={4}>
              <ProFormSelect
                fieldProps={{ allowClear: true, placeholder: "请选择门店名称" }}
                label="门店名称"
                name="storeName"
                options={storeOptions}
              />
            </Col>
            <Col xs={24} sm={12} lg={8} xl={4}>
              <ProFormSelect
                fieldProps={{ allowClear: true, placeholder: "请选择一级代理商" }}
                label="一级代理商"
                name="firstAgent"
                options={agentOptions}
              />
            </Col>
            <Col xs={24} sm={12} lg={8} xl={4}>
              <ProFormSelect
                fieldProps={{ allowClear: true, placeholder: "请选择二级代理商" }}
                label="二级代理商"
                name="secondAgent"
                options={agentOptions}
              />
            </Col>
          </Row>
        </ProForm>
      </div>

      <div className="account-table-panel">
        <div className="account-table-panel__header">
          <Tabs
            activeKey={activeTab}
            items={[
              { key: "users", label: "用户管理" },
              { key: "roles", label: "角色管理" },
            ]}
            onChange={setActiveTab}
          />
          {activeTab === "users" && (
            <Space>
              <Button
                icon={<PlusOutlined />}
                onClick={handleOpenCreate}
                type="primary"
              >
                新增用户
              </Button>
              <Button icon={<ExportOutlined />} onClick={handleExport}>
                导出数据
              </Button>
            </Space>
          )}
        </div>

        {activeTab === "users" ? (
          <ProTable<UserRecord, UserSearchValues>
            actionRef={actionRef}
            cardBordered={false}
            columns={tableColumns}
            ghost
            options={false}
            pagination={{
              defaultPageSize: 8,
              showQuickJumper: true,
              showSizeChanger: true,
            }}
            request={requestUsers}
            rowKey="id"
            search={false}
            scroll={{ x: 1520 }}
            size="middle"
          />
        ) : (
          <div className="account-role-placeholder">
            <Tag color="blue">角色管理</Tag>
            <h2>角色管理功能待接入</h2>
            <p>当前先完成用户管理，角色权限配置将在后续版本开放。</p>
          </div>
        )}
      </div>

      <ModalForm<UserFormValues>
        key={editingUser?.id || "create"}
        destroyOnClose
        initialValues={modalInitialValues}
        modalProps={{
          maskClosable: false,
          onCancel: () => {
            setModalOpen(false);
            setEditingUser(undefined);
          },
        }}
        onFinish={handleSaveUser}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) {
            setEditingUser(undefined);
          }
        }}
        open={modalOpen}
        title={editingUser ? "编辑用户" : "新增用户"}
        width={620}
      >
        <Row gutter={[18, 0]}>
          <Col span={12}>
            <ProFormText
              fieldProps={{ maxLength: 30 }}
              label="用户名"
              name="username"
              rules={[{ message: "请输入用户名", required: true }]}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              fieldProps={{ maxLength: 11 }}
              label="手机号码"
              name="mobile"
              rules={[
                { message: "请输入手机号码", required: true },
                {
                  message: "请输入正确的手机号码",
                  pattern: /^1[3-9]\d{9}$/,
                },
              ]}
            />
          </Col>
          <Col span={12}>
            <ProFormSelect
              label="角色"
              name="roleName"
              options={roleOptions}
              rules={[{ message: "请选择角色", required: true }]}
            />
          </Col>
          <Col span={12}>
            <ProFormSelect
              label="门店"
              name="storeName"
              options={storeOptions}
              rules={[{ message: "请选择门店", required: true }]}
            />
          </Col>
          <Col span={12}>
            <ProFormSelect
              label="一级代理商"
              name="firstAgent"
              options={agentOptions}
            />
          </Col>
          <Col span={12}>
            <ProFormSelect
              label="二级代理商"
              name="secondAgent"
              options={agentOptions}
            />
          </Col>
          <Col span={12}>
            <ProFormSwitch
              checkedChildren="启用"
              label="用户状态"
              name="status"
              unCheckedChildren="停用"
            />
          </Col>
          <Col span={12}>
            <ProFormSwitch
              checkedChildren="有"
              label="导出权限"
              name="exportPermission"
              unCheckedChildren="无"
            />
          </Col>
        </Row>
      </ModalForm>
    </section>
  );
};

export default UserManagement;
