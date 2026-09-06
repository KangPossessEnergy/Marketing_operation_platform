import React, { useEffect, useRef, useState } from "react";
import { ExportOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Space, Tabs, Tag, message } from "antd";
import type { ActionType } from "@ant-design/pro-components";
import { UserManagementServices } from "@/services/UserManagement";
import type {
  AccountUser,
  CreateAccountParams,
} from "@/services/UserManagement";
import { publishSuccess } from "@/utils/mitt";
import UserFormModal from "./UserFormModal";
import UserSearchForm from "./UserSearchForm";
import UserTable from "./UserTable";
import type { UserFormValues, UserSearchValues } from "./types";
import {
  defaultPageSize,
  displayValue,
  downloadUsersCsv,
  normalizeValue,
  toQueryParams,
} from "./utils";
import "./index.less";

const UserManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [filters, setFilters] = useState<UserSearchValues>({});
  const [activeTab, setActiveTab] = useState("users");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AccountUser>();

  useEffect(() => {
    actionRef.current?.reload(true);
  }, [filters]);

  const handleOpenCreate = () => {
    setEditingUser(undefined);
    setModalOpen(true);
  };

  const handleOpenEdit = async (record: AccountUser) => {
    try {
      const { data } = await UserManagementServices.getById(record.id);
      setEditingUser(data);
      setModalOpen(true);
    } catch {
      // 请求错误由全局监听器统一提示。
    }
  };

  const handleDelete = (record: AccountUser) => {
    Modal.confirm({
      title: "确认删除用户？",
      content: `删除后将无法恢复“${displayValue(record.username)}”的账号信息。`,
      okText: "确认删除",
      cancelText: "取消",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await UserManagementServices.remove(record.id);
          publishSuccess(`用户“${displayValue(record.username)}”已删除`);
          actionRef.current?.reload(true);
        } catch {
          // 请求错误由全局监听器统一提示。
        }
      },
    });
  };

  const handleSaveUser = async (values: UserFormValues) => {
    const username = normalizeValue(values.username);
    const phone = normalizeValue(values.phone);
    const password = normalizeValue(values.password);

    if (editingUser) {
      if (!phone) {
        message.warning("请输入手机号码");
        return false;
      }

      try {
        await UserManagementServices.update(editingUser.id, { phone });
        setModalOpen(false);
        setEditingUser(undefined);
        publishSuccess("用户信息已更新");
        actionRef.current?.reload(true);
        return true;
      } catch {
        // 请求错误由全局监听器统一提示。
        return false;
      }
    }

    if (!username && !phone) {
      message.warning("用户名和手机号至少填写一个");
      return false;
    }

    if (username && !password) {
      message.warning("使用用户名创建账号时必须设置密码");
      return false;
    }

    const params: CreateAccountParams = {
      ...(username ? { username } : {}),
      ...(phone ? { phone } : {}),
      ...(password ? { password } : {}),
    };

    try {
      await UserManagementServices.create(params);
      setModalOpen(false);
      setEditingUser(undefined);
      publishSuccess("用户已创建");
      actionRef.current?.reload(true);
      return true;
    } catch {
      // 请求错误由全局监听器统一提示。
      return false;
    }
  };

  const requestUsers = async (params: {
    current?: number;
    pageSize?: number;
  }) => {
    const page = params.current ?? 1;
    const pageSize = params.pageSize ?? defaultPageSize;
    const { data } = await UserManagementServices.list(
      toQueryParams(filters, page, pageSize)
    );

    return {
      data: data.items,
      success: true,
      total: data.total,
    };
  };

  const handleExport = async () => {
    try {
      const pageSize = 100;
      const firstResponse = await UserManagementServices.list(
        toQueryParams(filters, 1, pageSize)
      );
      const firstPage = firstResponse.data;
      let users = firstPage.items;
      const totalPages = Math.ceil(firstPage.total / pageSize);

      if (totalPages > 1) {
        const pageResponses = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, index) =>
            UserManagementServices.list(
              toQueryParams(filters, index + 2, pageSize)
            )
          )
        );
        users = users.concat(
          pageResponses.flatMap((response) => response.data.items)
        );
      }

      downloadUsersCsv(users);
      publishSuccess("用户数据已导出");
    } catch {
      // 请求错误由全局监听器统一提示。
    }
  };

  return (
    <section className="account-workspace" aria-label="账号信息用户管理">
      <UserSearchForm
        onReset={() => setFilters({})}
        onSearch={setFilters}
      />

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
          <UserTable
            actionRef={actionRef}
            onDelete={handleDelete}
            onEdit={handleOpenEdit}
            request={requestUsers}
          />
        ) : (
          <div className="account-role-placeholder">
            <Tag color="blue">角色管理</Tag>
            <h2>角色管理功能待接入</h2>
            <p>当前先完成用户管理，角色权限配置将在后续版本开放。</p>
          </div>
        )}
      </div>

      <UserFormModal
        editingUser={editingUser}
        onFinish={handleSaveUser}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) {
            setEditingUser(undefined);
          }
        }}
        open={modalOpen}
      />
    </section>
  );
};

export default UserManagement;
