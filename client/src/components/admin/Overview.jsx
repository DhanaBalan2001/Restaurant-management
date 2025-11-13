import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DashboardCard, RevenueChart } from '../ui';

const Overview = () => {
  const [stats, setStats] = useState({
    dailyRevenue: 0,
    monthlyRevenue: 0,
    totalOrders: 0,
    pendingReservations: 0,
    revenueData: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    try {
      // Fetch daily stats
      const dailyResponse = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/reports/daily', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch monthly stats
      const monthlyResponse = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/reports/monthly', {
        params: {
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear()
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch orders count
      const ordersResponse = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch pending reservations
      const reservationsResponse = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/reservations/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats({
        dailyRevenue: dailyResponse.data.salesSummary?.totalSales || 0,
        monthlyRevenue: monthlyResponse.data.monthlySales.reduce((acc, day) => acc + day.dailySales, 0),
        totalOrders: ordersResponse.data.length,
        pendingReservations: reservationsResponse.data.length,
        revenueData: monthlyResponse.data.monthlySales
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="dashboard-overview">
      <h1>Dashboard Overview</h1>
      <div className="stats-grid">
        <DashboardCard
          title="Daily Revenue"
          value={`${stats.dailyRevenue.toFixed(2)}`}
          icon="money"
        />
        <DashboardCard
          title="Monthly Revenue"
          value={`${stats.monthlyRevenue.toFixed(2)}`}
          icon="chart"
        />
        <DashboardCard
          title="Total Orders"
          value={stats.totalOrders}
          icon="orders"
        />
        <DashboardCard
          title="Pending Reservations"
          value={stats.pendingReservations}
          icon="calendar"
        />
      </div>
      <RevenueChart data={stats.revenueData} />
    </div>
  );
};

export default Overview;
