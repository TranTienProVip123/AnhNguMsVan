import React, { memo } from 'react';

const TopicItem = memo(({ 
  topic, 
  isActive, 
  isAdmin, 
  openMenuId, 
  onTopicClick, 
  onToggleMenu, 
  onAddWord, 
  onEditTopic, 
  onDeleteTopic 
}) => {
  return (
    <div
      className={`topic-item ${isActive ? 'active' : ''}`}
      onClick={onTopicClick}
    >
      <div className="topic-image">
        <img src={topic.image} alt={topic.name} loading="lazy" />
      </div>
      <div className="topic-info">
        <h4 className="topic-title">{topic.name}</h4>
        <div className="topic-stats">
          <span className="topic-words">{topic.learnedWords}/{topic.totalWords} từ</span>
          <div className="topic-stats-right">
            <span className="topic-progress">{topic.progress}%</span>
            {isAdmin && (
              <div className="topic-menu-container">
                <button 
                  className="topic-menu-btn"
                  onClick={(e) => onToggleMenu(e, topic.id)}
                  type="button"
                >
                  ⋮
                </button>
                {openMenuId === topic.id && (
                  <div className="topic-menu-dropdown">
                    <button onClick={(e) => onAddWord(e, topic)} type="button">
                      ➕ Thêm từ vựng
                    </button>
                    <button onClick={(e) => onEditTopic(e, topic)} type="button">
                      ✏️ Sửa chủ đề
                    </button>
                    <button 
                      onClick={(e) => onDeleteTopic(e, topic.id)}
                      className="delete-btn"
                      type="button"
                    >
                      🗑️ Xóa chủ đề
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

TopicItem.displayName = 'TopicItem';

export default TopicItem;