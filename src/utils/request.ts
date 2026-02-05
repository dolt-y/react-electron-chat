import { message } from 'antd';
import { getAuthToken } from './auth';
import type { ApiEnvelope, ApiResponse, RequestConfig } from '../shared/api/types';

let loadingCount = 0;
let hideLoading: (() => void) | null = null;

const showLoading = () => {
    if (loadingCount === 0) {
        hideLoading = message.loading('Loading...', 0);
    }
    loadingCount++;
};

const closeLoading = () => {
    loadingCount--;
    if (loadingCount <= 0) {
        loadingCount = 0;
        if (hideLoading) hideLoading();
    }
};

const unwrapResponse = <T>(payload: ApiResponse<T> | ApiEnvelope<T>): ApiResponse<T> => {
    if (payload && typeof payload === "object" && "data" in payload) {
        return payload.data;
    }
    return payload as ApiResponse<T>;
};

const request = async <T>(config: RequestConfig): Promise<ApiResponse<T>> => {
    showLoading();
    try {
        const token = getAuthToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        const payload = await window.electronAPI.request<T>(config);
        const res = unwrapResponse<T>(payload);

        if (res.success) {
            console.log("当前接口", config.url, res);
            return res;
        }
        message.error(res.message || '异常请求');
        return Promise.reject(res);
    } catch (err) {
        message.error('系统错误，请联系管理员');
        return Promise.reject(err);
    } finally {
        closeLoading();
    }
};

export const instance = {
    get: <T, P = Record<string, unknown>>(url: string, params?: P) =>
        request<T>({ method: 'GET', url, params }),
    post: <T, D = unknown>(url: string, data?: D) =>
        request<T>({ method: 'POST', url, data }),
    put: <T, D = unknown>(url: string, data?: D) =>
        request<T>({ method: 'PUT', url, data }),
    delete: <T>(url: string) => request<T>({ method: 'DELETE', url }),
};
export default instance;
