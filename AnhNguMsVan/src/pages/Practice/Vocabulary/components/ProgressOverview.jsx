import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './ProgressOverview.css';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const ProgressOverview = () => {
  const { user, token } = useAuth();
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user || !token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/api/progress/overview`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          setProgressData(data.data);
        }
      } catch (error) {
        console.error('Fetch progress failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user, token]);

  if (!user) {
    return (
      <div className="progress-container">
        <div className="auth-required">
          <h2>🔒 Yêu cầu đăng nhập</h2>
          <p>Bạn cần đăng nhập để xem tiến độ học tập</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="progress-container">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h1>📊 Tiến độ học tập của bạn</h1>
        <p>Theo dõi quá trình học từ vựng</p>
      </div>

      {progressData.length === 0 ? (
        <div className="no-progress">
          <h3>Chưa có dữ liệu học tập</h3>
          <p>Hãy bắt đầu học để theo dõi tiến độ nhé!</p>
        </div>
      ) : (
        <div className="courses-progress-list">
          {progressData.map((courseProgress) => (
            <div key={courseProgress.courseId} className="course-progress-card">
              <div className="course-progress-header">
                <img 
                  src={courseProgress.courseCoverImage} 
                  alt={courseProgress.courseTitle}
                  className="course-thumbnail"
                />
                <div className="course-info">
                  <h2>{courseProgress.courseTitle}</h2>
                  <p className="total-words">
                    Đã học: <strong>{courseProgress.totalWordsLearned}</strong> từ
                  </p>
                </div>
              </div>

              <div className="topics-progress">
                {courseProgress.topics.map((topic) => (
                  <div key={topic.topicId} className="topic-progress-item">
                    <div className="topic-header">
                      <span className="topic-name">{topic.topicName}</span>
                      <span className={`topic-status ${topic.status}`}>
                        {topic.status === 'completed' ? '✅ Hoàn thành' : 
                         topic.status === 'in_progress' ? '⏳ Đang học' : 
                         '📝 Chưa bắt đầu'}
                      </span>
                    </div>
                    <div className="topic-stats">
                      <span>{topic.totalWordsLearned} từ</span>
                      <span className="completion-rate">{topic.completionRate}%</span>
                    </div>
                    <div className="topic-progress-bar">
                      <div 
                        className="topic-progress-fill"
                        style={{ width: `${topic.completionRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressOverview;