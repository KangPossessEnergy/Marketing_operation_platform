import React from "react";
import { Col, Row } from "antd";
import {
  ModalForm,
  ProFormText,
} from "@ant-design/pro-components";
import type { AccountUser } from "@/services/UserManagement";
import type { UserFormValues } from "./types";
import { normalizeValue } from "./utils";

interface UserFormModalProps {
  editingUser?: AccountUser;
  onFinish: (values: UserFormValues) => Promise<boolean | undefined>;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  editingUser,
  onFinish,
  onOpenChange,
  open,
}) => {
  const initialValues: UserFormValues = editingUser
    ? {
        username: editingUser.username ?? "",
        phone: editingUser.phone ?? "",
      }
    : {
        username: "",
        phone: "",
        password: "",
      };

  return (
    <ModalForm<UserFormValues>
      key={editingUser?.id || "create"}
      initialValues={initialValues}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
        onCancel: () => onOpenChange(false),
      }}
      onFinish={onFinish}
      onOpenChange={onOpenChange}
      open={open}
      title={editingUser ? "编辑用户" : "新增用户"}
      width={620}
    >
      <Row gutter={[18, 0]}>
        <Col span={12}>
          <ProFormText
            disabled={Boolean(editingUser)}
            fieldProps={{ maxLength: 32 }}
            label="用户名"
            name="username"
            rules={[
              {
                validator: async (_, value) => {
                  const username = normalizeValue(value);
                  if (
                    username &&
                    !/^[a-zA-Z0-9_]{3,32}$/.test(username)
                  ) {
                    throw new Error(
                      "用户名需为 3-32 位字母、数字或下划线"
                    );
                  }
                },
              },
            ]}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            fieldProps={{ maxLength: 11 }}
            label="手机号码"
            name="phone"
            rules={[
              {
                message: "编辑用户时请输入手机号码",
                required: Boolean(editingUser),
              },
              {
                validator: async (_, value) => {
                  const phone = normalizeValue(value);
                  if (phone && !/^1[3-9]\d{9}$/.test(phone)) {
                    throw new Error("请输入正确的手机号码");
                  }
                },
              },
            ]}
          />
        </Col>
        {!editingUser && (
          <Col span={12}>
            <ProFormText
              fieldProps={{ maxLength: 128, type: "password" }}
              label="登录密码"
              name="password"
              rules={[
                {
                  min: 6,
                  message: "密码长度不能少于 6 位",
                },
              ]}
            />
          </Col>
        )}
      </Row>
    </ModalForm>
  );
};

export default UserFormModal;
