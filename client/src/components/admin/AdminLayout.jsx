import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './adminlayout.css';

const AdminLayout = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="admin-layout">
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button className="toggle-sidebar" onClick={toggleSidebar}>
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>
        <div className="sidebar-content">
          <div className="admin-profile">
            <div className="admin-avatar">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="admin-info">
              <h3>{user?.username || 'Admin'}</h3>
              <p>{user?.email || 'admin@example.com'}</p>
            </div>
          </div>
          <nav className="admin-nav">
            <ul>
              <li>
                <Link 
                  to="/admin/dashboard" 
                  className={`nav-link-admin ${isActive('/admin/dashboard')}`}
                >
                  <i className="fas fa-tachometer-alt"></i>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/menu" 
                  className={`nav-link-admin ${isActive('/admin/menu')}`}
                >
                  <i className="fas fa-utensils"></i>
                  <span>Menu Management</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/orders" 
                  className={`nav-link-admin ${isActive('/admin/orders')}`}
                >
                  <i className="fas fa-shopping-cart"></i>
                  <span>Order Management</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/reservations" 
                  className={`nav-link-admin ${isActive('/admin/reservations')}`}
                >
                  <i className="fas fa-calendar-alt"></i>
                  <span>Reservations</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/users" 
                  className={`nav-link-admin ${isActive('/admin/users')}`}
                >
                  <i className="fas fa-users"></i>
                  <span>User Management</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/analytics" 
                  className={`nav-link-admin ${isActive('/admin/analytics')}`}
                >
                  <i className="fas fa-chart-bar"></i>
                  <span>Analytics</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/settings" 
                  className={`nav-link-admin ${isActive('/admin/settings')}`}
                >
                  <i className="fas fa-cog"></i>
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
      <div className="admin-main">
        <div className="admin-header">
          <div className="header-left">
            <button className="mobile-toggle" onClick={toggleSidebar}>
              <i className="fas fa-bars"></i>
            </button>
            <h1>Restaurant Management</h1>
          </div>
          <div className="header-right">
            <Link to="/" className="view-site-btn">
              <i className="fas fa-external-link-alt"></i>
              <span>View Site</span>
            </Link>
          </div>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
