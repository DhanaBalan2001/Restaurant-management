import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { OrderList, OrderDetails } from '../ui';
import io from 'socket.io-client';
import '../../styles/admin.css';


const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('https://restaurant-management-backend-5s96.onrender.com');
    setSocket(newSocket);

    newSocket.on('newOrder', () => {
      fetchOrders();
    });

    newSocket.on('orderStatusUpdate', () => {
      fetchOrders();
    });

    fetchOrders();

    return () => newSocket.close();
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
    try {
        const response = await axios.put(
            `https://restaurant-management-backend-5s96.onrender.com/api/orders/${orderId}/status`,
            { status },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (response.data) {
            fetchOrders(); // Refresh orders list
        }
    } catch (error) {
        console.error('Error updating order status:', error.response?.data || error.message);
    }
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
            onStatusUpdate={updateOrderStatus}
          />
        )}
      </div>
    </div>
  );
};

export default OrderManager;
