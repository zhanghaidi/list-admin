import { message } from 'antd';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { fetchRefreshToken } from '@/api/auth';

import storage from './storage';

const baseURL = (window.BASE_URL || import.meta.env.VITE_API_BASE_URL) + '/api/admin';
/*
 * 创建实例
 * 与后端服务通信
 */
const HttpClient = axios.create({
  baseURL: baseURL,
  timeout: 30 * 1000, // 请求超时时间为 30 秒
  timeoutErrorMessage: '请求超时，请稍后再试'
});

/**
 * 请求拦截器
 * 功能：配置请求头
 */
HttpClient.interceptors.request.use(
  (config) => {
    const token = storage.get('x-token');
    if (token) {
      config.headers = config.headers || {}; // 确保 headers 对象存在
      config.headers.token = token;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('网络错误，请稍后重试', error);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 * 功能：处理响应中的异常情况
 */
HttpClient.interceptors.response.use(
  (response) => {
    const data: App.Service.Response = response.data;
    if (response.config.responseType === 'blob') return response;
    // 业务出错
    if (data.code !== 0) {
      message.error(data.msg);
      return Promise.reject(data);
    }
    return data.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 标记请求已重试过
      try {
        // 刷新Token
        const refreshToken = storage.get('refreshToken');
        if (refreshToken) {
          const res = await fetchRefreshToken(refreshToken);
          storage.set('x-token', res.token);
          storage.set('refreshToken', res.refreshToken);

          // 更新请求头中的 Token 并重新发起原始请求
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.token = res.token;

          return HttpClient(originalRequest); // 重新发起原始请求
        }
      } catch (refreshError) {
        message.error('登录过期，请重新登录');
        storage.remove('x-token');
        storage.remove('refreshToken');
        console.error('刷新Token失败', refreshError);
      }
    } else if (error.response?.status === 400) {
      message.error(error.response?.data as string);
    } else {
      message.error(error.message || '网络错误，请稍后重试');
    }
    return Promise.reject(error.message);
  }
);

// 导出请求方法
export default {
  get<T>(url: string, params?: object): Promise<T> {
    return HttpClient.get(url, { params });
  },
  post<T>(url: string, params?: object): Promise<T> {
    return HttpClient.post(url, params);
  }
};
