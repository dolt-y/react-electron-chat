import { useEffect, useState } from "react";
import styles from "./list.module.scss";
import instance from "../../utils/request";

interface Friend {
  id: number;
  username: string;
  avatar?: string | null;
  online?: boolean;
  signature?: string | null;
}

export function FriendList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await instance.get("/friendships/list", { userId: 1 });
        if (res.success) setFriends(res.result || []);
      } catch (e) {
        // 忽略错误，UI 仍可展示
      }
    };
    fetchFriends();
  }, []);

  const filtered = friends.filter((f) =>
    f.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <input
          className={styles.search}
          placeholder="搜索好友"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className={styles.list}>
        {filtered.map((f) => (
          <div className={styles.item} key={f.id}>
            <img
              className={styles.avatar}
              src={f.avatar || "/placeholder.svg"}
              alt={f.username}
            />
            <div className={styles.meta}>
              <div className={styles.nameRow}>
                <span className={styles.name}>{f.username}</span>
                {f.online ? (
                  <span className={styles.online}>在线</span>
                ) : (
                  <span className={styles.offline}>离线</span>
                )}
              </div>
              {f.signature && <div className={styles.signature}>{f.signature}</div>}
            </div>
            <div className={styles.actions}>
              <button className={styles.primary}>发消息</button>
              <button className={styles.secondary}>删除</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className={styles.empty}>暂无好友或无匹配结果</div>
        )}
      </div>
    </div>
  );
}

export default FriendList;


