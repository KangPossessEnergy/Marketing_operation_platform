import { del, get, patch, post } from "@/utils/http";
import type {
  CreateOrganizationNodeParams,
  OrganizationNode,
  OrganizationTreeResult,
  UpdateOrganizationNodeParams,
} from "./type";

export const OrganizationServices = {
  listTree: () => get<OrganizationTreeResult>("/api/organizations/tree"),
  getById: (id: string) => get<OrganizationNode>(`/api/organizations/${id}`),
  create: (params: CreateOrganizationNodeParams) =>
    post<OrganizationNode>("/api/organizations", params),
  update: (id: string, params: UpdateOrganizationNodeParams) =>
    patch<OrganizationNode>(`/api/organizations/${id}`, params),
  remove: (id: string) => del<void>(`/api/organizations/${id}`),
};

export type {
  CreateOrganizationNodeParams,
  OrganizationNode,
  OrganizationNodeType,
  OrganizationTreeResult,
  UpdateOrganizationNodeParams,
} from "./type";
