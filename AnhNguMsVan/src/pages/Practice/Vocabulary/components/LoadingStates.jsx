import React from 'react';
import Header from '../../../../components/Header/Header';

export const LoadingState = () => (
  <>
    <Header />
    <div className="vocabulary-page">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    </div>
  </>
);

export const LoadingTopicDetail = () => (
  <>
    <Header />
    <div className="vocabulary-page">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải từ vựng...</p>
      </div>
    </div>
  </>
);

export const NoTopicsState = ({ isAdmin, onAddTopicClick }) => (
  <>
    <Header />
    <div className="vocabulary-page">
      <h1>1000 từ tiếng Anh thông dụng</h1>
      <div className="vocabulary-container">
        <div className="practice-panel">
          <p className="no-words-message">
            Chưa có chủ đề nào. {isAdmin && "Vui lòng thêm chủ đề mới bằng nút ➕"}
          </p>
        </div>
        
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
        </div>
      </div>
    </div>
  </>
);