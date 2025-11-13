import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { socket } from '../../services/socket';
import '../../assets/styles/kitchendisplaypage.css';

const KitchenDisplayPage = () => {
  const [orders, setOrders] = useState({
    pending: [],
    preparing: [],
    ready: []
  });

  const handleNewOrder = (order) => {
    setOrders(prev => ({
      ...prev,
      pending: [...prev.pending, order]
    }));
    toast.info(`New order received: #${order.orderNumber}`);
  };

  const handleOrderUpdate = (updatedOrder) => {
    fetchOrders(); // Refresh orders after update
  };

  useEffect(() => {
    fetchOrders();
    
    socket.on('new_order', handleNewOrder);
    socket.on('order_update', handleOrderUpdate);

    return () => {
      socket.off('new_order');
      socket.off('order_update');
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/kitchen/active-orders');
      const groupedOrders = groupOrdersByStatus(response.data);
      setOrders(groupedOrders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/staff/orders/${orderId}/status`, { status: newStatus });
      
      // Immediately update local state for better UX
      setOrders(prev => {
        const updatedOrder = {...prev[newStatus === 'ready' ? 'preparing' : 'pending'].find(o => o._id === orderId), status: newStatus};
        
        return {
          ...prev,
          [newStatus === 'ready' ? 'preparing' : 'pending']: prev[newStatus === 'ready' ? 'preparing' : 'pending'].filter(o => o._id !== orderId),
          [newStatus]: [...prev[newStatus], updatedOrder]
        };
      });
      
      fetchOrders(); // Fetch fresh data from server
      toast.success(`Order marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  return (
    <div className="kitchen-display">
      <div className="orders-grid">
        <div className="orders-column pending">
          <h2>New Orders</h2>
          {orders.pending.map(order => (
            <OrderCard 
              key={order._id}
              order={order}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>

        <div className="orders-column preparing">
          <h2>Preparing</h2>
          {orders.preparing.map(order => (
            <OrderCard 
              key={order._id}
              order={order}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>

        <div className="orders-column ready">
          <h2>Ready</h2>
          {orders.ready.map(order => (
            <OrderCard 
              key={order._id}
              order={order}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const OrderCard = ({ order, onStatusChange }) => {
  return (
    <div className="order-card">
      <div className="order-header">
        <span className="order-number">#{order.orderNumber}</span>
        <span className="order-time">{formatTime(order.orderDate)}</span>
      </div>
      
      <div className="order-items">
        {order.items && order.items.map((item, index) => (
          <div key={index} className="order-item">
            <span className="item-quantity">{item.quantity}x</span>
            <span className="item-name">{item.menuItem?.name || item.name}</span>
            {item.notes && <div className="item-notes">{item.notes}</div>}
            {item.customizations && item.customizations.length > 0 && (
              <div className="item-customizations">
                {item.customizations.map((custom, idx) => (
                  <span key={idx} className="customization">
                    {custom.name}: {custom.value}
                  </span>
                ))}
              </div>
            )}
            {item.addons && item.addons.length > 0 && (
              <div className="item-addons">
                {item.addons.map((addon, idx) => (
                  <span key={idx} className="addon">
                    + {addon.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="order-actions">
        {order.status === 'pending' && (
          <button 
            onClick={() => onStatusChange(order._id, 'preparing')}
            className="start-btn"
          >
            Start Preparing
          </button>
        )}
        {order.status === 'preparing' && (
          <button 
            onClick={() => onStatusChange(order._id, 'ready')}
            className="ready-btn"
          >
            Mark Ready
          </button>
        )}
      </div>
    </div>
  );
};

const groupOrdersByStatus = (orders) => {
  return {
    pending: orders.filter(order => order.status === 'pending'),
    preparing: orders.filter(order => order.status === 'preparing'),
    ready: orders.filter(order => order.status === 'ready')
  };
};

export default KitchenDisplayPage;