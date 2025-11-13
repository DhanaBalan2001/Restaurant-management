import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../assets/styles/homepage.css';

const HomePage = () => {
  const { isAuth, user } = useAuth();

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Our Restaurant</h1>
          <p>Experience the finest dining with our exquisite menu and exceptional service</p>
          
          {isAuth ? (
            <div className="cta-buttons">
              <Link to="/menu" className="cta-button primary">View Menu</Link>
              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" className="cta-button secondary">Admin Dashboard</Link>
              )}
              {user?.role === 'staff' && (
                <Link to="/staff/dashboard" className="cta-button secondary">Staff Dashboard</Link>
              )}
            </div>
          ) : (
            <div className="cta-buttons">
              <Link to="/menu" className="cta-button primary">View Menu</Link>
              <Link to="/login" className="cta-button secondary">Login</Link>
              <Link to="/register" className="cta-button outline">Register</Link>
            </div>
          )}
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🍽️</div>
              <h3>Exquisite Cuisine</h3>
              <p>Enjoy our chef's special dishes made with the finest ingredients</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🥂</div>
              <h3>Premium Experience</h3>
              <p>Immerse yourself in an atmosphere of luxury and comfort</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Easy Ordering</h3>
              <p>Order online with our simple and intuitive interface</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="home-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Restaurant Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
