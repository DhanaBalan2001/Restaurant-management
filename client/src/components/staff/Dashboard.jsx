import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StaffSidebar from './StaffSidebar.jsx';
import OrderManager from './OrderManager.jsx';
import { NotificationCenter } from '../ui';
import '../../styles/staff.css';

const StaffDashboard = () => {
  return (
    <div className="staff-dashboard">
      <StaffSidebar />
      <div className="staff-dashboard-content">
        <NotificationCenter />
        <Routes>
          <Route path="/" element={<OrderManager />} />
        </Routes>
      </div>
    </div>
  );
};

export default StaffDashboard;