import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";
const Header = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handlePracticeClick = (e) => {
    e.preventDefault();

    if (!token) {
      alert("Bạn cần đăng nhập để sử dụng tính năng Luyện tập nhé!");

      // luu lai trang hien tai de login xong quay lai
      navigate("/login", { state: { from: "/practice" } });
    } else {
      navigate("/practice");
    }
  };

  const handleLogout = () => {
    logout(); //dung context de xoa token va user khoi localStorage khi logout
    navigate("/");
  };

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
          <img
            src="https://res.cloudinary.com/da6gk23w6/image/upload/v1763714007/logo_unkrfb.png"
            alt="Logo"
            className="logo"
          />
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
          <li onClick={closeMenu}>
            <Link to="/practice">Luyện tập</Link>
          </li>
        </ul>
      </nav>

      <div className="auth-buttons">
        {user ? (
          <div className="user-box">
            <span className="user-name">Xin chào, {user.name}</span>
            <button onClick={handleLogout}>Đăng xuất</button>
          </div>
        ) : (
          <>
            <Link to="/login">
              <button>Đăng nhập</button>
            </Link>
            <Link to="/login?mode=register">
              <button>Đăng ký</button>
            </Link>
          </>
        )}
      </div>
      {/* Overlay khi menu mở */}
      {isMenuOpen && <div className="overlay" onClick={closeMenu}></div>}
    </header>
  );
};

export default Header;
