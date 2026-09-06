import React from "react";
import { Col, Row, Space } from "antd";
import { ProForm, ProFormText } from "@ant-design/pro-components";
import type { UserSearchValues } from "./types";

interface UserSearchFormProps {
  onReset: () => void;
  onSearch: (values: UserSearchValues) => void;
}

const UserSearchForm: React.FC<UserSearchFormProps> = ({
  onReset,
  onSearch,
}) => (
  <div className="account-filter-panel">
    <ProForm<UserSearchValues>
      className="account-filter-form"
      layout="horizontal"
      labelCol={{ flex: "68px" }}
      onFinish={async (values) => {
        onSearch(values);
      }}
      onReset={onReset}
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
        <Col xs={24} sm={12} lg={8} xl={6}>
          <ProFormText
            fieldProps={{
              allowClear: true,
              placeholder: "请输入用户名或手机号",
            }}
            label="账号关键词"
            name="keyword"
          />
        </Col>
      </Row>
    </ProForm>
  </div>
);

export default UserSearchForm;
