import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerSidebar from './CustomerSidebar';
import MenuView from './MenuView';
import TableReservation from './TableReservation';
import OrderHistory from './OrderHistory';
import { NotificationCenter } from '../ui';

const CustomerDashboard = () => {
  return (
    <div className="dashboard">
      <CustomerSidebar />
      <div className="dashboard-content">
        <NotificationCenter />
        <Routes>
          <Route path="/" element={<MenuView />} />
          <Route path="/reservations" element={<TableReservation />} />
          <Route path="/orders" element={<OrderHistory />} />
        </Routes>
      </div>
    </div>
  );
};

export default CustomerDashboard;
