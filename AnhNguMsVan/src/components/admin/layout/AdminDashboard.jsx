import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import HeaderAdmin from "./HeaderAdmin";
import Sidebar from "./Sidebar";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={`admin-dashboard ${isSidebarCollapsed ? "collapsed" : ""}`}>
      {/* Sidebar */}
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      {/* Content */}
      <div className="main-content">
        <HeaderAdmin />
        <div className="dashboard-content">
          {/* Render các route con */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
