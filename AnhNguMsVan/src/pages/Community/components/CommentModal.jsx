import React, { useCallback, useEffect, useRef, useState } from "react";
import { renderAvatar } from "../utils/avatar.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { formatRelativeTime } from "../utils/time.js";
import { CommentItem } from "./CommentItem.jsx";
import "../styles/CommentModal.css";

export const CommentModal = ({ post, onClose, fetchComments, addComments }) => {
  const PAGE_LIMIT = 5;
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [inputError, setInputError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [text, setText] = useState("");
  const { user } = useAuth();
  const currentUser = user || {};
  const bodyRef = useRef(null);
  const fetchCommentsRef = useRef(fetchComments);
  const hasMore = comments.length < total;

  // helper: dedupe by id/_id to avoid duplicate when infinite scroll
  const uniqueById = (list = []) => {
    const seen = new Set();
    return list.filter((c) => {
      const key = c?.id || c?._id;
      if (!key || seen.has(String(key))) return false;
      seen.add(String(key));
      return true;
    });
  };

  const getAvatarData = (u = {}) => ({
    name: u.name || u.email || "Người dùng",
    avatar: u.avatar || ""
  });

  // giữ fetchComments không bị re-triggering effect
  useEffect(() => { fetchCommentsRef.current = fetchComments; }, [fetchComments]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchCommentsRef.current?.(post.id, 1, PAGE_LIMIT);
        setComments(uniqueById(data?.items || []));
        setTotal(data?.total ?? 0);
        setPage(data?.page || 1);
      } finally {
        setLoading(false);
      }
    };
    setComments([]);
    setTotal(0);
    setPage(1);
    load();
  }, [post.id]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const data = await fetchCommentsRef.current?.(post.id, nextPage, PAGE_LIMIT);
      setComments((prev) => uniqueById([...prev, ...(data?.items || [])]));
      setPage(nextPage);
      setTotal((prevTotal) => data?.total ?? prevTotal);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loading, loadingMore, page, post.id]);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const handleScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 120) {
        loadMore();
      }
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  useEffect(() => {
    if (!inputError) return;
    const timer = setTimeout(() => setInputError(""), 2500);
    return () => clearTimeout(timer);
  }, [inputError]);

  const handleReplyAdd = (parentId, reply) => {
    setComments((prev) =>
      prev.map((c) =>
        (c.id || c._id) === parentId
          ? { ...c, replies: [...(c.replies || []), reply] }
          : c
      )
    );
  };

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (trimmed.length < 2) {
      setInputError("Bình luận cần ít nhất 2 ký tự.");
      return;
    }
    if (!user) {
      setInputError("Vui lòng đăng nhập để bình luận.");
      return;
    }
    setInputError("");
    setSubmitting(true);
    try {
      const cmt = await addComments?.({ postId: post.id, content: trimmed });
      if (cmt) {
        setComments((prev) => uniqueById([cmt, ...prev]));
        setTotal((prev) => prev + 1);
        setText("");
      }
    } catch {
      setInputError("Gửi bình luận thất bại, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const authorName =
    post.author?.name || post.author?.email || post.authorName || post.userName || "Người dùng";
  const authorAvatar =
    post.author?.avatar || post.author?.photoURL || post.author?.picture || post.avatar || "";
  const categoryLabel = post.category || "Chưa phân loại";
  const timeLabel = formatRelativeTime(post.createdAt || post.created_at || post.createdAtUtc);

  return (
    <div className="comment-modal-overlay" onClick={onClose}>
      <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
        <header className="comment-modal-header">
          <div className="comment-modal-title">Bài viết của {authorName}</div>
          <button className="comment-close-btn" onClick={onClose}>×</button>
        </header>

        <div className="comment-modal-body" ref={bodyRef}>
          <div className="comment-modal-post">
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
          </div>

          <div className="comment-list">
            {loading && <div className="inline-hint">Đang tải bình luận...</div>}
            {!loading && comments.length === 0 && <div className="comment-empty">Chưa có bình luận nào.</div>}
            {comments.map((c) => (
              <CommentItem
                key={c.id || c._id}
                comment={c}
                addComments={addComments}
                onReply={handleReplyAdd}
                currentUser={currentUser}
                postId={post.id}
              />
            ))}
            {loadingMore && <div className="inline-hint">Đang tải thêm...</div>}
            {!loading && !loadingMore && comments.length > 0 && !hasMore && (
              <div className="inline-hint">Đã hiển thị tất cả bình luận</div>
            )}
          </div>
        </div>

        <footer className="comment-modal-footer">
          <div className="comment-input">
            <div className="avatar small">
              {renderAvatar(getAvatarData(currentUser))}
            </div>
            <div className="comment-input-body">
              <div className="comment-input-row">
                <input
                  placeholder="Viết bình luận..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button onClick={handleSubmit} disabled={submitting || !text.trim()}>
                  {submitting ? "Đang gửi..." : "Gửi"}
                </button>
              </div>
              {!user && <div className="inline-error">Vui lòng đăng nhập để bình luận.</div>}
            </div>
          </div>
        </footer>
        {inputError && (
          <div className="comment-toast">
            <div className="input-error">{inputError}</div>
          </div>
        )}
      </div>
    </div>
  );
};
