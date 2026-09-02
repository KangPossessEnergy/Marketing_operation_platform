import { message } from "antd";

/**
 * 打开toast
 */
export const loadingPop = {
  loading: () => {
    message.loading({ content: "加载中", duration: 0 });
  },
  clear: () => {
    message.destroy();
  },
};
