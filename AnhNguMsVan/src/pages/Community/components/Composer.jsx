import React, { useState } from "react";
import { CATEGORY_OPTIONS } from "../utils/constants.js";
import { renderAvatar } from "../utils/avatar.jsx";

export const Composer = ({
  user,
  draftContent,
  onChange,
  onSubmit,
  activeCategory,
  onCategoryChange,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const maxLength = 500;

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
          <div className="prompt-title">Chia sẻ điều gì hôm nay?</div>
        </div>
      </div>
    );
  }

  return (
    <div className="composer-card fb">
      <div className="composer-header">
        <div className="avatar writer">
          {renderAvatar({ name: user?.name || user?.email, avatar: user?.avatar })}
        </div>
        <div className="composer-meta">
          <div className="composer-name">{user?.name || user?.email || "Khách"}</div>
          <div className="composer-privacy">Chia sẻ tới Cộng đồng Ms.Vân</div>
        </div>
      </div>

      <div className="composer-categories">
        <div className="composer-label">Đăng vào</div>
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

      <div className="composer-input-wrap">
        <textarea
          className="composer-input fb"
          placeholder="Bạn đang nghĩ gì?"
          value={draftContent}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          maxLength={maxLength}
        />
        <div className="composer-counter">
          {draftContent.length}/{maxLength} ký tự
        </div>
      </div>

      <div className="composer-divider" />

      <div className="composer-toolbar">
        <div className="composer-actions fb">
          <button className="icon-btn ghost" type="button" onClick={() => setIsOpen(false)}>
            Đóng
          </button>
          <button className="primary" onClick={onSubmit} type="button">
            Đăng bài
          </button>
        </div>
      </div>

      {error && <div className="inline-error">{error}</div>}

      {!user && (
        <div className="inline-hint">Bạn cần đăng nhập để đăng bài và tương tác với mọi người.</div>
      )}
    </div>
  );
};
