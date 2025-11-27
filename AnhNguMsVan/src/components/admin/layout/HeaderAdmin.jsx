import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "../styles/AdminDashboard.css";

const HeaderAdmin = () => {
  const { logout, auth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const user = auth?.user || JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header className="header-admin">
      <div className="header-left">
        <h1>Xin chào, {user?.name || "Admin"} 👋</h1>
      </div>
      <div className="header-right">
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Đăng xuất
        </button>
      </div>
    </header>
  );
};

export default HeaderAdmin;
