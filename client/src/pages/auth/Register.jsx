import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    address: '',
    role: 'client'
  });

  const detectRole = (email) => {
    if (email.endsWith('@admin.restaurant.com')) {
      return 'admin';
    } else if (email.endsWith('@staff.restaurant.com')) {
      return 'staff';
    } else {
      return 'customer';
    }
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    const detectedRole = detectRole(email);
    setFormData({
      ...formData,
      email: email,
      role: detectedRole
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://restaurant-management-backend-5s96.onrender.com/api/auth/register', formData);
      localStorage.setItem('token', response.data.token);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            autoComplete="current-password"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleEmailChange}
          />
          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <textarea
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
          <button type="submit">Register</button>
          <button type="button" onClick={() => navigate('/login')}>Existing User? Login Here!</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
