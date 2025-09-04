import { message } from 'antd';

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

const request = async (config: any) => {
    showLoading();
    try {
        const tokenName = localStorage.getItem('tokenName');
        const tokenValue = localStorage.getItem('tokenValue');
        if (tokenName && tokenValue) {
            config.headers = config.headers || {};
            config.headers[tokenName] = tokenValue;
        }

        const res = await window.electronAPI.request(config);

        closeLoading();

        if (res.success) {
            message.success(res.data?.message || '请求成功');
            return res.data;
        } else {
            message.error(res.message || '异常请求');
            return Promise.reject(res);
        }
    } catch (err) {
        closeLoading();
        message.error('系统错误，请联系管理员');
        return Promise.reject(err);
    }
};

export const instance = {
    get: (url: string, params?: any) => request({ method: 'GET', url, params }),
    post: (url: string, data?: any) => request({ method: 'POST', url, data }),
    put: (url: string, data?: any) => request({ method: 'PUT', url, data }),
    delete: (url: string) => request({ method: 'DELETE', url }),
};
export default instance;
