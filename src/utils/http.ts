import axios, { type AxiosResponse } from "axios";

// 只处理常见的code和message
// 业务提示，由业务侧完成，比如创建或编辑失败等
const ErrorHandler = ({ code, data, message }: any) => {
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

const instance = axios.create({
  timeout: 5000,
});

//请求拦截器
instance.interceptors.request.use(
  (config) => {
    // config.headers.token = getToken();

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
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

  return Promise.reject({
    ...response,
    data: ErrorHandler(data),
  });
};

export const get = <T>(url: string, params?: any) =>
  httpMethodWrapper<T>(instance.get, url, { params });
export const post = <T>(url: string, params?: any) =>
  httpMethodWrapper<T>(instance.post, url, params);
export const put = <T>(url: string, params?: any) =>
  httpMethodWrapper<T>(instance.put, url, params);
export const del = <T>(url: string, params?: any) =>
  httpMethodWrapper<T>(instance.delete, url, params);
