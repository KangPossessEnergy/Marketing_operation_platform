import type { AccountUser } from "@/services/UserManagement";

export type UserSearchValues = {
  keyword?: string;
  username?: string;
  phone?: string;
  roleName?: string;
  storeName?: string;
  firstAgent?: string;
  secondAgent?: string;
};

export type UserFormValues = {
  username?: string;
  phone?: string;
  password?: string;
};

export type UserListRequestParams = {
  current?: number;
  pageSize?: number;
};

export type UserListRequestResult = {
  data: AccountUser[];
  success: boolean;
  total: number;
};
