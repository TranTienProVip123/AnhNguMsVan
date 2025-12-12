import React, { useMemo, useState } from "react";
import { renderAvatar } from "../utils/avatar.jsx";
import { formatRelativeTime } from "../utils/time.js";
import "../styles/CommentItem.css";

export const CommentItem = ({ comment, onReply, addComments, currentUser, postId }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const commentTime = formatRelativeTime(comment.createdAt);
  const replyCount = comment.replies?.length || 0;
  const replies = useMemo(() => comment.replies || [], [comment.replies]);

  const handleReplySubmit = async () => {
    const trimmed = replyText.trim();
    if (!trimmed) return;
    setSending(true);
    try {
      const reply = await addComments({
        postId,
        content: trimmed,
        parentId: comment.id,
      });
      if (reply) {
        onReply(comment.id, reply);
        setReplyText("");
        setShowReplyBox(false);
        setShowReplies(true);
      }
    } catch {
      console.error("Reply failed");
    } finally {
      setSending(false);
    }
  };

  const itemClass = `comment-item ${showReplies ? "is-open" : "is-closed"}`;

  return (
    <div className={itemClass}>
      <div className="avatar small">{renderAvatar(comment.author)}</div>
      <div className="comment-bubble-wrap">
        <div className="comment-bubble">
          <div className="comment-header">
            <div className="comment-author">
              {comment.author?.name}
            </div>
          </div>
          <div className="comment-content">{comment.content}</div>
        </div>

        <div className="comment-actions">
          <span className="comment-time">{commentTime}</span>
          <button
            className="reply-btn"
            onClick={() => setShowReplyBox((p) => !p)}
          >
            Trả lời
          </button>
        </div>

        {replyCount > 0 && (
          <button
            className="toggle-replies"
            onClick={() => setShowReplies((v) => !v)}
          >
            {showReplies ? "Ẩn phản hồi" : `Xem tất cả ${replyCount} phản hồi`}
          </button>
        )}

        {showReplyBox && (
          <div className="reply-box">
            <div className="avatar small">
              {renderAvatar(currentUser)}
            </div>
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Viết phản hồi..."
            />
            <button onClick={handleReplySubmit} disabled={sending}>
              {sending ? "Đang gửi..." : "Gửi"}
            </button>
          </div>
        )}

        {showReplies && replyCount > 0 && (
          <div className="reply-list">
            {replies.map((r) => (
              <div key={r.id || r._id} className="reply-item">
                <div className="avatar xsmall">{renderAvatar(r.author)}</div>
                <div className="reply-body">
                  <div className="reply-bubble">
                    <div className="reply-header">
                      <div className="reply-author">
                        {r.author?.name}
                      </div>
                    </div>
                    <div className="reply-content">{r.content}</div>
                  </div>
                  <div className="reply-actions">
                    <span className="reply-time">{formatRelativeTime(r.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
