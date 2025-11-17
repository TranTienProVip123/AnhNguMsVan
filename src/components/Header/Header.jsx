import react from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Header.css";
const Header = ({ user, register }) => {
  return (
      <header>
        <div className="header-left">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
          <nav>
            <ul>
              <li>Lộ trình học</li>
              <li>Khóa học</li>
              <li><Link to="/community">Cộng đồng</Link></li>
              <li><Link to="/practice">Luyện tập</Link></li>
            </ul>
          </nav>
        </div>

        <div className="auth-buttons">
          {user ? (
            <button>Xin chào, {user.name}</button>
          ) : (
            <>
              <button>Đăng nhập</button>
              <button>Đăng ký</button>
            </>
          )}
        </div>
      </header>
  );
};

export default Header;
