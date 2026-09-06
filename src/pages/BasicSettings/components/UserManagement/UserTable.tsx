import React, { useMemo } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Space } from "antd";
import { ProTable } from "@ant-design/pro-components";
import type {
  ActionType,
  ProColumns,
} from "@ant-design/pro-components";
import type { MutableRefObject } from "react";
import type { AccountUser } from "@/services/UserManagement";
import type {
  UserListRequestParams,
  UserListRequestResult,
} from "./types";
import { defaultPageSize, displayValue, formatDateTime } from "./utils";

interface UserTableProps {
  actionRef: MutableRefObject<ActionType | undefined>;
  onDelete: (record: AccountUser) => void;
  onEdit: (record: AccountUser) => void | Promise<void>;
  request: (
    params: UserListRequestParams
  ) => Promise<UserListRequestResult>;
}

const UserTable: React.FC<UserTableProps> = ({
  actionRef,
  onDelete,
  onEdit,
  request,
}) => {
  const columns = useMemo<ProColumns<AccountUser>[]>(
    () => [
      {
        title: "用户名称",
        dataIndex: "username",
        key: "username",
        width: 220,
        render: (_, record) => (
          <div className="account-user-name">
            <span className="account-user-name__avatar">
              <UserOutlined />
            </span>
            <strong>{displayValue(record.username)}</strong>
          </div>
        ),
      },
      {
        title: "手机号码",
        dataIndex: "phone",
        key: "phone",
        width: 180,
        render: (_, record) => displayValue(record.phone),
      },
      {
        title: "手机号验证状态",
        dataIndex: "phoneVerifiedAt",
        key: "phoneVerifiedAt",
        width: 150,
        render: (_, record) =>
          record.phoneVerifiedAt ? "已验证" : "未验证",
      },
      {
        title: "创建时间",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 190,
        render: (_, record) => formatDateTime(record.createdAt),
      },
      {
        title: "更新时间",
        dataIndex: "updatedAt",
        key: "updatedAt",
        width: 190,
        render: (_, record) => formatDateTime(record.updatedAt),
      },
      {
        title: "操作",
        key: "action",
        fixed: "right",
        width: 140,
        render: (_, record) => (
          <Space size={4}>
            <Button
              className="account-table-action"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              type="link"
            >
              编辑
            </Button>
            <Button
              className="account-table-action account-table-action--danger"
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
              type="link"
            >
              删除
            </Button>
          </Space>
        ),
      },
    ],
    [onDelete, onEdit]
  );

  return (
    <ProTable<AccountUser, UserListRequestParams>
      actionRef={actionRef}
      cardBordered={false}
      columns={columns}
      ghost
      options={false}
      pagination={{
        defaultPageSize,
        showQuickJumper: true,
        showSizeChanger: true,
      }}
      request={request}
      rowKey="id"
      search={false}
      scroll={{ x: 1040 }}
      size="middle"
    />
  );
};

export default UserTable;
