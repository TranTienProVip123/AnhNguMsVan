import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUser, FaComments, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import "../styles/AdminDashboard.css";

const Sidebar = ({ isSidebarCollapsed, setIsSidebarCollapsed }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <ul className="menu">
        <li>
          <Link
            to="/admin/users"
            className={`menu-item ${
              location.pathname === "/admin/users" ? "active" : ""
            }`}
          >
            <FaUser className="icon" />
            {!isSidebarCollapsed && <span>Quản lý người dùng</span>}
          </Link>
        </li>

        <li>
          <Link
            to="/admin/consultations"
            className={`menu-item ${
              location.pathname === "/admin/consultations" ? "active" : ""
            }`}
          >
            <FaComments className="icon" />
            {!isSidebarCollapsed && <span>Quản lý tư vấn</span>}
          </Link>
        </li>

        <li onClick={handleLogout} className="menu-item logout">
          <FaSignOutAlt className="icon" />
          {!isSidebarCollapsed && <span>Đăng xuất</span>}
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
