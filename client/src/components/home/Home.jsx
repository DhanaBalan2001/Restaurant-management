import React from 'react';
import './home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to Fine Dining</h1>
        <p>Experience the art of culinary excellence</p>
        <button className="cta-button">Book a Table</button>
      </div>

      <div className="features-section">
        <div className="feature">
          <h3>Special Menu</h3>
          <p>Explore our chef's specially curated dishes</p>
        </div>
        <div className="feature">
          <h3>Online Booking</h3>
          <p>Reserve your table with just a few clicks</p>
        </div>
        <div className="feature">
          <h3>Private Events</h3>
          <p>Perfect venue for your special occasions</p>
        </div>
      </div>

      <div className="about-section">
        <h2>Our Story</h2>
        <p>Established in 2024, we bring you the finest dining experience with our passionate chefs and carefully selected ingredients.</p>
      </div>
    </div>
  );
};

export default Home;
