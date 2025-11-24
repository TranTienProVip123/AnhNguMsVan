import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header.jsx";
import {
  LEVELS,
  getLevelColor,
  getLevelInfo,
} from "../../Practice/Vocabulary/Levels.jsx";
import "./Vocabulary.css";

const Vocabulary = () => {
  const navigate = useNavigate();
  const [showLevelGuide, setShowLevelGuide] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const topics = [
    {
      id: 1,
      title: "Daily Life – Cuộc sống hằng ngày",
      subtitle: "Routine, habits, chores...",
    },
    {
      id: 2,
      title: "Work & Office – Công sở & công việc",
      subtitle: "Meeting, deadline, career...",
    },
    {
      id: 3,
      title: "Travel & Transportation – Du lịch & phương tiện",
      subtitle: "Airport, hotel, taxi...",
    },
    {
      id: 4,
      title: "Food & Dining – Ẩm thực & ăn uống",
      subtitle: "Restaurant, recipe, ingredients...",
    },
    {
      id: 5,
      title: "Health & Fitness – Sức khỏe & thể hình",
      subtitle: "Exercise, nutrition, wellness...",
    },
    {
      id: 6,
      title: "Education – Giáo dục",
      subtitle: "School, university, learning...",
    },
    {
      id: 7,
      title: "Technology – Công nghệ",
      subtitle: "Internet, software, devices...",
    },
    {
      id: 8,
      title: "Shopping – Mua sắm",
      subtitle: "Store, price, discount...",
    },
    {
      id: 9,
      title: "Entertainment – Giải trí",
      subtitle: "Movies, music, games...",
    },
    {
      id: 10,
      title: "Nature & Environment – Thiên nhiên & môi trường",
      subtitle: "Weather, climate, animals...",
    },
    {
      id: 11,
      title: "Family & Relationships – Gia đình & mối quan hệ",
      subtitle: "Parents, siblings, friends...",
    },
    {
      id: 12,
      title: "Money & Finance – Tiền bạc & tài chính",
      subtitle: "Bank, investment, budget...",
    },
    {
      id: 13,
      title: "Housing – Nhà ở",
      subtitle: "Apartment, furniture, rent...",
    },
    {
      id: 14,
      title: "Communication – Giao tiếp",
      subtitle: "Phone, email, social media...",
    },
    {
      id: 15,
      title: "Emotions & Feelings – Cảm xúc",
      subtitle: "Happy, sad, angry...",
    },
    {
      id: 16,
      title: "Hobbies & Interests – Sở thích",
      subtitle: "Reading, painting, sports...",
    },
    {
      id: 17,
      title: "Culture & Traditions – Văn hóa & truyền thống",
      subtitle: "Festivals, customs, heritage...",
    },
    {
      id: 18,
      title: "Social Issues – Vấn đề xã hội",
      subtitle: "Poverty, equality, rights...",
    },
    {
      id: 19,
      title: "Business & Marketing – Kinh doanh & marketing",
      subtitle: "Advertising, sales, strategy...",
    },
    {
      id: 20,
      title: "Jobs & Careers – Nghề nghiệp & định hướng",
      subtitle: "Job search, interviews, career development...",
    },
    {
      id: 21,
      title: "TOEIC Vocabulary – Chủ đề theo TOEIC",
      subtitle: "Business, office routines, travel, marketing, finance...",
    },
    {
      id: 22,
      title: "IELTS Vocabulary – Chủ đề học thuật",
      subtitle: "Education, environment, technology, society, global issues...",
    },
    {
      id: 23,
      title: "Grammar-based Vocabulary – Từ loại, collocations, phrasal verbs",
      subtitle:
        "Parts of speech, common collocations, phrasal verbs in context...",
    },
  ];

  const handleTopicCardClick = (topic) => {
    setSelectedTopic(topic);
  };

  const handleLevelClick = (topicId, level) => {
    console.log(`Selected Topic ${topicId}, Level ${level}`);
    navigate(`/vocabulary/${topicId}/${level}`);
    setSelectedTopic(null); // Đóng modal
  };

  const handleBackToPractice = () => {
    navigate("/practice");
  };

  return (
    <>
      <Header />

      <div className="vocabulary-page">
        <div className="vocabulary-content">
          <div className="vocabulary-header">
            <h1>Chọn Chủ Đề Từ Vựng</h1>
            <p>
              23 Chủ đề quan trọng nhất, từ cấp độ A1 (Cơ bản) đến C2 (Thành
              thạo).
            </p>
          </div>

          {/* Nút xem hướng dẫn - Click để mở modal */}
          <div className="levels-legend">
            <button
              className="guide-button"
              onClick={() => setShowLevelGuide(true)}
            >
              <span className="legend-icon">ℹ️</span>
              <span>Xem hướng dẫn các cấp độ (CEFR)</span>
            </button>
          </div>

          {/* Modal hiển thị chi tiết levels */}
          {showLevelGuide && (
            <div
              className="level-guide-modal"
              onClick={() => setShowLevelGuide(false)}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3>📚 Hướng dẫn các cấp độ (CEFR)</h3>
                  <button
                    className="close-btn"
                    onClick={() => setShowLevelGuide(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="modal-body">
                  {LEVELS.map((level) => {
                    const info = getLevelInfo(level);
                    return (
                      <div key={level} className="level-guide-item">
                        <div
                          className="level-badge"
                          style={{ backgroundColor: getLevelColor(level) }}
                        >
                          {level}
                        </div>
                        <div className="level-info">
                          <h4>{info.name}</h4>
                          <p>{info.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Modal chọn level khi click vào topic card */}
          {selectedTopic && (
            <div
              className="level-guide-modal"
              onClick={() => setSelectedTopic(null)}
            >
              <div
                className="modal-content topic-level-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <div>
                    <h3>{selectedTopic.title}</h3>
                    <p className="modal-subtitle">{selectedTopic.subtitle}</p>
                  </div>
                  <button
                    className="close-btn"
                    onClick={() => setSelectedTopic(null)}
                  >
                    ✕
                  </button>
                </div>
                <div className="modal-body">
                  <h4 className="select-level-title">
                    Chọn cấp độ bạn muốn luyện tập:
                  </h4>
                  <div className="modal-levels-grid">
                    {LEVELS.map((level) => {
                      const info = getLevelInfo(level);
                      return (
                        <button
                          key={level}
                          className="modal-level-btn"
                          style={{ backgroundColor: getLevelColor(level) }}
                          onClick={() =>
                            handleLevelClick(selectedTopic.id, level)
                          }
                        >
                          <span className="modal-level-name">{level}</span>
                          <span className="modal-level-desc">{info.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hiển thị lưới các chủ đề */}
          <div className="topics-grid">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="topic-card"
                onClick={() => handleTopicCardClick(topic)}
              >
                <div className="topic-header">
                  <span className="topic-number">{topic.id}.</span>
                  <h3 className="topic-title">{topic.title}</h3>
                </div>
                <p className="topic-subtitle">{topic.subtitle}</p>

                <div className="topic-levels">
                  {LEVELS.map((level) => {
                    const info = getLevelInfo(level);
                    return (
                      <button
                        key={level}
                        className="level-btn"
                        style={{ backgroundColor: getLevelColor(level) }}
                        onClick={() => handleLevelClick(topic.id, level)}
                        title={`${info.name}: ${info.description}`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {/* Nút quay lại */}
          <div className="back-button-container">
            <button
              className="back-to-practice-btn"
              onClick={handleBackToPractice}
            >
              <span className="back-icon">←</span>
              <span>Quay lại trang luyện tập</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Vocabulary;
