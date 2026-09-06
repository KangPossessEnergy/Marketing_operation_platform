import { post } from "@/utils/http";
import type {
  LoginParams,
  LoginResult,
  LogoutResult,
  RegisterParams,
  RegisterResult,
} from "./type";

export const LoginServices = {
  loginAPi: (params: LoginParams) => post<LoginResult>("/api/auth/login", params),
  registerApi: (params: RegisterParams) =>
    post<RegisterResult>("/api/auth/register", params),
  logoutApi: () => post<LogoutResult>("/api/auth/logout"),
};

export type {
  LoginParams,
  LoginResult,
  LoginUser,
  LogoutResult,
  RegisterParams,
  RegisterResult,
} from "./type";
