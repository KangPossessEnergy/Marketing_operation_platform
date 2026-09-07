import React from "react";
import { Button, Col, Form, Row, Space } from "antd";
import {
  ProForm,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import type { UserSearchValues } from "./types";

interface UserSearchFormProps {
  onReset: () => void;
  onSearch: (values: UserSearchValues) => void;
}

const UserSearchForm: React.FC<UserSearchFormProps> = ({
  onReset,
  onSearch,
}) => {
  const [form] = Form.useForm<UserSearchValues>();

  const handleFinish = async (values: UserSearchValues) => {
    onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <div className="account-filter-panel">
      <ProForm<UserSearchValues>
        form={form}
        className="account-filter-form"
        layout="horizontal"
        colon={true}
        onFinish={handleFinish}
        submitter={false}
      >
        <Row gutter={[20, 14]} align="middle">
          {/* 1. 用户名 */}
          <Col xs={24} sm={12} md={8} lg={6} xl={4} xxl={4}>
            <ProFormText
              name="username"
              label="用户名"
              placeholder="请输入用户名"
              fieldProps={{
                allowClear: true,
              }}
            />
          </Col>

          {/* 2. 手机号码 */}
          <Col xs={24} sm={12} md={8} lg={6} xl={5} xxl={4}>
            <ProFormText
              name="phone"
              label="手机号码"
              placeholder="请输入手机号码"
              fieldProps={{
                allowClear: true,
              }}
            />
          </Col>

          {/* 3. 角色名称 */}
          <Col xs={24} sm={12} md={8} lg={6} xl={4} xxl={4}>
            <ProFormText
              name="roleName"
              label="角色名称"
              placeholder="请输入角色名称"
              fieldProps={{
                allowClear: true,
              }}
            />
          </Col>

          {/* 4. 门店名称 */}
          <Col xs={24} sm={12} md={8} lg={6} xl={5} xxl={4}>
            <ProFormSelect
              name="storeName"
              label="门店名称"
              placeholder="请选择门店名称"
              options={[
                { label: "全屋智能旗舰店", value: "store_flagship" },
                { label: "未来城体验中心", value: "store_future" },
                { label: "智慧家直营店", value: "store_direct" },
              ]}
              fieldProps={{
                allowClear: true,
                showSearch: true,
              }}
            />
          </Col>

          {/* 5. 一级代理 */}
          <Col xs={24} sm={12} md={8} lg={6} xl={5} xxl={4}>
            <ProFormSelect
              name="firstAgent"
              label="一级代理"
              placeholder="请选择一级代理名称"
              options={[
                { label: "华东大区总代理", value: "agent_east" },
                { label: "华南大区总代理", value: "agent_south" },
                { label: "华北大区总代理", value: "agent_north" },
              ]}
              fieldProps={{
                allowClear: true,
                showSearch: true,
              }}
            />
          </Col>

          {/* 6. 二级代理 */}
          <Col xs={24} sm={12} md={8} lg={6} xl={5} xxl={4}>
            <ProFormSelect
              name="secondAgent"
              label="二级代理"
              placeholder="请选择二级代理名称"
              options={[
                { label: "区域授权服务商A", value: "sub_agent_a" },
                { label: "区域授权服务商B", value: "sub_agent_b" },
                { label: "区域授权服务商C", value: "sub_agent_c" },
              ]}
              fieldProps={{
                allowClear: true,
                showSearch: true,
              }}
            />
          </Col>

          {/* 操作按钮：[ 搜索 ] [ 清空 ] */}
          <Col xs={24} sm={12} md={8} lg={6} xl={5} xxl={4}>
            <Form.Item className="account-filter-actions-item">
              <Space size={10}>
                <Button type="primary" onClick={() => form.submit()}>
                  搜索
                </Button>
                <Button onClick={handleReset}>
                  清空
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </ProForm>
    </div>
  );
};

export default UserSearchForm;
