import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import data from "./roadmapData/roadmapData.json";
import "./RoadmapGiaoTiep.css";

const RoadmapGiaoTiep = () => {
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const getSessionNumber = (phaseId, index) => {
    const starts = [1, 11, 21, 26, 36];
    return starts[phaseId - 1] + index;
  };

  return (
    <div className="roadmap-giao-tiep-page">
      <Header />

      {/* Hero */}
      <div className="roadmap-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">{data.hero.breadcrumbs[0]}</Link>
            <span> / </span>
            <span>{data.hero.breadcrumbs[1]}</span>
          </div>
          <h1>{data.hero.title}</h1>
        </div>
      </div>

      {/* Goals */}
      <div className="course-goals-section highlight-section">
        <div className="container">
          <div className="section-header-special">
            <h2 className="section-title">{data.goals.title}</h2>
            <p className="section-subtitle-special">{data.goals.subtitle}</p>
          </div>
          <div className="goals-grid">
            {data.goals.items.map((item, i) => (
              <div key={i} className="goal-card-special">
                <div className="goal-header">
                  <div className="goal-icon-special">{item.icon}</div>
                  <h3>{item.title}</h3>
                </div>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audience */}
      <div className="target-audience-section">
        <div className="container">
          <h2 className="section-title">{data.audience.title}</h2>
          <p className="section-subtitle">{data.audience.subtitle}</p>
          <div className="audience-grid">
            {data.audience.items.map((item, i) => (
              <div key={i} className="audience-card">
                <div className="audience-header">
                  <div className="audience-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                </div>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Method */}
      <div className="learning-method-section">
        <div className="container">
          <h2 className="section-title">{data.method.title}</h2>
          <p className="section-subtitle">{data.method.subtitle}</p>
          <div className="method-timeline">
            {data.method.items.map((item, i) => (
              <div key={i} className="method-item">
                <div className="method-badge" style={{ background: item.color }}>
                  {item.phase}
                </div>
                <div className="method-content">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="commitment-badge">
            <span className="commitment-icon">💪</span>
            <strong>Cam kết:</strong> {data.method.commitment}
          </div>
        </div>
      </div>

      {/* Phases */}
      <div className="detailed-roadmap-section">
        <div className="container">
          <h2 className="section-title">📋 CHI TIẾT 5 CẤP ĐỘ</h2>
          <p className="section-subtitle">Click vào từng cấp độ để xem chi tiết các buổi học</p>
          <div className="phases-container">
            {data.phases.map((phase) => (
              <div
                key={phase.id}
                className={`phase-card ${expandedPhase === phase.id ? "expanded" : ""}`}
              >
                <div
                  className="phase-header"
                  onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                  style={{ borderLeftColor: phase.color }}
                >
                  <div className="phase-info">
                    <div className="phase-number" style={{ background: phase.color }}>
                      Cấp {phase.id}
                    </div>
                    <div className="phase-details">
                      <h3>{phase.title}</h3>
                      <p className="phase-lessons">{phase.range}</p>
                    </div>
                  </div>
                  <div className="expand-icon">
                    {expandedPhase === phase.id ? "−" : "+"}
                  </div>
                </div>

                {expandedPhase === phase.id && (
                  <div className="phase-content">
                    <div className="sessions-grid">
                      {phase.sessions.map((title, idx) => (
                        <div key={idx} className="session-item">
                          <div className="session-number" style={{ background: phase.color }}>
                            {getSessionNumber(phase.id, idx)}
                          </div>
                          <p className="session-title">{title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="roadmap-image-section">
        <div className="container">
          <h2 className="section-title">🗺️ TỔNG QUAN LỘ TRÌNH</h2>
          <div className="roadmap-image-wrapper" onClick={() => setIsImageZoomed(true)}>
            <img src={data.image} alt="Lộ trình học giao tiếp" loading="lazy" />
            <div className="zoom-hint">
              <span>🔍</span>
              <p>Click để phóng to</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="pricing-section">
        <div className="container">
          <h2 className="section-title">{data.pricing.title}</h2>
          <div className="pricing-wrapper">
            <div className="pricing-card">
              {data.pricing.items.map((item, i) => (
                <div key={i} className={`pricing-item ${item.highlight ? "highlight-pricing" : ""}`}>
                  <span className="pricing-icon">{item.icon}</span>
                  <div className="pricing-details">
                    <h4>{item.title}</h4>
                    <p className={item.highlight ? "price-tag" : ""}>{item.desc}</p>
                    {item.note && <p className="price-note">{item.note}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="consultation-form-wrapper">
              <div className="form-header">
                <h3>ĐĂNG KÝ TƯ VẤN</h3>
              </div>
              <form className="consultation-form">
                <div className="form-group">
                  <input type="text" name="name" placeholder="Họ và tên" required />
                </div>
                <div className="form-group">
                  <input type="tel" name="phone" placeholder="Số điện thoại" required />
                </div>
                <button type="submit" className="submit-btn">Gửi</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {isImageZoomed && (
        <div className="image-zoom-modal" onClick={() => setIsImageZoomed(false)}>
          <div className="zoom-modal-content">
            <button className="close-zoom-btn" onClick={() => setIsImageZoomed(false)}>✕</button>
            <img src={data.image} alt="Lộ trình chi tiết" className="zoomed-image" />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RoadmapGiaoTiep;