import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './navbar.css';
import logoImage from '../../assets/Fine Dine-in.png';

const Navbar = () => {
  const { isAuth, user, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src={logoImage} alt="Restaurant Logo" height="40" className="me-2" />
          <span>Fine Dine-In</span>
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/')}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/menu" 
                className={`nav-link ${isActive('/menu')}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Menu
              </Link>
            </li>
            
            {isAuth && user.role === 'customer' && (
              <>
                <li className="nav-item">
                  <Link 
                    to="/orders" 
                    className={`nav-link ${isActive('/orders')}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/reservations" 
                    className={`nav-link ${isActive('/reservations')}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Reservations
                  </Link>
                </li>
              </>
            )}
            
            {isAuth && user.role === 'admin' && (
              <li className="nav-item">
                <Link 
                  to="/admin/dashboard" 
                  className={`nav-link ${isActive('/admin/dashboard')}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
            
            {isAuth && user.role === 'staff' && (
              <li className="nav-item">
                <Link 
                  to="/staff/dashboard" 
                  className={`nav-link ${isActive('/staff/dashboard')}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Staff Dashboard
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center">
            {isAuth ? (
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <span className="fw-bold me-2">{user.username}</span>
                  <span className="badge bg-secondary">{user.role}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-outline-danger">
                  Logout
                </button>
              </div>
            ) : (
              <div className="d-flex">
                <Link 
                  to="/login" 
                  className="btn btn-outline-primary me-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;