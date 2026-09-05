export const getToken = () => {
  return localStorage.getItem("token") || "";
};

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const clearToken = () => {
  localStorage.removeItem("token");
};

export const getUserInfo = () => {
  return JSON.parse(localStorage.getItem("userInfo") || "{}");
};

export const setUserInfo = (userInfo:any) => {
  localStorage.setItem("userInfo", JSON.stringify(userInfo));
};

export const clearUserInfo = () => {
  localStorage.removeItem("userInfo");
};

export const getUserRole = () => {
  return localStorage.getItem("role");
};

export const setUserRole = (role: string) => {
  localStorage.setItem("role", role);
};

export const clearUserRole = () => {
  localStorage.removeItem("role");
};

export const clearAll = () => {
  clearToken();
  clearUserInfo();
  clearUserRole();
};
