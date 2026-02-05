/**
 * @description 所有接口服务路径
 */

const service = {
    Login: '/auth/login',// 登录
    Logout: '/auth/logout',// 登出
    Register: '/auth/register',// 注册
    messages: '/chat/messages',// 聊天记录
    sessionList: '/chat/sessionList',// 会话列表
    isRead: '/chat/markRead',// 标记消息是否已读
    friendships: '/friendships/list',// 好友列表
    searchFriends: '/friendships/search',// 搜索好友
    addFriends: '/friendships/add',// 添加好友
} as const;

export type ServiceKey = keyof typeof service;
export type ServicePath = typeof service[ServiceKey];

export default service;
