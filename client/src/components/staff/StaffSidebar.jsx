import React from 'react';
import { NavLink } from 'react-router-dom';

const StaffSidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="staff-sidebar">
      <h2>Staff Dashboard</h2>
      <nav>
        <NavLink to="/staff" end>Orders</NavLink>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>
    </div>
  );
};

export default StaffSidebar;