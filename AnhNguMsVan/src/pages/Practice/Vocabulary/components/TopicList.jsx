import React, { memo } from 'react';
import TopicItem from './TopicItem';

const TopicList = memo(({ 
  topics, 
  currentTopicIndex, 
  isAdmin, 
  openMenuId,
  topicsProgress,
  completedTopics, // ✅ Nhận Set của topicIds
  onTopicClick,
  onToggleMenu,
  onAddWord,
  onEditTopic,
  onDeleteTopic,
  onAddTopicClick,
  onResetTopic
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
        {topics.map((topic, index) => {
          // ✅ FIXED: Check isCompleted CHO TỪNG topic
          const topicId = (topic.id || topic._id).toString();
          const isCompleted = completedTopics.has(topicId);

          return (
            <TopicItem
              key={topicId}
              topic={topic}
              progress={topicsProgress?.[topicId]}
              isActive={index === currentTopicIndex}
              isCompleted={isCompleted} // ✅ Pass đúng giá trị cho từng topic
              isAdmin={isAdmin}
              openMenuId={openMenuId}
              onTopicClick={() => onTopicClick(index)}
              onToggleMenu={onToggleMenu}
              onAddWord={onAddWord}
              onEditTopic={onEditTopic}
              onDeleteTopic={onDeleteTopic}
              onResetTopic={onResetTopic}
            />
          );
        })}
      </div>
    </div>
  );
});

TopicList.displayName = 'TopicList';

export default TopicList;