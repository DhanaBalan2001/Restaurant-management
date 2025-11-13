import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { OrderList, OrderDetails } from '../ui';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setOrders(response.data);
  };

  const updateOrderStatus = async (orderId, status) => {
    const token = localStorage.getItem('token');
    await axios.put(`https://restaurant-management-backend-5s96.onrender.com/api/orders/${orderId}/status`, 
      { status },
      { headers: { Authorization: `Bearer ${token}` }}
    );
    fetchOrders();
  };

  return (
    <div className="order-manager">
      <h2>Order Management</h2>
      <div className="order-layout">
        <OrderList 
          orders={orders}
          onSelect={setSelectedOrder}
          onStatusUpdate={updateOrderStatus}
        />
        {selectedOrder && (
          <OrderDetails 
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
