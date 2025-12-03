import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfileClick = () => {
    setIsProfileOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header>
      <button
        className={`hamburger ${isMenuOpen ? "menu-open" : ""}`}
        onClick={toggleMenu}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        <span className={isMenuOpen ? "active" : ""}></span>
        <span className={isMenuOpen ? "active" : ""}></span>
        <span className={isMenuOpen ? "active" : ""}></span>
      </button>

      <div className="logo-container">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/da6gk23w6/image/upload/v1763714007/logo_unkrfb.png"
            alt="Logo"
            className="logo"
          />
        </Link>
      </div>

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
            <Link to="/contact">Liên hệ</Link>
          </li>
          <li onClick={closeMenu}>
            <Link to="/practice">Luyện tập</Link>
          </li>

          {!user && (
            <li className="nav-register-btn" onClick={closeMenu}>
              <Link to="/login?mode=register">
                <button className="mobile-register-btn">Đăng ký</button>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="auth-buttons">
        {user ? (
          <div className="user-box" ref={profileRef}>
            <button className="avatar-btn" onClick={handleProfileClick} aria-label="Tùy chọn tài khoản">
              <span className="avatar-fallback">
                {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </button>
            {isProfileOpen && (
              <div className="profile-menu">
                <div className="profile-top">
                  <div className="avatar-large">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="profile-info">
                    <div className="profile-name">{user.name || "Người dùng"}</div>
                    <div className="profile-email">{user.email}</div>
                  </div>
                </div>
                <div className="profile-actions">
                  <button onClick={() => navigate("/profile")}>Xem hồ sơ</button>
                  <button onClick={handleLogout}>Đăng xuất</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login">
              <button className="login-button">Đăng nhập</button>
            </Link>
              <button className="register-button">Đăng ký</button>
          </>
        )}
      </div>

      {isMenuOpen &&
        <div className="overlay" onClick={closeMenu}></div>
      }
    </header>
  );
};

export default Header;
