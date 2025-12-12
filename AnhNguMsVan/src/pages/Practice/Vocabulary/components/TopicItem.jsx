import React, { memo } from 'react';

const TopicItem = memo(({ 
  topic,
  progress,
  isActive,
  isCompleted,
  isAdmin, 
  openMenuId, 
  onTopicClick, 
  onToggleMenu, 
  onAddWord, 
  onEditTopic, 
  onDeleteTopic,
  onResetTopic,
}) => {

  // Extract progress data với fallback values
  const totalWordsLearned = progress?.totalWordsLearned || 0;
  const completionRate = progress?.completionRate || 0;
  const status = progress?.status || 'not_started';

  // Status colors
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return '#28a745'; // Green
      case 'in_progress': return '#ffc107'; // Yellow
      default: return '#6c757d'; // Gray
    }
  };

  return (
    <div
      className={`topic-item ${isActive ? 'active' : ''}`}
      onClick={onTopicClick}
    >
      <div className="topic-image">
        <img src={topic.image} alt={topic.name} loading="lazy" />
        {isCompleted && (
          <span className="completed-badge">✓ Hoàn thành</span>
        )}
      </div>
      <div className="topic-info">
        <h4 className="topic-title">{topic.name}</h4>
        <div className="topic-stats">
          <span className="topic-words">{totalWordsLearned}/{topic.totalWords ?? 0} từ</span>
          <div className="topic-stats-right">
            <span className="topic-progress">{completionRate}%</span>
            {isCompleted && (
              <button
                className="reset-topic-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onResetTopic(topic.id || topic._id);
                }}
                title="Làm lại chủ đề"
                type="button"
              >
                🔄
              </button>
            )}
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
        {/* Progress bar */}
        {totalWordsLearned > 0 && (
          <div className="topic-progress-bar">
            <div 
              className="topic-progress-fill"
              style={{ 
                width: `${completionRate}%`,
                backgroundColor: getStatusColor()
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
});

TopicItem.displayName = 'TopicItem';

export default TopicItem;
