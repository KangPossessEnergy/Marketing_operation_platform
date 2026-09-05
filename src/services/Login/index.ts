import { post } from "@/utils/http";
import type { LoginParams, LoginResult, LogoutResult } from "./type";

export const LoginServices = {
  loginAPi: (params: LoginParams) => post<LoginResult>("/api/auth/login", params),
  logoutApi: () => post<LogoutResult>("/api/auth/logout"),
};

export type { LoginParams, LoginResult, LoginUser, LogoutResult } from "./type";
