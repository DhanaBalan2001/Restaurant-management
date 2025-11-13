import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/customer.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/orders/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-history">
      <h2>Order History</h2>
      <div className="orders-grid">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <h3>Order #{order._id.slice(-6)}</h3>
              <span className={`status ${order.status}`}>{order.status}</span>
            </div>
            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <span>{item.quantity}x {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="order-footer">
              <span>Total: ${order.total.toFixed(2)}</span>
              <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
