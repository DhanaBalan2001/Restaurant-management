import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import '../../assets/styles/analyticspage.css';

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [menuPerformance, setMenuPerformance] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [salesResponse, menuResponse, peakResponse] = await Promise.all([
        api.get('/reports/monthly', { 
          params: { 
            month: new Date().getMonth() + 1, 
            year: new Date().getFullYear() 
          } 
        }),
        api.get('/reports/menu-metrics', {
          params: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
          }
        }),
        api.get('/reports/peak-hours', {
          params: { date: new Date().toISOString().split('T')[0] }
        })
      ]);

      setSalesData(salesResponse.data);
      setMenuPerformance(menuResponse.data.menuMetrics || []);
      setPeakHours(peakResponse.data.peakHours || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load analytics data');
      setLoading(false);
      toast.error('Failed to load analytics data');
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="analytics-page loading">
        <div className="spinner"></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-page error">
        <p>{error}</p>
        <button onClick={fetchAnalyticsData} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h2>Analytics & Reports</h2>
      </div>
      
      <div className="date-range-filter">
        <div className="filter-group">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateChange}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateChange}
          />
        </div>
        <button 
          className="apply-filter-btn"
          onClick={fetchAnalyticsData}
        >
          Apply Filter
        </button>
      </div>
      
      <div className="analytics-grid">
        <div className="analytics-card sales-overview">
          <h3>Sales Overview</h3>
          <div className="sales-stats">
            <div className="stat-item">
              <div className="stat-value">
                {salesData ? formatCurrency(salesData.monthlySales.reduce((sum, day) => sum + day.dailySales, 0)) : '$0.00'}
              </div>
              <div className="stat-label">Total Revenue</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {salesData ? salesData.monthlySales.reduce((sum, day) => sum + day.orderCount, 0) : 0}
              </div>
              <div className="stat-label">Total Orders</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {salesData && salesData.monthlySales.length > 0 
                  ? formatCurrency(salesData.monthlySales.reduce((sum, day) => sum + day.dailySales, 0) / 
                      salesData.monthlySales.reduce((sum, day) => sum + day.orderCount, 0))
                  : '$0.00'
                }
              </div>
              <div className="stat-label">Average Order Value</div>
            </div>
          </div>
          
          <div className="sales-chart">
            <h4>Daily Sales</h4>
            <div className="chart-container">
              {salesData && salesData.monthlySales.map((day, index) => (
                <div key={index} className="chart-bar-container">
                  <div 
                    className="chart-bar"
                    style={{ 
                      height: `${(day.dailySales / Math.max(...salesData.monthlySales.map(d => d.dailySales))) * 100}%` 
                    }}
                  >
                    <span className="bar-value">{formatCurrency(day.dailySales)}</span>
                  </div>
                  <div className="bar-label">{day._id}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="analytics-card menu-performance">
          <h3>Menu Performance</h3>
          <div className="menu-performance-list">
            <div className="list-header">
              <div className="item-name">Item</div>
              <div className="item-orders">Orders</div>
              <div className="item-revenue">Revenue</div>
            </div>
            {menuPerformance.length > 0 ? (
              <div className="list-body">
                {menuPerformance.slice(0, 10).map((item, index) => (
                  <div key={index} className="list-item">
                    <div className="item-name">
                      <span className="item-rank">{index + 1}</span>
                      <span>{item.menuInfo?.[0]?.name || `Item #${index + 1}`}</span>
                    </div>
                    <div className="item-orders">{item.totalQuantity}</div>
                    <div className="item-revenue">{formatCurrency(item.totalRevenue)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">No menu performance data available</div>
            )}
          </div>
        </div>
        
        <div className="analytics-card peak-hours">
          <h3>Peak Hours Analysis</h3>
          <div className="peak-hours-chart">
            {peakHours.length > 0 ? (
              <div className="chart-container">
                {peakHours.map((hour, index) => (
                  <div key={index} className="chart-bar-container">
                    <div 
                      className="chart-bar"
                      style={{ 
                        height: `${(hour.orderCount / Math.max(...peakHours.map(h => h.orderCount))) * 100}%` 
                      }}
                    >
                      <span className="bar-value">{hour.orderCount} orders</span>
                    </div>
                    <div className="bar-label">{hour.timeSlot}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">No peak hours data available</div>
            )}
          </div>
        </div>
        
        <div className="analytics-card revenue-trends">
          <h3>Revenue Trends</h3>
          {salesData && salesData.revenueTrends ? (
            <div className="trends-chart">
              <div className="chart-container">
                {salesData.revenueTrends.map((trend, index) => (
                  <div key={index} className="chart-bar-container">
                    <div 
                      className="chart-bar"
                      style={{ 
                        height: `${(trend.revenue / Math.max(...salesData.revenueTrends.map(t => t.revenue))) * 100}%` 
                      }}
                    >
                      <span className="bar-value">{formatCurrency(trend.revenue)}</span>
                    </div>
                    <div className="bar-label">Week {trend._id.week}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-data">No revenue trends data available</div>
          )}
        </div>
      </div>
      
      <div className="export-section">
        <button className="export-btn">
          Export Reports
        </button>
      </div>
    </div>
  );
};

export default AnalyticsPage;
