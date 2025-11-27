import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./Practice.css";

const Practice = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const vocabularyCourses = [
    {
      id: 1,
      title: "1000 từ tiếng anh thông dụng",
      image: "https://res.cloudinary.com/da6gk23w6/image/upload/v1732676400/1000_common_words_sample.png",
      students: "10,890 lượt học",
      topics: "20 chủ đề",
      path: "/vocabulary/common-1000"
    },
    {
      id: 2,
      title: "Từ vựng giao tiếp",
      image: "https://res.cloudinary.com/da6gk23w6/image/upload/v1732676400/conversation_vocab_sample.png",
      students: "10,890 lượt học",
      topics: "20 chủ đề",
      path: "/vocabulary/conversation"
    },
    {
      id: 3,
      title: "1000 từ tiếng anh thông dụng",
      image: "https://res.cloudinary.com/da6gk23w6/image/upload/v1732676400/1000_common_words_sample.png",
      students: "10,890 lượt học",
      topics: "20 chủ đề",
      path: "/vocabulary/common-1000-2"
    }
  ];

  const toeicCourses = [
    {
      id: 4,
      title: "1000 từ vựng TOEIC cơ bản",
      image: "https://res.cloudinary.com/da6gk23w6/image/upload/v1732676400/toeic_basic_sample.png",
      students: "8,500 lượt học",
      topics: "15 chủ đề",
      path: "/vocabulary/toeic-basic"
    },
    {
      id: 5,
      title: "Từ vựng TOEIC nâng cao",
      image: "https://res.cloudinary.com/da6gk23w6/image/upload/v1732676400/toeic_advanced_sample.png",
      students: "6,200 lượt học",
      topics: "18 chủ đề",
      path: "/vocabulary/toeic-advanced"
    },
    {
      id: 6,
      title: "TOEIC Part 1-4 Vocabulary",
      image: "https://res.cloudinary.com/da6gk23w6/image/upload/v1732676400/toeic_listening_sample.png",
      students: "7,800 lượt học",
      topics: "12 chủ đề",
      path: "/vocabulary/toeic-listening"
    }
  ];

  const handleCourseClick = (path) => {
    navigate(path);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <Header />

      <div className="practice-page">
        {/* Hero Section + Info Box */}
        <div className="practice-container">
          <div className="practice-header-wrapper">
            <div className="practice-hero-text">
              <h1>Học từ vựng tiếng Anh</h1>
              <p className="practice-subtitle">
                Học từ vựng hiệu quả với phương pháp Lặp lại ngắt quãng + Gợi nhớ chủ động
              </p>
            </div>

            <div className="info-box-trigger" onClick={toggleModal}>
              <h3>
                <span className="info-icon">💡</span>
                Spaced Repetition + Active Recall là gì?
              </h3>
              <span className="click-hint">Click để xem chi tiết</span>
            </div>
          </div>
        </div>

        {/* Modal Popup */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={toggleModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={toggleModal}>✕</button>
              
              <h2 className="modal-title">
                <span className="modal-icon">💡</span>
                Phương pháp học hiệu quả
              </h2>

              <div className="modal-body">
                <div className="method-item">
                  <h3>🔄 Spaced Repetition (Lặp lại ngắt quãng)</h3>
                  <p>
                    Phương pháp ôn tập từ vựng theo khoảng thời gian tăng dần để tối ưu hóa trí nhớ dài hạn:
                  </p>
                  <ul>
                    <li>📅 <strong>Ngày 1:</strong> Học từ mới lần đầu</li>
                    <li>📅 <strong>Ngày 2:</strong> Ôn lại lần 1 (sau 1 ngày)</li>
                    <li>📅 <strong>Ngày 5:</strong> Ôn lại lần 2 (sau 3 ngày)</li>
                    <li>📅 <strong>Ngày 12:</strong> Ôn lại lần 3 (sau 1 tuần)</li>
                    <li>📅 <strong>Ngày 42:</strong> Ôn lại lần 4 (sau 1 tháng)</li>
                  </ul>
                  <p className="highlight-text">
                    ✨ Kết quả: Ghi nhớ từ vựng vào bộ nhớ dài hạn, giảm quên lãng xuống 90%
                  </p>
                </div>

                <div className="method-item">
                  <h3>🧠 Active Recall (Gợi nhớ chủ động)</h3>
                  <p>
                    Thay vì đọc lại nghĩa từ (học thụ động), bạn sẽ:
                  </p>
                  <ul>
                    <li>👁️ Nhìn từ tiếng Anh</li>
                    <li>🤔 Tự hồi tưởng nghĩa tiếng Việt</li>
                    <li>✅ Kiểm tra đáp án</li>
                  </ul>
                  <p className="highlight-text">
                    ✨ Kết quả: Não bộ ghi nhớ sâu và lâu hơn gấp 5 lần so với học thụ động
                  </p>
                </div>

                <div className="method-combine">
                  <h3>🎯 Kết hợp 2 phương pháp = Siêu hiệu quả</h3>
                  <p>
                    Hệ thống sẽ tự động nhắc bạn ôn tập đúng thời điểm, với phương pháp gợi nhớ chủ động.
                    Chỉ cần học đều 15 phút/ngày, bạn sẽ nhớ từ vựng suốt đời!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vocabulary Section */}
        <div className="practice-container">
          <div className="section-header">
            <h2 className="section-title">Từ vựng tiếng Anh thông dụng</h2>
          </div>

          <div className="courses-grid">
            {vocabularyCourses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-image">
                  <img src={course.image} alt={course.title} />
                </div>
                <div className="course-content">
                  <h3 className="course-title">{course.title}</h3>
                  <div className="course-stats">
                    <span className="stat-item">
                      <span className="stat-icon">👥</span>
                      {course.students}
                    </span>
                    <span className="stat-item">
                      <span className="stat-icon">📚</span>
                      {course.topics}
                    </span>
                  </div>
                  <button
                    className="start-btn"
                    onClick={() => handleCourseClick(course.path)}
                  >
                    Bắt đầu học
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOEIC Section */}
        <div className="practice-container">
          <div className="section-header">
            <h2 className="section-title">Toeic</h2>
          </div>

          <div className="courses-grid">
            {toeicCourses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-image">
                  <img src={course.image} alt={course.title} />
                </div>
                <div className="course-content">
                  <h3 className="course-title">{course.title}</h3>
                  <div className="course-stats">
                    <span className="stat-item">
                      <span className="stat-icon">👥</span>
                      {course.students}
                    </span>
                    <span className="stat-item">
                      <span className="stat-icon">📚</span>
                      {course.topics}
                    </span>
                  </div>
                  <button
                    className="start-btn"
                    onClick={() => handleCourseClick(course.path)}
                  >
                    Bắt đầu học
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Practice;