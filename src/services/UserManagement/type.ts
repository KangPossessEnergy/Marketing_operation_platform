export interface AccountUser {
  id: string;
  username: string | null;
  phone: string | null;
  phoneVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface QueryAccountsParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  username?: string;
  phone?: string;
  roleName?: string;
  storeName?: string;
  firstAgent?: string;
  secondAgent?: string;
}

export interface AccountListResult {
  items: AccountUser[];
  page: number;
  pageSize: number;
  total: number;
}

export interface CreateAccountParams {
  username?: string;
  phone?: string;
  password?: string;
}

export interface UpdateAccountParams {
  phone?: string;
}
