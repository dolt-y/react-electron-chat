import { LogOut, Settings, User, Users } from "lucide-react";
import instance from "../../../utils/request";
import { useNavigate } from "react-router-dom";
import styles from './sidebar.module.scss';
interface SidebarProps {
    className?: string;
}

export const Sidebar: React.FC<SidebarProps> = () => {
    const navigate = useNavigate();
    const logout = async () => {
        const response = await instance.post('/auth/logout');
        if (response.success) {
            navigate('/');
        }
    }
    return (
        <div className={styles.sidebar}>
            <div className={styles['sidebar-header']}>
                <div className={styles['user-avatar']}>
                    <img src="https://q2.qlogo.cn/headimg_dl?dst_uin=2233296011&spec=100&v=0.5979924341645101" alt="用户头像" />
                </div>
            </div>

            <div className={styles['sidebar-menu']}>
                <button className={`${styles['menu-item']} ${styles.active}`}>
                    <User size={20} />
                </button>
                <button className={styles['menu-item']}>
                    <Users size={20} />
                </button>
                <button className={styles['menu-item']}>
                    <Settings size={20} />
                </button>
            </div>

            <div className={styles['sidebar-footer']}>
                <button className={styles['menu-item']} onClick={logout}>
                    <LogOut size={20} />
                </button>
            </div>
        </div>
    )
}
