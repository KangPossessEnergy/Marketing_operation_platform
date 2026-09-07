import type {
  AccountUser,
  QueryAccountsParams,
} from "@/services/UserManagement";
import type { UserSearchValues } from "./types";

export const defaultPageSize = 8;

export const normalizeValue = (value?: string) => value?.trim() || "";

export const displayValue = (value?: string | null) => value?.trim() || "-";

export const formatDateTime = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
};

export const toQueryParams = (
  filters: UserSearchValues,
  page: number,
  pageSize: number
): QueryAccountsParams => {
  const username = normalizeValue(filters.username);
  const phone = normalizeValue(filters.phone);
  const roleName = normalizeValue(filters.roleName);
  const storeName = normalizeValue(filters.storeName);
  const firstAgent = normalizeValue(filters.firstAgent);
  const secondAgent = normalizeValue(filters.secondAgent);


  return {
    page,
    pageSize,
    ...(username ? { username } : {}),
    ...(phone ? { phone } : {}),
    ...(roleName ? { roleName } : {}),
    ...(storeName ? { storeName } : {}),
    ...(firstAgent ? { firstAgent } : {}),
    ...(secondAgent ? { secondAgent } : {}),
  };
};

const escapeCsvValue = (value: unknown) =>
  `"${String(value ?? "").replace(/"/g, '""')}"`;

const getNow = () => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
    now.getSeconds()
  )}`;
};

export const downloadUsersCsv = (users: AccountUser[]) => {
  const header = [
    "用户名称",
    "手机号码",
    "手机号验证状态",
    "创建时间",
    "更新时间",
  ];
  const rows = users.map((user) => [
    displayValue(user.username),
    displayValue(user.phone),
    user.phoneVerifiedAt ? "已验证" : "未验证",
    formatDateTime(user.createdAt),
    formatDateTime(user.updatedAt),
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");
  const blob = new Blob([`\ufeff${csv}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `用户列表-${getNow().replace(/[: ]/g, "-")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
