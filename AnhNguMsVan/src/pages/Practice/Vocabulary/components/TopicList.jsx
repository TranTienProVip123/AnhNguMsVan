import React, { memo } from 'react';
import TopicItem from './TopicItem';

const TopicList = memo(({ 
  topics, 
  currentTopicIndex, 
  isAdmin, 
  openMenuId,
  onTopicClick,
  onToggleMenu,
  onAddWord,
  onEditTopic,
  onDeleteTopic,
  onAddTopicClick
}) => {
  return (
    <div className="topics-panel">
      <div className="topics-panel-header">
        <h3 className="topics-panel-title">Danh sách chủ đề</h3>
        {isAdmin && (
          <button 
            className="add-topic-btn" 
            onClick={onAddTopicClick}
            type="button"
          >
            <span>➕</span>
          </button>
        )}
      </div>

      <div className="topics-scroll">
        {topics.map((topic, index) => (
          <TopicItem
            key={topic.id}
            topic={topic}
            isActive={index === currentTopicIndex}
            isAdmin={isAdmin}
            openMenuId={openMenuId}
            onTopicClick={() => onTopicClick(index)}
            onToggleMenu={onToggleMenu}
            onAddWord={onAddWord}
            onEditTopic={onEditTopic}
            onDeleteTopic={onDeleteTopic}
          />
        ))}
      </div>
    </div>
  );
});

TopicList.displayName = 'TopicList';

export default TopicList;