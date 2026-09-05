import { post } from "@/utils/http";
import type { LoginParams, LoginResult } from "./type";

export const LoginServices = {
  loginAPi: (params: LoginParams) => post<LoginResult>("/api/auth/login", params),
};

export type { LoginParams, LoginResult, LoginUser } from "./type";
