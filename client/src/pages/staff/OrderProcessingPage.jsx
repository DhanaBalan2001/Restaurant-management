import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import '../../assets/styles/orderprocessing.css';

const OrderProcessingPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/staff/orders/active`);
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/staff/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  return (
    <div className="order-processing">
      <div className="filters">
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <div className="orders-list">
        {orders.map(order => (
          <div 
            key={order._id} 
            className={`order-item ${order.status}`}
            onClick={() => setSelectedOrder(order)}
          >
            <div className="order-header">
              <span className="order-number">#{order.orderNumber}</span>
              <span className="order-time">{formatTime(order.createdAt)}</span>
              <span className={`order-status ${order.status}`}>
                {order.status}
              </span>
            </div>

            <div className="order-summary">
              <span>{order.items.length} items</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
      {selectedOrder && (
        <div className="order-details">
          <h3>Order Details</h3>
          <div className="order-info">
            <p>Order #: {selectedOrder.orderNumber}</p>
            <p>Status: {selectedOrder.status}</p>
            <p>Time: {formatTime(selectedOrder.createdAt)}</p>
            <p>Total: ${selectedOrder.totalAmount.toFixed(2)}</p>
          </div>

          <div className="order-items">
            {selectedOrder.items.map((item, index) => (
              <div key={index} className="item">
                <span className="item-quantity">{item.quantity}x</span>
                <span className="item-name">{item.name}</span>
                <span className="item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="order-actions">
            {getAvailableActions(selectedOrder.status).map(action => (
              <button
                key={action.status}
                onClick={() => handleStatusChange(selectedOrder._id, action.status)}
                className={action.className}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const getAvailableActions = (currentStatus) => {
  switch (currentStatus) {
    case 'pending':
      return [
        { status: 'confirmed', label: 'Confirm Order', className: 'confirm-btn' },
        { status: 'cancelled', label: 'Cancel Order', className: 'cancel-btn' }
      ];
    case 'confirmed':
      return [
        { status: 'preparing', label: 'Start Preparing', className: 'prepare-btn' }
      ];
    case 'preparing':
      return [
        { status: 'ready', label: 'Mark Ready', className: 'ready-btn' }
      ];
    case 'ready':
      return [
        { status: 'delivered', label: 'Mark Delivered', className: 'deliver-btn' }
      ];
    default:
      return [];
  }
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default OrderProcessingPage;