import { useEffect, useState } from "react";
import { User, Mail, MapPin, Clock } from "lucide-react";
import instance from "../../utils/request";
import styles from "./friendList.module.scss";
import { ResizableSidebar } from "../chat/contact/ResizableSidebar";
interface Friend {
  id: number;
  username: string;
  avatarUrl: string;
  bio: string;
  status: string;
  email?: string;
  location?: string;
  createdAt?: string;
}

export const FriendList: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await instance.get(`/friendships/list?userId=3`);
        if (res.success) {
          const data = (res.result as any[]).map(item => ({
            id: item.friend.id,
            username: item.friend.username,
            avatarUrl: item.friend.avatarUrl,
            bio: item.friend.bio,
            status: item.friend.status,
            email: item.friend.email,
            location: item.friend.location,
            createdAt: item.createdAt
          }));
          setFriends(data);
        } else {
          setError(res.message || "获取好友列表失败");
        }
      } catch (err) {
        setError("网络请求失败");
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, []);

  return (
    <ResizableSidebar>
      <div className={styles.container}>
        <div className={styles.friendList}>
          <div className={styles.header}>好友列表</div>
          {loading ? (
            <div className={styles.state}>加载中...</div>
          ) : error ? (
            <div className={styles.state + " " + styles.error}>{error}</div>
          ) : friends.length === 0 ? (
            <div className={styles.state}>暂无好友</div>
          ) : (
            <ul className={styles.list}>
              {friends.map((friend, index) => (
                <li
                  key={friend.id}
                  className={`${styles.item} ${selectedFriend?.id === friend.id ? styles.active : ''}`}
                  onClick={() => setSelectedFriend(friend)}
                  style={{
                    animation: `slideIn 0.3s ease forwards`,
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  <img
                    src={friend.avatarUrl || "/src/assets/Cat.png"}
                    alt={friend.username}
                    className={styles.avatar}
                  />
                  <div className={styles.info}>
                    <div className={styles.name}>
                      {friend.username}
                      {friend.status === "online" && (
                        <span className={styles.onlineDot} title="在线"></span>
                      )}
                    </div>
                    <div className={styles.bio}>{friend.bio}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.detailPanel}>
          {selectedFriend ? (
            <div className={styles.friendDetail}>
              <div className={styles.detailHeader}>
                <img
                  src={selectedFriend.avatarUrl || "/src/assets/Cat.png"}
                  alt={selectedFriend.username}
                  className={styles.detailAvatar}
                />
                <h2 className={styles.detailName}>
                  {selectedFriend.username}
                  {selectedFriend.status === "online" && (
                    <span className={styles.onlineDot} title="在线"></span>
                  )}
                </h2>
                <p className={styles.detailBio}>{selectedFriend.bio}</p>
              </div>

              <div className={styles.detailInfo}>
                <div className={styles.infoItem}>
                  <User size={16} />
                  <span>用户 ID: {selectedFriend.id}</span>
                </div>
                {selectedFriend.email && (
                  <div className={styles.infoItem}>
                    <Mail size={16} />
                    <span>{selectedFriend.email}</span>
                  </div>
                )}
                {selectedFriend.location && (
                  <div className={styles.infoItem}>
                    <MapPin size={16} />
                    <span>{selectedFriend.location}</span>
                  </div>
                )}
                {selectedFriend.createdAt && (
                  <div className={styles.infoItem}>
                    <Clock size={16} />
                    <span>成为好友时间: {new Date(selectedFriend.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <img src="/src/assets/free.png" alt="选择好友" />
            </div>
          )}
        </div>
      </div>
    </ResizableSidebar>
  );
};