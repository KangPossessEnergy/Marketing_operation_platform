import axios, { type AxiosResponse } from "axios";
import { emitter, emitterChannel } from "@/utils/mitt";
import { getToken } from "@/utils/localStorage";
import { redirectToLogin } from "@/utils/auth";

// 只处理常见的code和message
// 业务提示，由业务侧完成，比如创建或编辑失败等
const ErrorHandler = (payload: any = {}) => {
  const { code, data, message } = payload || {};

  switch (code) {
    case 500:
      return {
        code: 500,
        data,
        message: message || "请求失败, 服务端错误",
      };
    default:
      return {
        code,
        data,
        message:message|| "请求失败, 服务端错误",
      };
  }
};

type ErrorResponseData = {
  message?: string | string[];
  data?: {
    message?: string | string[];
  };
};

export const getErrorMessage = (
  error: unknown,
  fallback = "请求失败，请稍后重试"
) => {
  const responseData = axios.isAxiosError(error)
    ? error.response?.data
    : (error as { data?: ErrorResponseData } | undefined)?.data;
  const message =
    (responseData as ErrorResponseData | undefined)?.message ||
    (responseData as ErrorResponseData | undefined)?.data?.message;

  if (Array.isArray(message)) {
    return message.join("；");
  }

  return message || (error as Error | undefined)?.message || fallback;
};

const publishRequestError = (
  error: unknown,
  fallback = "请求失败，请稍后重试"
) => {
  emitter.emit(emitterChannel.requestError, {
    message: getErrorMessage(error, fallback),
    error,
  });
};

const isUnauthorizedError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.status === 401 ||
      Number(error.response?.data?.code) === 401
    );
  }

  const response = error as
    | { status?: number; data?: { code?: number | string } }
    | undefined;
  return response?.status === 401 || Number(response?.data?.code) === 401;
};

const instance = axios.create({
  timeout: 5000,
});

//请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    publishRequestError(error);
    return Promise.reject(error);
  }
);

//响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (isUnauthorizedError(error)) {
      redirectToLogin();
    }

    publishRequestError(error);
    return Promise.reject(error);
  }
);

const httpMethodWrapper = async <T>(
  func: any,
  url: string,
  params?: any
): Promise<AxiosResponse<T>> => {
  const response = await func(url, params);
  const { data } = response;

  // 兼容原有 { code: 200, data } 响应和 Nest 直接返回 2xx JSON 的响应。
  if (response.status >= 200 && response.status < 300 && (!data?.code || data.code === 200)) {
    return response;
  }

  const normalizedError = {
    ...response,
    data: ErrorHandler(data),
  };

  if (isUnauthorizedError(normalizedError)) {
    redirectToLogin();
  }

  publishRequestError(normalizedError);
  return Promise.reject(normalizedError);
};

export const get = <T>(url: string, params?: any) =>
  httpMethodWrapper<T>(instance.get, url, { params });
export const post = <T>(url: string, params?: any) =>
  httpMethodWrapper<T>(instance.post, url, params);
export const patch = <T>(url: string, params?: any) =>
  httpMethodWrapper<T>(instance.patch, url, params);
export const put = <T>(url: string, params?: any) =>
  httpMethodWrapper<T>(instance.put, url, params);
export const del = <T>(url: string, params?: any) =>
  httpMethodWrapper<T>(instance.delete, url, params);
