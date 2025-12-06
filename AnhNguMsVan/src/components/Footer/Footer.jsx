import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1: Brand & Motto */}
        <div className="footer-column brand-column">
          <div className="footer-logo">
            <img
              src="https://res.cloudinary.com/da6gk23w6/image/upload/v1763714007/logo_unkrfb.png"
              alt="English Ms Vân Logo"
            />
          </div>
          <h2 className="footer-brand">
            Anh Ngữ<br />
            <span>Ms Vân</span>
          </h2>
          <p className="footer-motto">
            Nỗ lực học tập<br />
            Đón nhận thành công.
          </p>
        </div>

        {/* Column 2: Contact Info */}
        <div className="footer-column contact-column">
          <h3 className="footer-title">Thông tin liên hệ</h3>
          <ul className="footer-contact-list">
            <li>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div className="contact-details">
                  <p className="contact-label">Hotline/Zalo</p>
                  <a href="tel:0569551216" className="contact-value">
                    0569 551 216
                  </a>
                </div>
              </div>
            </li>
            <li>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div className="contact-details">
                  <p className="contact-label">Email</p>
                  <a href="mailto:vaniuh2002@gmail.com" className="contact-value">
                    anhngumsvan9@gmail.com
                  </a>
                </div>
              </div>
            </li>
            {/* <li>
              <div className="contact-item">
                <span className="contact-icon">⏰</span>
                <div className="contact-details">
                  <p className="contact-label">Giờ làm việc</p>
                  <p className="contact-value">
                    8:00 - 22:00 (Hằng ngày)
                  </p>
                </div>
              </div>
            </li> */}
          </ul>
        </div>

        {/* Column 3: Quick Links */}
        <div className="footer-column links-column">
          <h3 className="footer-title">Liên kết nhanh</h3>
          <ul className="footer-links">
            <li>
              <Link to="/">
                <span className="link-arrow">→</span>
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/roadmap/giao-tiep">
                <span className="link-arrow">→</span>
                Lộ trình Giao tiếp
              </Link>
            </li>
            <li>
              <Link to="/roadmap/toeic">
                <span className="link-arrow">→</span>
                Lộ trình TOEIC
              </Link>
            </li>
            <li>
              <Link to="/about">
                <span className="link-arrow">→</span>
                Về Ms Vân
              </Link>
            </li>
            <li>
              <Link to="/reviews">
                <span className="link-arrow">→</span>
                Học viên đánh giá
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Social Media */}
        <div className="footer-column social-column">
          <h3 className="footer-title">Follow</h3>
          <p className="social-description">
            Kết nối với mình để nhận thêm nhiều tài liệu học tập miễn phí!
          </p>
          <div className="footer-social">
            <a
              href="https://www.tiktok.com/@nguyencamvan900"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link tiktok"
              aria-label="TikTok"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              <span>TikTok</span>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61555710655421"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link facebook"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </a>
            <a
              href="https://www.youtube.com/@nguyencamvan900"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link youtube"
              aria-label="YouTube"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>YouTube</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="copyright">
            © {currentYear} <strong>Anh Ngữ Ms Vân</strong>. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Chính sách bảo mật</Link>
            <span className="separator">|</span>
            <Link to="/terms-of-service">Điều khoản sử dụng</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;