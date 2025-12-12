import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { useAuth } from "../../context/AuthContext";
import "./Practice.css";
import CourseForm from "../../pages/Practice/Courses/CourseForm.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const Practice = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Lấy real-time learner count khi user click vào khóa học
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/courses`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Tải dữ liệu thất bại");

        // BE đã populate stats.learnerCount từ learners.length
        setCourses(data.data?.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedCourse(null);
    setFormMode("create");
  };

  const handleCreated = (newCourse) => {
    setCourses((prev) => [...prev, newCourse]);
    handleCloseForm();
  };

  const handleUpdated = (updatedCourse) => {
    setCourses((prev) =>
      prev.map((course) =>
        course._id === updatedCourse._id ? updatedCourse : course
      )
    );
    handleCloseForm();
  };

  // Khi user click vào khóa học + điều hướng + 1 learner
  const handleCourseClick = async (course) => {
    const id = course._id;
    // 1. Optimistic update - Tăng count ngay trên UI
    setCourses((prevCourses) =>
      prevCourses.map((c) =>
        c._id === id
          ? {
              ...c,
              stats: {
                ...c.stats,
                learnerCount: (c.stats?.learnerCount || 0) + 1,
              },
            }
          : c
      )
    );

    // 2. Navigate ngay (không đợi API)
    navigate(`/vocabulary?courseId=${id}`,{
      state: { title: course.title },
    });

    // 3. Background: Track vào server
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses/${id}/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      // console.log('✅ Tracked:', data);
    } catch (error) {
      console.error("Track learner failed:", error);
      // Rollback nếu API fail (optional)
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === id
            ? {
                ...course,
                stats: {
                  ...course.stats,
                  learnerCount: (course.stats?.learnerCount || 0) - 1,
                },
              }
            : course
        )
      );
    }
  };

  const toggleModal = () => setIsModalOpen((v) => !v);
  const openCreateForm = () => {
    setFormMode("create");
    setSelectedCourse(null);
    setShowForm(true);
  };

  const openEditForm = (course) => {
    setFormMode("edit");
    setSelectedCourse(course);
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (!courseId) return;
    const confirmed = window.confirm("Bạn có chắc muốn xóa khóa học này?");
    if (!confirmed) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Xóa khóa học thất bại");
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch (err) {
      alert(err.message);
    }
  };

  const renderSection = (title, typeFilter) => {
    const list = courses.filter((c) => c.type === typeFilter);
    if (list.length === 0) return null;
    return (
      <div className="practice-container">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          {user?.role === "admin" && (
            <button className="add-btn" onClick={openCreateForm}>
              +
            </button>
          )}
        </div>
        <div className="courses-grid">
          {list.map((course) => (
            <div key={course._id} className="course-card">
              <div className="course-image">
                <img src={course.coverImage} alt={course.title} />
                {course.isPro && <span className="pro-badge">PRO</span>}
              </div>
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-desc">đã học {course.stats?.learnerCount ?? 0} từ</p>
                <div className="course-stats">
                  <span className="stat-item">
                    👥 {course.stats?.learnerCount ?? 0} học viên
                  </span>
                  <span className="stat-item">
                    📚 {course.stats?.wordCount ?? 0} từ
                  </span>
                </div>
                <button
                  className="start-btn"
                  onClick={() => handleCourseClick(course)}
                >
                  Bắt đầu học
                </button>
                {user?.role === "admin" && (
                  <div className="admin-actions">
                    <button
                      className="ghost-btn"
                      onClick={() => openEditForm(course)}
                    >
                      Edit
                    </button>
                    <button
                      className="ghost-btn"
                      onClick={() => handleDelete(course._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return <p>Đang tải khóa học...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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
                Học từ vựng hiệu quả với phương pháp Lặp lại ngắt quãng + Gợi
                nhớ chủ động
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
              <button className="modal-close" onClick={toggleModal}>
                ✕
              </button>

              <h2 className="modal-title">
                <span className="modal-icon">💡</span>
                Phương pháp học hiệu quả
              </h2>

              <div className="modal-body">
                <div className="method-item">
                  <h3>🔄 Spaced Repetition (Lặp lại ngắt quãng)</h3>
                  <p>
                    Ôn tập theo khoảng thời gian tăng dần để tối ưu trí nhớ dài
                    hạn:
                  </p>
                  <ul>
                    <li>📅 Ngày 1: Học từ mới</li>
                    <li>📅 Ngày 2: Ôn lần 1</li>
                    <li>📅 Ngày 5: Ôn lần 2</li>
                    <li>📅 Ngày 12: Ôn lần 3</li>
                    <li>📅 Ngày 42: Ôn lần 4</li>
                  </ul>
                  <p className="highlight-text">✨ Giảm quên lãng ~90%</p>
                </div>

                <div className="method-item">
                  <h3>🧠 Active Recall (Gợi nhớ chủ động)</h3>
                  <p>Nhìn từ tiếng Anh → tự nhớ nghĩa → kiểm tra đáp án.</p>
                  <p className="highlight-text">
                    ✨ Ghi nhớ sâu hơn nhiều lần so với học thụ động
                  </p>
                </div>

                <div className="method-combine">
                  <h3>🎯 Kết hợp = siêu hiệu quả</h3>
                  <p>
                    Hệ thống nhắc ôn đúng lúc với gợi nhớ chủ động. 15 phút/ngày
                    để nhớ từ vựng lâu dài.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {renderSection("1000 từ vựng thông dụng", "vocabulary")}
        {renderSection("TOEIC", "toeic")}
        {renderSection("IELTS", "ielts")}
      </div>
      <Footer />
      {showForm && (
        <CourseForm
          mode={formMode}
          initial={selectedCourse}
          onSuccess={formMode === "create" ? handleCreated : handleUpdated}
          onClose={handleCloseForm}
        />
      )}
    </>
  );
};

export default Practice;
