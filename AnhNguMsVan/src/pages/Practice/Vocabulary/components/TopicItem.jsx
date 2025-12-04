import React, { memo } from 'react';

const TopicItem = memo(({ 
  topic,
  topicProgress,
  isActive, 
  isAdmin, 
  openMenuId, 
  onTopicClick, 
  onToggleMenu, 
  onAddWord, 
  onEditTopic, 
  onDeleteTopic 
}) => {
  // Fallback để đảm bảo totalWords luôn có giá trị
  const totalWordsLearned = topicProgress?.totalWordsLearned || 0;
  const completionRate = topicProgress?.completionRate || 0;

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
          <span className="topic-words">{totalWordsLearned}/{topic.totalWords ?? 0} từ</span>
          <div className="topic-stats-right">
            <span className="topic-progress">{completionRate}%</span>
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
                      🗑 Xóa chủ đề
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
