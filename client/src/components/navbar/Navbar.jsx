import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const location = useLocation();
  const username = localStorage.getItem('username');

  // Hide navbar for admin, staff, login and register routes
  if (location.pathname.startsWith('/admin') || 
      location.pathname.startsWith('/staff') || 
      location.pathname === '/login' || 
      location.pathname === '/register') {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Fine Dining</Link>
      </div>
      
      <div className="nav-menu">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/menu" className="nav-item">Menu</Link>
        <Link to="/reservation" className="nav-item">Reservation</Link>
        
        {username ? (
          <>
            <span className="nav-item">Welcome, {username}</span>
            <span 
              className="nav-item" 
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
            >
              Logout
            </span>
          </>
        ) : (
          <>
            <Link to="/register" className="nav-item">Register</Link>
            <Link to="/login" className="nav-item">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
