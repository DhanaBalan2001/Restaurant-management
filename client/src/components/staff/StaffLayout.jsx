import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import './stafflayout.css';

const StaffLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="staff-layout">
      <div className={`staff-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Staff Dashboard</h2>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>
        
        <nav className="staff-nav">
          <Link to="/staff/dashboard" className={`nav-link-staff ${isActive('/staff/dashboard')}`}>
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </Link>
          <Link to="/staff/kitchen" className={`nav-link-staff ${isActive('/staff/kitchen')}`}>
            <i className="fas fa-utensils"></i>
            <span>Kitchen Display</span>
          </Link>
          <Link to="/staff/tables" className={`nav-link-staff ${isActive('/staff/tables')}`}>
            <i className="fas fa-chair"></i>
            <span>Table Management</span>
          </Link>
          <Link to="/staff/orders" className={`nav-link-staff ${isActive('/staff/orders')}`}>
            <i className="fas fa-clipboard-list"></i>
            <span>Order Processing</span>
          </Link>
          <button onClick={handleLogout} className="nav-link-staff">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </nav>
      </div>

      <div className="staff-main">
        <Outlet />
      </div>
    </div>
  );
};

export default StaffLayout;