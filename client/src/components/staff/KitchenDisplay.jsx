import React, { useState, useEffect } from 'react';
import axios from 'axios';

const KitchenDisplay = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchKitchenOrders();
  }, []);

  const fetchKitchenOrders = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/orders/kitchen', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setOrders(response.data);
  };

  return (
    <div className="kitchen-display">
      <h2>Kitchen Orders</h2>
      <div className="orders-grid">
        {orders.map(order => (
          <div key={order._id} className={`order-card ${order.status}`}>
            <h3>Order #{order._id.slice(-6)}</h3>
            <div className="items-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <span>{item.quantity}x</span>
                  <span>{item.name}</span>
                  <span>{item.notes}</span>
                </div>
              ))}
            </div>
            <div className="order-actions">
              <button onClick={() => updateOrderStatus(order._id, 'preparing')}>
                Start Preparing
              </button>
              <button onClick={() => updateOrderStatus(order._id, 'ready')}>
                Mark Ready
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KitchenDisplay;
