import axios from "axios";

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
    return Promise.resolve(error);
  }
);

const httpMethodWrapper = async (func: any, url: any, params?: any) => {
  const response = await func(url, params);
  const { data } = response;
  if (data.code === 200) {
    return response;
  } else {
    return Promise.reject({
      ...response,
      data: ErrorHandler(data)
    });
  }
};

export const get = async (url: string, params?: any) => httpMethodWrapper(instance.get, url, { params });
export const post = async (url: string, params?: any) => httpMethodWrapper(instance.post, url, params);
export const put = async (url: string, params?: any) => httpMethodWrapper(instance.put, url, params);
export const del = async (url: string, params?: any) => httpMethodWrapper(instance.delete, url, params);