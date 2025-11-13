import React from 'react';

const OrderList = ({ orders, onSelect, onStatusUpdate }) => {
  const getStatusClass = (status) => {
    const statusClasses = {
      'pending': 'status-pending',
      'preparing': 'status-preparing',
      'ready': 'status-ready',
      'delivered': 'status-delivered'
    };
    return `status ${statusClasses[status] || ''}`;
  };

  return (
    <div className="order-list">
      {orders.map(order => (
        <div key={order._id} className="order-item">
          <div className="order-header" onClick={() => onSelect(order)}>
            <h3>Order #{order._id.slice(-6)}</h3>
            <span className={getStatusClass(order.status)}>{order.status}</span>
          </div>
          <div className="order-summary">
            <p>Customer: {order.customer?.name || 'Guest'}</p>
            <p>Items: {order.items.length}</p>
            <p>Total: ${order.totalAmount?.toFixed(2)}</p>
            <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <select
            value={order.status}
            onChange={(e) => onStatusUpdate(order._id, e.target.value)}
            className="status-select"
          >
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default OrderList;