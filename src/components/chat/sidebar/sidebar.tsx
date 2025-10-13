/*
 * @Description: 
 * @Author: wen.yao
 * @LastEditTime: 2025-09-30 17:04:47
 */
import { LogOut, MessageSquare, Settings, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import instance from "../../../utils/request";
import styles from './sidebar.module.scss';
interface SidebarProps {
    className?: string;
    activeTab?: string;
    onChangeTab?: (tab: "messages" | "friends") => void;
}

export const Sidebar: React.FC <SidebarProps> = ({ className, activeTab, onChangeTab }) => {
    const navigate = useNavigate();

    const menuItems = [
        { icon: MessageSquare, label: '消息', tab: 'messages' },
        { icon: Users, label: '好友', tab: 'friends' },
        { icon: Settings, label: '设置', path: '/settings' },
    ];

    const logout = async () => {
        if (!confirm("确定退出登录吗？")) return;
        try {
            const response = await instance.post('/auth/logout');
            if (response.success) navigate('/');
            else alert(response.message || "退出失败");
        } catch (err) {
            console.error(err);
            alert("退出请求失败");
        }
    };

    return (
        <div className={`${styles.sidebar} ${className || ""}`}>
            {/* 头像区域 */}
            <div className={styles['sidebar-header']}>
                <div
                    className={styles['user-avatar']}
                    onClick={() => navigate('/profile')}
                    title="个人资料"
                >
                    <img
                        src="https://q2.qlogo.cn/headimg_dl?dst_uin=2233296011&spec=100&v=0.5979924341645101"
                        alt="用户头像"
                    />
                </div>
            </div>

            {/* 菜单区域 */}
            <div className={styles['sidebar-menu']}>
                {menuItems.map(item => {
                    const Icon = item.icon;
                    const isActiveMenu = activeTab === item.tab;
                    return (
                        <button
                            key={item.label}
                            className={`${styles['menu-item']} ${isActiveMenu ? styles.active : ''}`}
                            onClick={() => {
                                if (item.tab && onChangeTab) onChangeTab(item.tab);
                                else if (item.path) navigate(item.path);
                            }}
                            title={item.label}
                        >
                            <Icon size={20} />
                            <span className={styles['menu-label']}>{item.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* 底部退出按钮 */}
            <div className={styles['sidebar-footer']}>
                <button className={styles['menu-item']} onClick={logout} title="退出登录">
                    <LogOut size={20} />
                </button>
            </div>
        </div>
    );
};
