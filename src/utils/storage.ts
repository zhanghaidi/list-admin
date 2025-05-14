/**
 * localStorage模块封装（自动根据项目名生成命名空间）
 */

const namespace = (() => {
  // 根据项目名称或域名生成命名空间
  if (document.title) {
    return document.title.trim().replace(/\s+/g, '_').toLowerCase(); // 使用标题作为命名空间
  }
  return window.location.hostname.replace(/\./g, '_'); // 或者使用域名
})();

export default {
  /**
   * 生成带命名空间的键名
   * @param key {string} 原始键名
   * @returns {string} 带命名空间的键名
   */
  getKey(key: string): string {
    return `${namespace}:${key}`;
  },

  /**
   * 存储值
   * @param key {string} 键名
   * @param value {any} 值
   */
  set<T>(key: string, value: T) {
    localStorage.setItem(this.getKey(key), JSON.stringify(value));
  },

  /**
   * 获取值
   * @param key {string} 键名
   * @returns {any} 存储的值
   */
  get(key: string): any {
    const value = localStorage.getItem(this.getKey(key));
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },

  /**
   * 删除指定键的值
   * @param key {string} 键名
   */
  remove(key: string) {
    localStorage.removeItem(this.getKey(key));
  },

  /**
   * 清空当前命名空间下的所有存储
   */
  clear() {
    const keys = Object.keys(localStorage).filter((key) => key.startsWith(`${namespace}:`));
    keys.forEach((key) => localStorage.removeItem(key));
  }
};
