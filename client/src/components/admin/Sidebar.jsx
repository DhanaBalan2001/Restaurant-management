import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored authentication tokens or user data
    localStorage.removeItem('authToken');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="admin-sidebar">
      <div className="logo">Restaurant Admin</div>
      <nav>
        <NavLink to="/admin">Overview</NavLink>
        <NavLink to="/admin/menu">Menu</NavLink>
        <NavLink to="/admin/orders">Orders</NavLink>
        <NavLink to="/admin/reservations">Reservations</NavLink>
        <NavLink to="/admin/inventory">Inventory</NavLink>
        <NavLink to="/admin/tables">Tables</NavLink>
        <NavLink to="/admin/branches">Branches</NavLink>
        <NavLink to="/admin/customers">Customers</NavLink>
        <NavLink to="/admin/staffs">Staffs</NavLink>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </nav>
    </div>
  );
};

export default Sidebar;