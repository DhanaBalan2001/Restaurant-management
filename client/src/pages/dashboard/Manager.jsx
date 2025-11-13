import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/dashboard.css';

const ManagerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [reports, setReports] = useState({});
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [ordersRes, inventoryRes, menuRes, dailyReportRes, reservationsRes] = await Promise.all([
          axios.get('https://restaurant-management-backend-5s96.onrender.com/api/orders', { headers }),
          axios.get('https://restaurant-management-backend-5s96.onrender.com/api/inventory', { headers }),
          axios.get('https://restaurant-management-backend-5s96.onrender.com/api/menu', { headers }),
          axios.get('https://restaurant-management-backend-5s96.onrender.com/api/reports/daily', { headers }),
          axios.get('https://restaurant-management-backend-5s96.onrender.com/api/reservations', { headers })
        ]);

        setOrders(ordersRes.data);
        setInventory(inventoryRes.data);
        setMenuItems(menuRes.data);
        setReservations(reservationsRes.data);
        setReports({
          daily: dailyReportRes.data,
          monthly: { revenue: 0 },
          peakHours: { peak: 'N/A' }
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://restaurant-management-backend-5s96.onrender.com/api/order/${orderId}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      // Refresh orders
      const ordersRes = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/order', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(ordersRes.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReservationStatus = async (reservationId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `https://restaurant-management-backend-5s96.onrender.com/api/reservations/status/${reservationId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      // Refresh reservations data
      const reservationsRes = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/reservations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(reservationsRes.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateInventory = async (inventoryId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://restaurant-management-backend-5s96.onrender.com/api/inventory/update/${inventoryId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      // Refresh inventory
      const inventoryRes = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/inventory', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventory(inventoryRes.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Manager Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="reports-section">
        <h2>Reports Overview</h2>
        <div className="reports-grid">
          <div className="report-card">
            <h3>Daily Sales</h3>
            <p>Total: ${reports.daily?.total || 0}</p>
          </div>
          <div className="report-card">
            <h3>Monthly Performance</h3>
            <p>Revenue: ${reports.monthly?.revenue || 0}</p>
          </div>
          <div className="report-card">
            <h3>Peak Hours</h3>
            <p>Busiest Time: {reports.peakHours?.peak || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="reservations-section">
        <h2>Table Reservations</h2>
        <div className="reservations-grid">
          {reservations.map(reservation => (
            <div key={reservation._id} className="reservation-card">
              <p>Reservation Id#{reservation._id}</p>
              <p>Customer: {reservation.customerName}</p>
              <p>Date: {new Date(reservation.date).toLocaleDateString()}</p>
              <p>Time: {reservation.time}</p>
              <p>Guests: {reservation.numberOfGuests}</p>
              <p>Status: {reservation.status}</p>
              <div className="reservation-actions">
                <button 
                  onClick={() => handleReservationStatus(reservation._id, 'confirmed')}
                  className="confirm-button"
                >
                  Confirm
                </button>
                <button 
                  onClick={() => handleReservationStatus(reservation._id, 'cancelled')}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="current-orders">
        <h2>Current Orders</h2>
        <div className="orders-grid">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <p>Order #{order._id}</p>
              <p>Status: {order.status}</p>
              <p>Total: ${order.total}</p>
              <p>Items: {order.items?.length || 0}</p>
              <select 
                value={order.status}
                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="inventory-management">
        <h2>Inventory Management</h2>
        <div className="inventory-grid">
          {inventory.map(item => (
            <div key={item._id} className="inventory-card">
              <p>{item.name}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Status: {item.quantity < item.minimumRequired ? 'Low Stock' : 'In Stock'}</p>
              <input 
                type="number" 
                value={item.quantity}
                onChange={(e) => handleUpdateInventory(item._id, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="menu-management">
        <h2>Menu Items</h2>
        <div className="menu-grid">
          {menuItems.map(item => (
            <div key={item._id} className="menu-card">
              <p>{item.name}</p>
              <p>Price: ${item.price}</p>
              <p>Category: {item.category}</p>
              <p>Status: {item.available ? 'Available' : 'Unavailable'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
