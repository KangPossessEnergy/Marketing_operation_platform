export type OrganizationNodeType = "ROOT" | "REGION" | "AGENT" | "STORE";

export interface OrganizationNode {
  id: string;
  parentId: string | null;
  type: OrganizationNodeType;
  name: string;
  code: string;
  contactName: string | null;
  address: string | null;
  contactPhone: string | null;
  region: string | null;
  province: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  depth: number;
  children: OrganizationNode[];
  canCreateChild: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface OrganizationTreeResult {
  items: OrganizationNode[];
  total: number;
}

export interface CreateOrganizationNodeParams {
  parentId?: string;
  name: string;
  code: string;
  contactName?: string;
  address?: string;
  contactPhone?: string;
  region?: string;
  province?: string;
}

export type UpdateOrganizationNodeParams = Partial<
  Omit<CreateOrganizationNodeParams, "parentId">
>;
