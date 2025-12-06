import React from "react";
import { FiFeather, FiMessageCircle, FiThumbsUp } from "react-icons/fi";

export const StatsPanel = () => (
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
        <strong>0</strong>
      </div>

      <div className="stat-row">
        <span className="stat-label">
          <span className="stat-icon">
            <FiMessageCircle />
          </span>
          Bình luận đã tạo
        </span>
        <strong>0</strong>
      </div>

      <div className="stat-row">
        <span className="stat-label">
          <span className="stat-icon">
            <FiThumbsUp />
          </span>
          Lượt vote nhận được
        </span>
        <strong>0</strong>
      </div>
    </div>

    <div className="stat-link">Xem chi tiết hoạt động</div>
  </aside>
);
