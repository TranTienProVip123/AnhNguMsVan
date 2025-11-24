import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

const Header = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <header>
      <div className="header-left">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <nav>
          <ul>
            <li><Link to="/roadmap">Lộ trình học</Link></li>
            <li><Link to="/courses">Khóa học</Link></li>
            <li><Link to="/community">Cộng đồng</Link></li>
            <li onClick={handlePracticeClick}>Luyện tập</li>
          </ul>
        </nav>
      </div>

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
    </header>
  );
};

export default Header;
