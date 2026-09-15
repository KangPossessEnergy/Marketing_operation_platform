import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ApartmentOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  ShopOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Empty,
  Input,
  Modal,
  Spin,
  Tag,
  Tree,
} from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";
import { useParams } from "umi";
import PageBreadcrumb from "@/components/Common/PageBreadcrumb";
import { OrganizationServices } from "@/services/Organization";
import type {
  CreateOrganizationNodeParams,
  OrganizationNode,
  OrganizationNodeType,
  UpdateOrganizationNodeParams,
} from "@/services/Organization";
import { publishSuccess } from "@/utils/mitt";
import UserManagement from "./components/UserManagement";
import OrganizationFormModal from "./components/OrganizationFormModal";
import "./index.less";

type SettingSection = {
  title: string;
  group: string;
  description: string;
};

const settingSections: Record<string, SettingSection> = {
  "organization-structure": {
    title: "组织架构",
    group: "组织管理",
    description: "维护平台、区域、一级代理商与门店的归属关系。",
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

const nodeTypeLabels: Record<OrganizationNodeType, string> = {
  ROOT: "平台",
  REGION: "区域",
  AGENT: "一级代理商",
  STORE: "门店",
};

const nodeIcons: Record<OrganizationNodeType, React.ReactNode> = {
  ROOT: <ApartmentOutlined />,
  REGION: <ApartmentOutlined />,
  AGENT: <TeamOutlined />,
  STORE: <ShopOutlined />,
};

const flattenNodes = (nodes: OrganizationNode[]): OrganizationNode[] =>
  nodes.flatMap((node) => [node, ...flattenNodes(node.children)]);

const filterTree = (
  nodes: OrganizationNode[],
  keyword: string
): OrganizationNode[] =>
  nodes.reduce<OrganizationNode[]>((matchedNodes, node) => {
    const matches = [node.name, node.code, node.contactName, node.address]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(keyword);
    const children = filterTree(node.children, keyword);

    if (matches || children.length) {
      matchedNodes.push({ ...node, children });
    }

    return matchedNodes;
  }, []);

const getChildType = (type: OrganizationNodeType): OrganizationNodeType => {
  if (type === "ROOT") return "REGION";
  if (type === "REGION") return "AGENT";
  return "STORE";
};

const BasicSettings: React.FC = () => {
  const { section = "organization-structure" } = useParams<{ section: string }>();
  const [treeData, setTreeData] = useState<OrganizationNode[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formNode, setFormNode] = useState<OrganizationNode>();
  const [formParent, setFormParent] = useState<OrganizationNode>();

  const currentSection =
    settingSections[section] || settingSections["organization-structure"];
  const isOrganizationPage =
    section === "organization-structure" || !settingSections[section];
  const isAccountPage = section === "account-information";
  const allNodes = useMemo(() => flattenNodes(treeData), [treeData]);
  const selectedNode = allNodes.find((node) => node.id === selectedId);
  const filteredTreeData = useMemo(
    () => filterTree(treeData, searchKeyword.trim().toLowerCase()),
    [searchKeyword, treeData]
  );

  const loadTree = useCallback(async (preferredId?: string) => {
    setLoading(true);
    try {
      const { data } = await OrganizationServices.listTree();
      setTreeData(data.items);
      setExpandedKeys((currentKeys) =>
        currentKeys.length
          ? currentKeys
          : flattenNodes(data.items)
              .filter((node) => node.children.length)
              .map((node) => node.id)
      );
      const nextSelectedId =
        preferredId && flattenNodes(data.items).some((node) => node.id === preferredId)
          ? preferredId
          : data.items[0]?.id;
      setSelectedId(nextSelectedId);
    } catch {
      setTreeData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOrganizationPage) {
      void loadTree();
    }
  }, [isOrganizationPage, loadTree]);

  const openCreate = (parent?: OrganizationNode) => {
    setFormMode("create");
    setFormNode(undefined);
    setFormParent(parent);
    setFormOpen(true);
  };

  const openEdit = async (node: OrganizationNode) => {
    try {
      const { data } = await OrganizationServices.getById(node.id);
      setFormMode("edit");
      setFormNode(data);
      setFormParent(undefined);
      setFormOpen(true);
    } catch {
      // 请求错误由全局监听器统一提示。
    }
  };

  const removeNode = (node: OrganizationNode) => {
    Modal.confirm({
      title: `确认删除${nodeTypeLabels[node.type]}？`,
      content: `删除“${node.name}”后将无法恢复，请确认该节点没有下级组织。`,
      okText: "确认删除",
      cancelText: "取消",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await OrganizationServices.remove(node.id);
          publishSuccess(`“${node.name}”已删除`);
          await loadTree(node.parentId ?? undefined);
        } catch {
          // 请求错误由全局监听器统一提示。
        }
      },
    });
  };

  const handleFormSubmit = async (
    values: CreateOrganizationNodeParams | UpdateOrganizationNodeParams
  ) => {
    try {
      if (formMode === "edit" && formNode) {
        await OrganizationServices.update(formNode.id, values);
        publishSuccess("组织信息已更新");
        setFormOpen(false);
        await loadTree(formNode.id);
      } else {
        const params = {
          ...values,
          ...(formParent ? { parentId: formParent.id } : {}),
        } as CreateOrganizationNodeParams;
        const { data } = await OrganizationServices.create(params);
        publishSuccess(`“${data.name}”已创建`);
        setFormOpen(false);
        await loadTree(data.id);
      }
      return true;
    } catch {
      return false;
    }
  };

  const buildTreeData = (nodes: OrganizationNode[]): DataNode[] =>
    nodes.map((node) => ({
      key: node.id,
      title: (
        <div className="organization-node">
          <span className="organization-node__name">
            <span className="organization-node__icon">{nodeIcons[node.type]}</span>
            <span>{node.name}</span>
            <Tag className="organization-node__tag" bordered={false}>
              {nodeTypeLabels[node.type]}
            </Tag>
          </span>
          {(node.canCreateChild || node.canEdit || node.canDelete) && (
            <Dropdown
              menu={{
                items: [
                  ...(node.canCreateChild
                    ? [
                        {
                          key: "create",
                          icon: <PlusOutlined />,
                          label: `新增${nodeTypeLabels[getChildType(node.type)]}`,
                        },
                      ]
                    : []),
                  ...(node.canEdit
                    ? [{ key: "edit", icon: <EditOutlined />, label: "编辑节点" }]
                    : []),
                  ...(node.canDelete
                    ? [
                        {
                          key: "delete",
                          danger: true,
                          icon: <DeleteOutlined />,
                          label: "删除节点",
                        },
                      ]
                    : []),
                ],
                onClick: ({ key }) => {
                  if (key === "create") openCreate(node);
                  if (key === "edit") void openEdit(node);
                  if (key === "delete") removeNode(node);
                },
              }}
              trigger={["click"]}
            >
              <Button
                aria-label={`操作${node.name}`}
                className="organization-node__actions"
                icon={<MoreOutlined />}
                onClick={(event) => event.stopPropagation()}
                title={`操作${node.name}`}
                type="text"
              />
            </Dropdown>
          )}
        </div>
      ),
      children: node.children.length ? buildTreeData(node.children) : undefined,
    }));

  const handleSelect: TreeProps["onSelect"] = (keys) => {
    const nextId = String(keys[0] || "");
    if (nextId) {
      setSelectedId(nextId);
    }
  };

  const renderOrganization = () => (
    <section className="organization-workspace" aria-label="组织架构管理">
      <aside className="organization-tree">
        <div className="panel-heading">
          <div>
            <span className="panel-heading__eyebrow">ORGANIZATION</span>
            <h2>组织目录</h2>
          </div>
          <Button
            aria-label="刷新组织树"
            icon={<ReloadOutlined />}
            loading={loading}
            onClick={() => void loadTree(selectedId)}
            title="刷新组织树"
            type="text"
          />
        </div>
        <Input
          allowClear
          className="organization-tree__search"
          prefix={<SearchOutlined />}
          placeholder="搜索名称、编码或联系人"
          value={searchKeyword}
          onChange={(event) => setSearchKeyword(event.target.value)}
        />
        <Spin spinning={loading}>
          {filteredTreeData.length ? (
            <Tree
              blockNode
              expandedKeys={searchKeyword ? allNodes.map((node) => node.id) : expandedKeys}
              onExpand={setExpandedKeys}
              onSelect={handleSelect}
              selectedKeys={selectedId ? [selectedId] : []}
              treeData={buildTreeData(filteredTreeData)}
            />
          ) : (
            <Empty
              className="organization-tree__empty"
              description={searchKeyword ? "没有匹配的组织节点" : "暂无组织节点"}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              {!searchKeyword && (
                <Button icon={<PlusOutlined />} onClick={() => openCreate()} type="primary">
                  新增平台
                </Button>
              )}
            </Empty>
          )}
        </Spin>
      </aside>

      <div className="organization-content">
        {selectedNode ? (
          <>
            <div className="organization-detail__header">
              <div>
                <span className="panel-heading__eyebrow">ORGANIZATION DETAIL</span>
                <h2>{selectedNode.name}</h2>
                <Tag color="blue">{nodeTypeLabels[selectedNode.type]}</Tag>
              </div>
              <div className="organization-detail__actions">
                {selectedNode.canCreateChild && (
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => openCreate(selectedNode)}
                    type="primary"
                  >
                    新增下级
                  </Button>
                )}
                {selectedNode.canEdit && (
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => void openEdit(selectedNode)}
                  >
                    编辑
                  </Button>
                )}
              </div>
            </div>
            <div className="organization-detail__body">
              <div className="organization-detail__hero">
                <span className="organization-detail__hero-icon">
                  {nodeIcons[selectedNode.type]}
                </span>
                <div>
                  <strong>{selectedNode.name}</strong>
                  <span>{selectedNode.code}</span>
                </div>
              </div>
              <dl className="organization-detail__fields">
                <DetailField label="编码" value={selectedNode.code} />
                <DetailField label="联系人" value={selectedNode.contactName} />
                <DetailField label="联系电话" value={selectedNode.contactPhone} />
                <DetailField label="地址" value={selectedNode.address} />
                <DetailField label="区域" value={selectedNode.region} />
                <DetailField label="省份" value={selectedNode.province} />
                <DetailField
                  label="下级节点"
                  value={`${selectedNode.children.length} 个`}
                />
                <DetailField label="层级" value={`第 ${selectedNode.depth} 级`} />
              </dl>
            </div>
          </>
        ) : (
          <Empty description="请选择一个组织节点" />
        )}
      </div>

      <OrganizationFormModal
        initialValues={formNode}
        mode={formMode}
        onFinish={handleFormSubmit}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setFormNode(undefined);
            setFormParent(undefined);
          }
        }}
        open={formOpen}
        parent={formParent}
      />
    </section>
  );

  return (
    <div className="settings-page">
      <div className="settings-page__header">
        <PageBreadcrumb
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
          {isOrganizationPage && !treeData.length && (
            <Button
              icon={<PlusOutlined />}
              onClick={() => openCreate()}
              type="primary"
            >
              新增平台
            </Button>
          )}
        </div>
      </div>

      {isOrganizationPage ? (
        renderOrganization()
      ) : isAccountPage ? (
        <UserManagement />
      ) : (
        <section
          className="settings-placeholder"
          aria-label={`${currentSection.title}页面`}
        >
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

const DetailField: React.FC<{ label: string; value?: string | null }> = ({
  label,
  value,
}) => (
  <div>
    <dt>{label}</dt>
    <dd>{value || "-"}</dd>
  </div>
);

export default BasicSettings;
