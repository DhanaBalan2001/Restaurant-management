import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Overview from './Overview';
import MenuManager from './MenuManager';
import OrderManager from './OrderManager';
import ReservationManager from './ReservationManager';
import InventoryManager from './InventoryManager';
import TableManager from './TableManager';
import BranchManager from './BranchManager';
import CustomerStats from './CustomerStats';
import StaffManager from './StaffManager';
import NotificationCenter from '../ui/NotificationCenter';
import '../../styles/admin.css';


const Dashboard = () => {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/menu" element={<MenuManager />} />
          <Route path="/orders" element={<OrderManager />} />
          <Route path="/reservations" element={<ReservationManager />} />
          <Route path="/inventory" element={<InventoryManager />} />
          <Route path="/tables" element={<TableManager />} />
          <Route path="/branches" element={<BranchManager />} />
          <Route path="/customers" element={<CustomerStats />} />
          <Route path="/staffs" element={<StaffManager />} />
        </Routes>
      </div>
      <div className="dashboard-notifications">
        <NotificationCenter />
      </div>
    </div>
  );
};

export default Dashboard;