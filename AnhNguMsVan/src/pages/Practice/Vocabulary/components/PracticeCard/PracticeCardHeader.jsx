import React, { memo } from 'react';

const PracticeCardHeader = memo(({ 
  word, 
  isFlipped, 
  isAdmin,
  onEditWord,
  onDeleteWord,
  getVietnameseWordType,
  getEnglishWordType
}) => {
  const handleDelete = () => {
    if (window.confirm(
      `Bạn có chắc muốn xóa từ "${word.vietnamese}" (${word.english})?`
    )) {
      onDeleteWord(word);
    }
  };

  return (
    <div className="word-header">
      <div className={`word-title-container ${isFlipped ? "flipped" : ""}`}>
        {/* FRONT - Tiếng Việt */}
        <div className="word-title-front-wrapper">
          <h3 className="word-title word-title-front">
            {word.vietnamese}
          </h3>
          <p className="word-type word-type-front">
            {getVietnameseWordType(word.wordType)}
          </p>
        </div>

        {/* BACK - Tiếng Anh */}
        <div className="word-title-back-wrapper">
          <h3 className="word-title word-title-back">
            {word.english}
          </h3>
          <p className="word-type word-type-back">
            {getEnglishWordType(word.wordType)}
          </p>
        </div>
      </div>

      {isAdmin && (
        <div className="word-actions">
          <button
            className="edit-word-btn"
            onClick={() => onEditWord(word)}
            type="button"
            title="Sửa từ vựng"
          >
            ✏️
          </button>
          <button
            className="delete-word-btn"
            onClick={handleDelete}
            type="button"
            title="Xóa từ vựng"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
});

PracticeCardHeader.displayName = 'PracticeCardHeader';

export default PracticeCardHeader;