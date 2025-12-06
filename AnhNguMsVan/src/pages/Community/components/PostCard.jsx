import React from "react";
import { FiThumbsUp, FiMessageCircle, FiShare2, FiBookmark } from "react-icons/fi";
import { renderAvatar } from "../utils/avatar.jsx";
import { formatRelativeTime } from "../utils/time.js";

export const PostCard = ({ post }) => {
  const authorName =
    post.author?.name ||
    post.author?.email ||
    post.authorName ||
    post.userName ||
    "Người đăng";

  const authorAvatar =
    post.author?.avatar || post.author?.photoURL || post.author?.picture || post.avatar || "";

  const categoryLabel = post.category || "Chưa phân loại";

  const timeLabel = formatRelativeTime(post.createdAt || post.created_at || post.createdAtUtc);

  return (
    <article className="post-card">
      <div className="post-meta">
        <div className="avatar">{renderAvatar({ name: authorName, avatar: authorAvatar })}</div>
        <div>
          <div className="post-author">{authorName}</div>
          <div className="post-subtitle">
            <span>{timeLabel}</span>
            <span className="dot">·</span>
            <span className="category-pill">{categoryLabel}</span>
          </div>
        </div>
      </div>

      {post.title && <h3 className="post-title">{post.title}</h3>}

      <p className="post-body">{post.content}</p>

      <footer className="post-footer">
        <div className="post-actions-left">
          <button className="icon-btn">
            <FiThumbsUp /> <span>{post.likesCount || 0}</span>
          </button>
          <button className="icon-btn">
            <FiMessageCircle /> <span>{post.commentsCount || 0}</span>
          </button>
        </div>

        <div className="post-actions-right">
          <button className="icon-btn ghost" title="Lưu bài">
            <FiBookmark />
          </button>
          <button className="icon-btn ghost" title="Chia sẻ">
            <FiShare2 />
          </button>
        </div>
      </footer>
    </article>
  );
};
