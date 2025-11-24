import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header>
      {/* Hamburger Button */}
      <button 
        className="hamburger" 
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className={isMenuOpen ? "active" : ""}></span>
        <span className={isMenuOpen ? "active" : ""}></span>
        <span className={isMenuOpen ? "active" : ""}></span>
      </button>

      {/* Logo - Căn giữa trên mobile */}
      <div className="logo-container">
        <Link to="/">
          <img src="https://res.cloudinary.com/da6gk23w6/image/upload/v1763714007/logo_unkrfb.png" alt="Logo" className="logo" />
        </Link>
      </div>

      {/* Navigation - Ẩn/hiện với hamburger */}
      <nav className={isMenuOpen ? "nav-open" : ""}>
        <ul>
          <li onClick={closeMenu}>
            <Link to="/">Trang chủ</Link>
          </li>
          <li onClick={closeMenu}>
            <Link to="/about">Giới thiệu</Link>
          </li>
          <li onClick={closeMenu}>
            <Link to="/roadmap/giao-tiep">Lộ trình Giao tiếp</Link>
          </li>
          <li onClick={closeMenu}>
            <Link to="/roadmap/toeic">Lộ trình TOEIC</Link>
          </li>
          <li onClick={closeMenu}>
            <Link to="/contact">Liên hệ</Link>
          </li>
        </ul>
      </nav>

      {/* Auth Buttons */}
      <div className="auth-buttons">
        <button>Đăng nhập</button>
        <button>Đăng ký</button>
      </div>

      {/* Overlay khi menu mở */}
      {isMenuOpen && <div className="overlay" onClick={closeMenu}></div>}
    </header>
  );
};

export default Header;