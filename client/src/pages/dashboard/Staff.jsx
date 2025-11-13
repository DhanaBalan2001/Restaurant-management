import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/dashboard.css';

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const ordersResponse = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(ordersResponse.data);

        const tablesResponse = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/tables', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTables(tablesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`https://restaurant-management-backend-5s96.onrender.com/api/orders/${orderId}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      // Refresh orders after update
      const ordersResponse = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(ordersResponse.data);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Staff Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      
      <div className="active-orders">
        <h2>Orders</h2>
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <h3>Order #{order._id}</h3>
            <p>Table: {order.tableNumber}</p>
            <p>Items: {order.items.length}</p>
            <p>Status: {order.status}</p>
            <select 
              value={order.status}
              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="served">Served</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        ))}
      </div>

      <div className="table-status">
        <h2>Table Status</h2>
        <div className="tables-grid">
          {tables.map(table => (
            <div key={table._id} className={`table-card ${table.status}`}>
              <h3>Table {table.number}</h3>
              <p>Status: {table.status}</p>
              <p>Capacity: {table.capacity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
