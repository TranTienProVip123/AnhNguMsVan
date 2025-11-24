import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./RoadmapSection.css";

const RoadmapSection = () => {
  const [activeRoadmap, setActiveRoadmap] = useState("giao-tiep");
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [zoomedImageUrl, setZoomedImageUrl] = useState("");

  const roadmapData = {
    "giao-tiep": {
      imageUrl: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763629024/L%E1%BB%99_tr%C3%ACnh_h%E1%BB%8Dc_-_visual_selection_1_l8dcwx.png",
      badge: "LỘ TRÌNH ĐÀO TẠO",
      title: "Học giao tiếp",
      subtitle: "Chinh phục giao tiếp tự tin sau 50 buổi - 5 cấp bật",
      highlights: [
        "50 buổi học trực tuyến 1-1",
        "5 cấp độ từ cơ bản đến nâng cao",
        "Lộ trình cá nhân hóa riêng cho bạn",
        "Hỗ trợ xuyên suốt trong suốt khóa học"
      ],
      link: "/roadmap/giao-tiep"
    },
    "toeic": {
      imageUrl: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763629024/L%E1%BB%99_tr%C3%ACnh_h%E1%BB%8Dc_-_visual_selection_1_l8dcwx.png",
      badge: "LỘ TRÌNH ĐÀO TẠO",
      title: "TOEIC 2 kỹ năng",
      subtitle: "Chinh phục 600+ sau 3 tháng học",
      highlights: [
        "Tập trung Listening & Reading",
        "Luyện đề theo format chuẩn ETS",
        "Chiến lược làm bài hiệu quả",
        "Cam kết đầu ra 600+ điểm"
      ],
      link: "/roadmap/toeic"
    }
  };

  const currentRoadmap = roadmapData[activeRoadmap];

  return (
    <div className="roadmap-msvan">
      <div className="roadmap-header">
        <h2>LỘ TRÌNH ĐÀO TẠO</h2>
        <h3>TẠI MS VÂN</h3>
      </div>

      <div className="roadmap-tabs">
        <button
          className={`roadmap-tab ${activeRoadmap === "giao-tiep" ? "active" : ""}`}
          onClick={() => setActiveRoadmap("giao-tiep")}
        >
          LỘ TRÌNH HỌC GIAO TIẾP
        </button>
        <button
          className={`roadmap-tab ${activeRoadmap === "toeic" ? "active" : ""}`}
          onClick={() => setActiveRoadmap("toeic")}
        >
          LỘ TRÌNH HỌC TOEIC 2 KỸ NĂNG
        </button>
      </div>

      <div className="roadmap-wrapper">
        <div className="roadmap-card">
          <div className="roadmap-text-section">
            <div className={`roadmap-badge ${activeRoadmap === "toeic" ? "toeic" : ""}`}>
              <span>{currentRoadmap.badge}</span>
            </div>
            <h3 className="roadmap-main-title">{currentRoadmap.title}</h3>
            <p className="roadmap-subtitle">{currentRoadmap.subtitle}</p>
            <ul className="roadmap-highlights">
              {currentRoadmap.highlights.map((item, idx) => (
                <li key={idx}>✓ {item}</li>
              ))}
            </ul>
            <Link to={currentRoadmap.link} className="roadmap-cta-button">
              <span>Xem chi tiết khóa học</span>
              <span className="arrow">→</span>
            </Link>
          </div>
          <div className="roadmap-visual-section">
            <div
              className="roadmap-image-wrapper"
              onClick={() => {
                setZoomedImageUrl(currentRoadmap.imageUrl);
                setIsImageZoomed(true);
              }}
            >
              <img
                src={currentRoadmap.imageUrl}
                alt={`Roadmap ${currentRoadmap.title}`}
                className="roadmap-image"
              />
              <div className="zoom-hint">🔍</div>
            </div>
          </div>
        </div>
      </div>

      {isImageZoomed && (
        <div className="image-zoom-modal" onClick={() => setIsImageZoomed(false)}>
          <div className="zoom-modal-content">
            <button className="close-zoom-btn" onClick={() => setIsImageZoomed(false)}>
              ✕
            </button>
            <img src={zoomedImageUrl} alt="Zoomed Roadmap" className="zoomed-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapSection;