import { useEffect, useMemo, useState } from "react";
import styles from "./list.module.scss";
import instance from "../../utils/request";
import service from "../../service";
import { ResizableSidebar } from "../chat/contact/ResizableSidebar";

export interface Friend {
  id: number;
  username: string;
  avatar?: string | null;
  online?: boolean;
  signature?: string | null;
  email?: string | null;
  location?: string | null;
  createdAt?: string | null;
}

interface FriendListProps {
  currentUserId?: number;
}

export const FriendList: React.FC<FriendListProps> = ({ currentUserId }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);

  useEffect(() => {
    if (!currentUserId) {
      setFriends([]);
      setSelectedFriendId(null);
      return;
    }

    const fetchFriends = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await instance.get(service.friendships, { usrid: currentUserId });
        if (res.success) {
          const listSource = res.result

          const normalized = listSource.map((item: any) => {
            const friend = item?.friend || item;
            return {
              id: friend?.id ?? friend?.userId ?? item?.id ?? 0,
              username: friend?.username || "未知用户",
              avatar: friend?.avatarUrl || null,
              online:friend?.status,
              signature: friend?.bio,
              email: friend?.email,
              phone: friend?.phone,
              createdAt: friend?.createdAt
            };
          });

          setFriends(normalized);
          setSelectedFriendId((prev) => {
            if (!normalized.length) return null;
            if (prev && normalized.some((n: { id: number; }) => n.id === prev)) {
              return prev;
            }
            return normalized[0].id;
          });
        } else {
          setError(res.message || "获取通讯录失败");
          setFriends([]);
          setSelectedFriendId(null);
        }
      } catch (err) {
        setError("通讯录接口异常");
        setFriends([]);
        setSelectedFriendId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [currentUserId]);

  const filtered = useMemo(
    () => friends.filter((f) => f.username.toLowerCase().includes(search.toLowerCase())),
    [friends, search]
  );

  useEffect(() => {
    if (!filtered.length) {
      setSelectedFriendId(null);
      return;
    }
    setSelectedFriendId((prev) => {
      if (prev && filtered.some((f) => f.id === prev)) return prev;
      return filtered[0].id;
    });
  }, [filtered]);

  const activeFriend = useMemo(() => {
    if (!selectedFriendId) return null;
    return filtered.find((f) => f.id === selectedFriendId) || null;
  }, [filtered, selectedFriendId]);

  const subtitle = currentUserId ? `共有 ${friends.length} 位好友` : "请先登录查看通讯录";

  const renderState = (message: string) => (
    <div className={styles.state}>
      <p>{message}</p>
    </div>
  );

  const renderList = () => {
    if (!currentUserId) return renderState("登录后即可查看通讯录");
    if (loading) return renderState("加载中...");
    if (error) return renderState(error);
    if (filtered.length === 0) return renderState("暂无好友或无匹配结果");

    return (
      <div className={styles.list}>
        {filtered.map((friend) => (
          <div
            key={friend.id}
            className={`${styles.item} ${selectedFriendId === friend.id ? styles.active : ""}`}
            onClick={() => setSelectedFriendId(friend.id)}
          >
            <div className={styles.avatarWrap}>
              <img src={friend.avatar || "/placeholder.svg"} className={styles.avatar} />
              <span className={`${styles.statusDot} ${friend.online ? styles.online : styles.offline}`} />
            </div>
            <div className={styles.content}>
              <div className={styles.contentHeader}>
                <span className={styles.name}>{friend.username}</span>
                <span className={styles.status}>{friend.online ? "在线" : "离线"}</span>
              </div>
              <p className={styles.signature}>{friend.signature || "这位好友还没有签名~"}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDetail = () => {
    if (!currentUserId) return <div className={styles.detailEmpty} />;
    if (!activeFriend) return <div className={styles.detailEmpty} />;

    return (
      <div className={styles.detailCard}>
        <div className={styles.detailHeader}>
          <img src={activeFriend.avatar || "/placeholder.svg"} className={styles.detailAvatar} />
          <div className={styles.detailInfo}>
            <div className={styles.detailName}>
              {activeFriend.username}
              <span className={styles.detailStatus}>{activeFriend.online ? "在线" : "离线"}</span>
            </div>
            <p className={styles.detailSignature}>{activeFriend.signature || "这位好友还没有签名~"}</p>
          </div>
        </div>
        <div className={styles.detailMeta}>
          <div>
            <span className={styles.metaLabel}>好友 ID</span>
            <span className={styles.metaValue}>#{activeFriend.id}</span>
          </div>
          {activeFriend.email && (
            <div>
              <span className={styles.metaLabel}>邮箱</span>
              <span className={styles.metaValue}>{activeFriend.email}</span>
            </div>
          )}
          {activeFriend.location && (
            <div>
              <span className={styles.metaLabel}>地区</span>
              <span className={styles.metaValue}>{activeFriend.location}</span>
            </div>
          )}
          {activeFriend.createdAt && (
            <div>
              <span className={styles.metaLabel}>成为好友时间</span>
              <span className={styles.metaValue}>
                {new Date(activeFriend.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <ResizableSidebar className={styles.sidebar}>
        <div className={styles.sidebarInner}>
          <div className={styles.header}>
            <div className={styles.titleRow}>
              <h3>通讯录</h3>
              <span>{subtitle}</span>
            </div>
            <div className={styles.searchBox}>
              <input
                placeholder="搜索好友"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={!currentUserId}
              />
            </div>
          </div>
          <div className={styles.body}>{renderList()}</div>
        </div>
      </ResizableSidebar>

      <div className={styles.detailPane}>{renderDetail()}</div>
    </div>
  );
};

export default FriendList;
