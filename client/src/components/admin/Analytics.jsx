import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, LineChart, PieChart } from '../ui/charts';

const Analytics = () => {
  const [data, setData] = useState({
    salesData: [],
    categoryData: [],
    peakHours: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const token = localStorage.getItem('token');
    const [sales, categories, peaks] = await Promise.all([
      axios.get('https://restaurant-management-backend-5s96.onrender.com/api/reports/sales', {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get('https://restaurant-management-backend-5s96.onrender.com/api/reports/categories', {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get('http://localhost:5000/api/reports/peak-hours', {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    setData({
      salesData: sales.data,
      categoryData: categories.data,
      peakHours: peaks.data
    });
  };

  return (
    <div className="analytics-dashboard">
      <div className="chart-grid">
        <div className="chart-container">
          <h3>Sales Trends</h3>
          <LineChart data={data.salesData} />
        </div>
        <div className="chart-container">
          <h3>Category Performance</h3>
          <PieChart data={data.categoryData} />
        </div>
        <div className="chart-container">
          <h3>Peak Hours</h3>
          <BarChart data={data.peakHours} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
