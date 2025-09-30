// utils.ts
export default {
    /**
     * 防抖函数
     * @param func 要执行的函数
     * @param wait 延迟时间
     */
    debounce: function <T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
        let timeout: NodeJS.Timeout | undefined; // 定义定时器类型
        return (...args: Parameters<T>) => {
            const context = this;
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    },

    /**
     * 节流函数
     * @param func 要执行的函数
     * @param wait 时间间隔
     */
    throttle: function <T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
        let timeout: NodeJS.Timeout | undefined; // 定义定时器类型
        let firstInvoked = true; // 是否为第一次执行
        return (...args: Parameters<T>) => {
            const context = this;
            if (firstInvoked) {
                func.apply(context, args);
                firstInvoked = false;
                return;
            }
            if (timeout) {
                return; // 如果有定时器，则返回
            }
            timeout = setTimeout(() => {
                func.apply(context, args);
                timeout = undefined; // 清空定时器
            }, wait);
        };
    },

    /**
     * 深拷贝
     * @param obj 要深拷贝的对象
     */
    // deepCopy: function <T>(obj: T): T {
    //     if (typeof obj !== 'object' || obj === null) {
    //         return obj;
    //     }
    //     if (obj instanceof Date) {
    //         return new Date(obj) as T;
    //     }
    //     if (obj instanceof RegExp) {
    //         return new RegExp(obj) as T;
    //     }
    //     if (Array.isArray(obj)) {
    //         return obj.map(item => this.deepCopy(item)) as unknown as T; // 类型断言
    //     }
    //     const result: { [key: string]: T } = {}; // 使用更具体的类型
    //     for (const key in obj) {
    //         if (Object.prototype.hasOwnProperty.call(obj, key)) {
    //             result[key] = this.deepCopy(obj[key]);
    //         }
    //     }
    //     return result as T;
    // },

    /**
     * 判断设备
     */
    isMobile: function (): boolean {
        const ua = navigator.userAgent;
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    }
};