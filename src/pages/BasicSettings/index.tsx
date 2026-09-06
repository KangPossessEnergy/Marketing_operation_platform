import React, { useMemo, useState } from "react";
import { Breadcrumb, Button, Input, Table, Tag, Tree } from "antd";
import type { TreeDataNode } from "antd";
import {
  ApartmentOutlined,
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useParams } from "umi";
import "./index.less";

type SettingSection = {
  title: string;
  group: string;
  description: string;
};

type Department = {
  key: string;
  name: string;
  code: string;
  manager: string;
  memberCount: number;
  status: "启用" | "停用";
};

const settingSections: Record<string, SettingSection> = {
  "organization-structure": {
    title: "组织架构",
    group: "组织管理",
    description: "维护企业部门层级与成员归属，统一管理组织信息。",
  },
  "store-information": {
    title: "门店信息",
    group: "门店管理",
    description: "集中维护门店基础信息和运营状态。",
  },
  "construction-information": {
    title: "施工信息",
    group: "门店管理",
    description: "查看和维护门店施工阶段及交付信息。",
  },
  "account-information": {
    title: "账号信息",
    group: "账号管理",
    description: "管理平台账号、角色和使用状态。",
  },
  "announcement-configuration": {
    title: "公告配置",
    group: "配置管理",
    description: "维护平台公告内容、发布时间与展示范围。",
  },
  "material-upload": {
    title: "物料上传",
    group: "配置管理",
    description: "统一上传和管理平台运营物料。",
  },
  "family-management": {
    title: "家庭管理",
    group: "交付管理",
    description: "维护交付家庭档案和服务关联信息。",
  },
};

const organizationTree: TreeDataNode[] = [
  {
    title: "KKdw 全屋智能",
    key: "company",
    icon: <ApartmentOutlined />,
    children: [
      {
        title: "市场中心",
        key: "marketing",
        icon: <ApartmentOutlined />,
        children: [
          { title: "品牌部", key: "brand" },
          { title: "渠道部", key: "channel" },
        ],
      },
      {
        title: "运营中心",
        key: "operation",
        icon: <ApartmentOutlined />,
        children: [
          { title: "商品运营部", key: "product-operation" },
          { title: "客户运营部", key: "customer-operation" },
        ],
      },
      {
        title: "交付中心",
        key: "delivery",
        icon: <ApartmentOutlined />,
        children: [
          { title: "项目管理部", key: "project-management" },
          { title: "售后服务部", key: "after-sales" },
        ],
      },
    ],
  },
];

const departments: Department[] = [
  {
    key: "marketing",
    name: "市场中心",
    code: "MARKETING",
    manager: "李晓梅",
    memberCount: 18,
    status: "启用",
  },
  {
    key: "operation",
    name: "运营中心",
    code: "OPERATION",
    manager: "王志远",
    memberCount: 26,
    status: "启用",
  },
  {
    key: "delivery",
    name: "交付中心",
    code: "DELIVERY",
    manager: "陈思远",
    memberCount: 32,
    status: "启用",
  },
  {
    key: "brand",
    name: "品牌部",
    code: "BRAND",
    manager: "赵一鸣",
    memberCount: 8,
    status: "启用",
  },
  {
    key: "channel",
    name: "渠道部",
    code: "CHANNEL",
    manager: "周宁",
    memberCount: 10,
    status: "停用",
  },
];

const BasicSettings: React.FC = () => {
  const { section = "organization-structure" } = useParams<{ section: string }>();
  const [selectedDepartment, setSelectedDepartment] = useState("marketing");
  const [keyword, setKeyword] = useState("");

  const currentSection =
    settingSections[section] || settingSections["organization-structure"];

  const filteredDepartments = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) {
      return departments;
    }

    return departments.filter((department) =>
      [department.name, department.code, department.manager]
        .join(" ")
        .toLowerCase()
        .includes(normalizedKeyword)
    );
  }, [keyword]);

  const isOrganizationPage = section === "organization-structure" || !settingSections[section];

  return (
    <div className="settings-page">
      <div className="settings-page__header">
        <Breadcrumb
          items={[
            { title: "基础设置" },
            { title: currentSection.group },
            { title: currentSection.title },
          ]}
        />
        <div className="settings-page__title-row">
          <div>
            <h1>{currentSection.title}</h1>
            <p>{currentSection.description}</p>
          </div>
          {isOrganizationPage && (
            <Button type="primary" icon={<PlusOutlined />}>
              新增部门
            </Button>
          )}
        </div>
      </div>

      {isOrganizationPage ? (
        <section className="organization-workspace" aria-label="组织架构管理">
          <aside className="organization-tree">
            <div className="panel-heading">
              <div>
                <span className="panel-heading__eyebrow">ORGANIZATION</span>
                <h2>组织目录</h2>
              </div>
              <Button aria-label="新增组织节点" icon={<PlusOutlined />} type="text" />
            </div>
            <Tree
              blockNode
              defaultExpandAll
              treeData={organizationTree}
              showIcon
              selectedKeys={[selectedDepartment]}
              onSelect={(keys) => {
                if (keys[0]) {
                  setSelectedDepartment(String(keys[0]));
                }
              }}
            />
          </aside>

          <div className="organization-content">
            <div className="organization-content__toolbar">
              <div>
                <span className="panel-heading__eyebrow">DEPARTMENT LIST</span>
                <h2>部门列表</h2>
              </div>
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="搜索部门、编码或负责人"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
            </div>

            <div className="organization-summary">
              <div className="summary-item">
                <span className="summary-item__icon summary-item__icon--blue">
                  <ApartmentOutlined />
                </span>
                <span>
                  <small>部门总数</small>
                  <strong>12</strong>
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-item__icon summary-item__icon--green">
                  <TeamOutlined />
                </span>
                <span>
                  <small>成员总数</small>
                  <strong>76</strong>
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-item__icon summary-item__icon--orange">
                  <ApartmentOutlined />
                </span>
                <span>
                  <small>当前节点</small>
                  <strong>
                    {departments.find((department) => department.key === selectedDepartment)?.name ||
                      "KKdw 全屋智能"}
                  </strong>
                </span>
              </div>
            </div>

            <Table<Department>
              columns={[
                {
                  title: "部门名称",
                  dataIndex: "name",
                  key: "name",
                  render: (name: string, record) => (
                    <div className="department-name">
                      <span className="department-name__icon">
                        <ApartmentOutlined />
                      </span>
                      <span>
                        <strong>{name}</strong>
                        <small>{record.code}</small>
                      </span>
                    </div>
                  ),
                },
                { title: "负责人", dataIndex: "manager", key: "manager" },
                { title: "成员数", dataIndex: "memberCount", key: "memberCount" },
                {
                  title: "状态",
                  dataIndex: "status",
                  key: "status",
                  render: (status: Department["status"]) => (
                    <Tag color={status === "启用" ? "success" : "default"}>{status}</Tag>
                  ),
                },
                {
                  title: "操作",
                  key: "action",
                  render: () => (
                    <Button className="table-action" type="link">
                      查看详情
                    </Button>
                  ),
                },
              ]}
              dataSource={filteredDepartments}
              pagination={false}
              rowKey="key"
              size="middle"
            />
          </div>
        </section>
      ) : (
        <section className="settings-placeholder" aria-label={`${currentSection.title}页面`}>
          <span className="settings-placeholder__icon">
            <ApartmentOutlined />
          </span>
          <h2>{currentSection.title}页面已接入</h2>
          <p>页面结构已准备好，等待对应业务接口接入。</p>
        </section>
      )}
    </div>
  );
};

export default BasicSettings;
