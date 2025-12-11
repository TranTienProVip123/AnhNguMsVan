import React, { useState } from "react";
import { CATEGORY_OPTIONS } from "../utils/constants.js";
import { renderAvatar } from "../utils/avatar.jsx";
import "../styles/Common.css";
import "../styles/Composer.css";

export const Composer = ({
  user,
  draftContent,
  draftTitle,
  onChange,
  onTitleChange,
  onSubmit,
  activeCategory,
  onCategoryChange,
  error,
  isPosting
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeComposer = () => setIsOpen(false);

  const handleCategorySelect = (label) => {
    onCategoryChange?.(label);
    setIsOpen(true);
  };

  if (!isOpen) {
    return (
      <div className="composer-card collapsed" onClick={() => setIsOpen(true)}>
        <div className="avatar writer">
          {renderAvatar({ name: user?.name || user?.email, avatar: user?.avatar })}
        </div>
        <div className="composer-prompt">
          <div className="prompt-title">Bạn muốn chia sẻ điều gì hôm nay?</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="composer-overlay" onClick={closeComposer} />
      <div className="composer-modal" role="dialog" aria-modal="true">
        <div className="composer-card modal">
          <div className="composer-header">
            <div className="avatar writer">
              {renderAvatar({ name: user?.name || user?.email, avatar: user?.avatar })}
            </div>
            <div className="composer-meta">
              <div className="composer-name">{user?.name || user?.email || "Khách"}</div>
              <div className="composer-privacy">Chia sẻ với Cộng đồng Ms.Vân</div>
            </div>
            <button className="icon-btn ghost close" type="button" aria-label="Đóng" onClick={closeComposer}>
              ×
            </button>
          </div>

          <div className="modal-subtitle">Đăng bài học tập, hỏi đáp hoặc chia sẻ kinh nghiệm của bạn.</div>

          <input
            className="composer-input title"
            placeholder="Nhập tiêu đề..."
            value={draftTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            maxLength={100}
          />

          <div className="composer-input-wrap modal-section">
            <textarea
              className="composer-input fb"
              placeholder="Bạn đang nghĩ gì? Hãy chia sẻ câu hỏi, kinh nghiệm hoặc mẹo học tập của bạn..."
              value={draftContent}
              onChange={(e) => onChange(e.target.value)}
              rows={5}
              maxLength={500}
            />
            <div className="composer-counter">
              {draftContent.length}/{500} ký tự
            </div>
          </div>

          <div className="composer-categories modal-section">
            <div className="composer-label">Chủ đề</div>
            <div className="chip-group">
              {CATEGORY_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isActive = option.label === activeCategory;
                return (
                  <button
                    key={option.label}
                    type="button"
                    className={`chip-btn ${isActive ? "active" : ""}`}
                    onClick={() => handleCategorySelect(option.label)}
                  >
                    <Icon />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="composer-toolbar">
            <div className="composer-actions fb">
              <button className="icon-btn ghost" type="button" onClick={closeComposer}>
                Đóng
              </button>
              <button className="primary" onClick={onSubmit} type="button" disabled={isPosting}>
                {isPosting ? "Đang đăng..." : "Đăng bài"}
              </button>
            </div>
          </div>

          {error && <div className="inline-error">{error}</div>}

          {!user && (
            <div className="inline-hint">Bạn cần đăng nhập để đăng bài và tương tác với mọi người.</div>
          )}
        </div>
      </div>
    </>
  );
};
