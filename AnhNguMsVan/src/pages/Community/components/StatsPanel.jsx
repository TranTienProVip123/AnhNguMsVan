import React, { useState, useEffect } from "react";
import { FiFeather, FiMessageCircle, FiThumbsUp } from "react-icons/fi";
import "../styles/StatsPanel.css";
import "../styles/CommunityLayout.css"

export const StatsPanel = ({ fetchStats }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ postsCount: 0, commentsCount: 0, likesCount: 0 });
  useEffect(() => {
    if (!fetchStats) return;
    setLoading(true);
    setError("");
    fetchStats()
      .then((data) => setStats(data || { postsCount: 0, commentsCount: 0, likesCount: 0 }))
      .catch(() => setError("Không lấy được thống kê."))
      .finally(() => setLoading(false));
  }, [fetchStats]);

  if (loading) {
    return (
      <aside className="community-stats">
        <h4>THỐNG KÊ CỦA TÔI</h4>
        <div className="stats-card">
          <div className="inline-hint">Đang tải thống kê...</div>
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="community-stats">
        <h4>THỐNG KÊ CỦA TÔI</h4>
        <div className="stats-card">
          <div className="inline-error">{error}</div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="community-stats">
      <h4>THỐNG KÊ CỦA TÔI</h4>

      <div className="stats-card">
        <div className="stat-row">
          <span className="stat-label">
            <span className="stat-icon">
              <FiFeather />
            </span>
            Bài viết đã tạo
          </span>
          <strong>{stats.postsCount ?? 0}</strong>
        </div>

        <div className="stat-row">
          <span className="stat-label">
            <span className="stat-icon">
              <FiMessageCircle />
            </span>
            Bình luận đã tạo
          </span>
          <strong>{stats.commentsCount ?? 0}</strong>
        </div>

        <div className="stat-row">
          <span className="stat-label">
            <span className="stat-icon">
              <FiThumbsUp />
            </span>
            Lượt vote nhận được
          </span>
          <strong>{stats.likesCount ?? 0}</strong>
        </div>
      </div>

      <div className="stat-link">Xem chi tiết hoạt động</div>
    </aside>
  );
};
