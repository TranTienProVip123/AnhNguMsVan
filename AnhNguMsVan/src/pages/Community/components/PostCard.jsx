import React from "react";
import { useState } from "react";
import { FiThumbsUp, FiMessageCircle, FiShare2, FiBookmark, FiShield } from "react-icons/fi";
import { renderAvatar } from "../utils/avatar.jsx";
import { formatRelativeTime } from "../utils/time.js";
import { CommentModal } from "./CommentModal.jsx";
import "../styles/Common.css";
import "../styles/PostCard.css";

export const PostCard = ({ post, onLike, fetchComments, addComments }) => {
  const [showComments, setShowComments] = useState(false);
  const [liking, setLiking] = useState(false);
  const authorName =
    post.author?.name ||
    post.author?.email ||
    post.authorName ||
    post.userName ||
    "Người đăng";

  const isAdmin = post.author?.role === "admin" || post.authorRole === "admin" || post.role === "admin";

  const authorAvatar =
    post.author?.avatar || post.author?.photoURL || post.author?.picture || post.avatar || "";

  const categoryLabel = post.category || "Chưa phân loại";

  const timeLabel = formatRelativeTime(post.createdAt || post.created_at || post.createdAtUtc);

  const handleToggleComments = () => setShowComments((v) => !v);

  return (
    <article className="post-card">
      <div className="post-meta">
        <div className="avatar">{renderAvatar({ name: authorName, avatar: authorAvatar })}</div>
        <div>
          <div className="post-author">{authorName}
            {isAdmin && (
              <span className="badge-pill-admin">
                <FiShield />
                ADMIN
              </span>
            )}
          </div>
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
          <button
            className={`icon-btn ${post.liked ? "active" : ""}`}
            onClick={async () => {
              if (liking) return;
              setLiking(true);
              try {
                await onLike?.(post.id); //truyền onLike={likePost} ở useCommunity
              } finally {
                setLiking(false);
              }
            }}
            disabled={liking}
          >
            <FiThumbsUp /> <span>{post.likesCount || 0}</span>
          </button>
          <button className="icon-btn" onClick={handleToggleComments}>
            <FiMessageCircle /> <span>{post.commentsCount || 0}</span>
          </button>

          {showComments && (
            <CommentModal
              post={post}
              onClose={() => setShowComments(false)}
              fetchComments={fetchComments}
              addComments={addComments}
            />
          )}
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
