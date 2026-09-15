import React from "react";
import { Col, Row } from "antd";
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import type {
  CreateOrganizationNodeParams,
  OrganizationNode,
  OrganizationNodeType,
  UpdateOrganizationNodeParams,
} from "@/services/Organization";

interface OrganizationFormModalProps {
  initialValues?: OrganizationNode;
  mode: "create" | "edit";
  onFinish: (
    values: CreateOrganizationNodeParams | UpdateOrganizationNodeParams
  ) => Promise<boolean>;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  parent?: OrganizationNode;
}

const childTypeByParent: Partial<
  Record<OrganizationNodeType, OrganizationNodeType>
> = {
  ROOT: "REGION",
  REGION: "AGENT",
  AGENT: "STORE",
};

const typeLabels: Record<OrganizationNodeType, string> = {
  ROOT: "平台",
  REGION: "区域",
  AGENT: "一级代理商",
  STORE: "门店",
};

const OrganizationFormModal: React.FC<OrganizationFormModalProps> = ({
  initialValues,
  mode,
  onFinish,
  onOpenChange,
  open,
  parent,
}) => {
  const type =
    initialValues?.type ||
    (parent ? childTypeByParent[parent.type] : undefined) ||
    "ROOT";
  const requiresContact = type !== "REGION";

  return (
    <ModalForm
      key={`${mode}-${initialValues?.id || parent?.id || "root"}`}
      initialValues={{
        name: initialValues?.name,
        code: initialValues?.code,
        contactName: initialValues?.contactName,
        contactPhone: initialValues?.contactPhone,
        address: initialValues?.address,
        region: initialValues?.region,
        province: initialValues?.province,
      }}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
        onCancel: () => onOpenChange(false),
      }}
      onFinish={onFinish}
      onOpenChange={onOpenChange}
      open={open}
      title={`${mode === "create" ? "新增" : "编辑"}${typeLabels[type]}`}
      width={720}
    >
      {mode === "create" && parent && (
        <div className="organization-form__parent">
          上级节点：<strong>{parent.name}</strong>
        </div>
      )}
      <Row gutter={[20, 0]}>
        <Col xs={24} md={12}>
          <ProFormText
            fieldProps={{ maxLength: 120 }}
            label="名称"
            name="name"
            placeholder={`请输入${typeLabels[type]}名称`}
            rules={[{ required: true, message: "请输入名称" }]}
          />
        </Col>
        <Col xs={24} md={12}>
          <ProFormText
            disabled={mode === "edit"}
            fieldProps={{ maxLength: 64 }}
            label="编码"
            name="code"
            placeholder="请输入唯一编码"
            rules={[
              { required: true, message: "请输入编码" },
              {
                pattern: /^[a-zA-Z0-9_-]+$/,
                message: "编码只能包含字母、数字、下划线和短横线",
              },
            ]}
          />
        </Col>
        {type !== "REGION" && (
          <>
            <Col xs={24} md={12}>
              <ProFormText
                fieldProps={{ maxLength: 64 }}
                label="联系人"
                name="contactName"
                placeholder="请输入联系人"
                rules={
                  requiresContact
                    ? [{ required: true, message: "请输入联系人" }]
                    : []
                }
              />
            </Col>
            <Col xs={24} md={12}>
              <ProFormText
                fieldProps={{ maxLength: 32 }}
                label="联系电话"
                name="contactPhone"
                placeholder="请输入联系电话"
                rules={[
                  ...(requiresContact
                    ? [{ required: true, message: "请输入联系电话" }]
                    : []),
                  {
                    pattern: /^[0-9+() -]+$/,
                    message: "联系电话格式不正确",
                  },
                ]}
              />
            </Col>
            <Col span={24}>
              <ProFormText
                fieldProps={{ maxLength: 255 }}
                label="地址"
                name="address"
                placeholder="请输入详细地址"
                rules={
                  requiresContact
                    ? [{ required: true, message: "请输入地址" }]
                    : []
                }
              />
            </Col>
          </>
        )}
        <Col xs={24} md={12}>
          <ProFormSelect
            label="区域"
            name="region"
            options={[
              "华东",
              "华南",
              "华北",
              "西南",
              "西北",
              "东北",
            ].map((value) => ({
              label: value,
              value,
            }))}
            placeholder="请选择区域"
          />
        </Col>
        <Col xs={24} md={12}>
          <ProFormText
            fieldProps={{ maxLength: 32 }}
            label="省份"
            name="province"
            placeholder="请输入省份"
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default OrganizationFormModal;
