// utils/time.ts

interface FormatOptions {
    withSeconds?: boolean; // 是否显示秒
}

export const formatMessageTime = (
    timeStr: string,
    options: FormatOptions = {}
): string => {
    const { withSeconds = true } = options;

    const date = new Date(timeStr);
    if (isNaN(date.getTime())) return timeStr || "";

    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    // 时间格式（是否带秒）
    const timeFormat: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
    };
    if (withSeconds) {
        timeFormat.second = "2-digit";
    }

    if (isToday) {
        return date.toLocaleTimeString("zh-CN", timeFormat);
    }

    if (isYesterday) {
        return "昨天 " + date.toLocaleTimeString("zh-CN", timeFormat);
    }

    const isSameYear = date.getFullYear() === now.getFullYear();

    if (isSameYear) {
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");

        return `${month}-${day} ${date.toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    }

    return date.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};
