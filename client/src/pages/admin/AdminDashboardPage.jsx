import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import '../../assets/styles/admindashboardpage.css';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalReservations: 0,
    totalUsers: 0,
    totalRevenue: 0,
    popularItems: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [upcomingReservations, setUpcomingReservations] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [analyticsResponse, ordersResponse, reservationsResponse] = await Promise.all([
          api.get('/admin/analytics'),
          api.get('/orders?limit=5'),
          api.get('/reservations/all?status=confirmed&limit=5')
        ]);

        setStats({
          totalOrders: analyticsResponse.data.totalOrders || 0,
          pendingOrders: analyticsResponse.data.pendingOrders || 0,
          totalReservations: analyticsResponse.data.totalReservations || 0,
          totalUsers: analyticsResponse.data.totalCustomers || 0,
          totalRevenue: analyticsResponse.data.revenue || 0,
          popularItems: analyticsResponse.data.popularItems || []
        });

        setRecentOrders(ordersResponse.data || []);
        setUpcomingReservations(reservationsResponse.data || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="admin-dashboard loading">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h2>Dashboard Overview</h2>
      
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon orders-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-details">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.totalOrders}</p>
            <Link to="/admin/orders" className="stat-link">View All</Link>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pending-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-details">
            <h3>Pending Orders</h3>
            <p className="stat-value">{stats.pendingOrders}</p>
            <Link to="/admin/orders?status=pending" className="stat-link">View Pending</Link>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon reservations-icon">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className="stat-details">
            <h3>Reservations</h3>
            <p className="stat-value">{stats.totalReservations}</p>
            <Link to="/admin/reservations" className="stat-link">View All</Link>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon revenue-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-details">
            <h3>Total Revenue</h3>
            <p className="stat-value">{formatCurrency(stats.totalRevenue)}</p>
            <Link to="/admin/analytics" className="stat-link">View Analytics</Link>
          </div>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-card recent-orders">
          <div className="card-header">
            <h3>Recent Orders</h3>
            <Link to="/admin/orders" className="view-all">View All</Link>
          </div>
          <div className="card-content">
            {recentOrders.length > 0 ? (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order._id}>
                      <td>
                        <Link to={`/admin/orders/${order._id}`}>
                          #{order._id.substring(0, 8)}
                        </Link>
                      </td>
                      <td>{order.customer?.username || 'Guest'}</td>
                      <td>{formatDate(order.orderDate)}</td>
                      <td>{formatCurrency(order.totalAmount)}</td>
                      <td>
                        <span className={`status-badge ${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No recent orders</p>
            )}
          </div>
        </div>
        
        <div className="dashboard-card upcoming-reservations">
          <div className="card-header">
            <h3>Upcoming Reservations</h3>
            <Link to="/admin/reservations" className="view-all">View All</Link>
          </div>
          <div className="card-content">
            {upcomingReservations.length > 0 ? (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Guests</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingReservations.map(reservation => (
                    <tr key={reservation._id}>
                      <td>{reservation.customerName}</td>
                      <td>{formatDate(reservation.date)}</td>
                      <td>{reservation.timeSlot}</td>
                      <td>{reservation.guestCount}</td>
                      <td>
                        <span className={`status-badge ${reservation.status}`}>
                          {reservation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No upcoming reservations</p>
            )}
          </div>
        </div>
        
        <div className="dashboard-card popular-items">
          <div className="card-header">
            <h3>Popular Menu Items</h3>
            <Link to="/admin/menu" className="view-all">View Menu</Link>
          </div>
          <div className="card-content">
            {stats.popularItems.length > 0 ? (
              <ul className="popular-items-list">
                {stats.popularItems.map((item, index) => (
                  <li key={item._id || index} className="popular-item">
                    <div className="item-rank">{index + 1}</div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>{item.category}</p>
                    </div>
                    <div className="item-stats">
                      <div className="item-orders">
                        <span className="label">Orders:</span>
                        <span className="value">{item.orderCount}</span>
                      </div>
                      <div className="item-revenue">
                        <span className="label">Revenue:</span>
                        <span className="value">{formatCurrency(item.revenue)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
