//写工具函数

/**
 * 获取url中"?"符后的字串
 */
export function getUrlParams() {
  const url = location.search;
  const theRequest: Record<any, any> = new Object();
  if (url.indexOf("?") != -1) {
    const str = url.substr(1);
    const strs = str.split("&");
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = decodeURIComponent(
        strs[i].split("=")[1]
      );
    }
  }
  return theRequest;
}

/**
 * 生成唯一32位guid
 * @returns 
 */
export function guid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
}
