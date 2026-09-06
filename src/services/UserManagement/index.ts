import { del, get, patch, post } from "@/utils/http";
import type {
  AccountListResult,
  AccountUser,
  CreateAccountParams,
  QueryAccountsParams,
  UpdateAccountParams,
} from "./type";

export const UserManagementServices = {
  list: (params?: QueryAccountsParams) =>
    get<AccountListResult>("/api/users", params),
  getById: (id: string) => get<AccountUser>(`/api/users/${id}`),
  create: (params: CreateAccountParams) =>
    post<AccountUser>("/api/users", params),
  update: (id: string, params: UpdateAccountParams) =>
    patch<AccountUser>(`/api/users/${id}`, params),
  remove: (id: string) => del<void>(`/api/users/${id}`),
};

export type {
  AccountListResult,
  AccountUser,
  CreateAccountParams,
  QueryAccountsParams,
  UpdateAccountParams,
} from "./type";
