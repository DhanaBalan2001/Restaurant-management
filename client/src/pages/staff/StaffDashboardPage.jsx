import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { socket } from '../../services/socket';
import '../../assets/styles/staffdashboardpage.css';

const StaffDashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    occupiedTables: 0,
    availableTables: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    setupSocketListeners();

    return () => {
      socket.off('new_order');
      socket.off('order_status_update');
      socket.off('table_status_update');
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, ordersResponse] = await Promise.all([
        api.get('/staff/stats'),
        api.get('/staff/orders/active')
      ]);

      setStats(statsResponse.data);
      setRecentOrders(ordersResponse.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data');
      setLoading(false);
      toast.error('Failed to load dashboard data');
    }
  };

  const setupSocketListeners = () => {
    socket.on('new_order', (order) => {
      addNotification(`New order received: #${order.orderNumber}`);
      fetchDashboardData();
    });

    socket.on('order_status_update', (update) => {
      addNotification(`Order #${update.orderNumber} status: ${update.status}`);
      fetchDashboardData();
    });

    socket.on('table_status_update', () => {
      fetchDashboardData();
    });
  };

  const addNotification = (message) => {
    setRecentNotifications(prev => [
      { id: Date.now(), message, timestamp: new Date() },
      ...prev
    ].slice(0, 5));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="staff-dashboard loading">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="staff-dashboard error">
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="staff-dashboard">
      <div className="dashboard-header">
        <h2>Staff Dashboard</h2>
        <div className="header-actions">
          <div className="current-time">{new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon orders-icon">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <div className="stat-details">
            <h3>Active Orders</h3>
            <p className="stat-value">{stats.activeOrders}</p>
            <Link to="/staff/orders" className="stat-link">View Orders</Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-details">
            <h3>Pending Orders</h3>
            <p className="stat-value">{stats.pendingOrders}</p>
            <Link to="/staff/orders?status=pending" className="stat-link">View Pending</Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon tables-icon">
            <i className="fas fa-chair"></i>
          </div>
          <div className="stat-details">
            <h3>Available Tables</h3>
            <p className="stat-value">{stats.availableTables}</p>
            <Link to="/staff/tables" className="stat-link">Manage Tables</Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon kitchen-icon">
            <i className="fas fa-utensils"></i>
          </div>
          <div className="stat-details">
            <h3>Kitchen Orders</h3>
            <p className="stat-value">{stats.activeOrders}</p>
            <Link to="/staff/kitchen" className="stat-link">Kitchen Display</Link>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card recent-orders">
          <div className="card-header">
            <h3>Recent Orders</h3>
            <Link to="/staff/orders" className="view-all">View All</Link>
          </div>
          <div className="card-content">
            {recentOrders.length > 0 ? (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Items</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order._id}>
                      <td>#{order.orderNumber}</td>
                      <td>{order.items.length} items</td>
                      <td>{formatTime(order.createdAt)}</td>
                      <td>
                        <span className={`status-badge ${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>${order.totalAmount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No recent orders</p>
            )}
          </div>
        </div>

        <div className="dashboard-card notifications">
          <div className="card-header">
            <h3>Recent Notifications</h3>
          </div>
          <div className="card-content">
            {recentNotifications.length > 0 ? (
              <div className="notifications-list">
                {recentNotifications.map(notification => (
                  <div key={notification.id} className="notification-item">
                    <span className="notification-message">{notification.message}</span>
                    <span className="notification-time">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No notifications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardPage;