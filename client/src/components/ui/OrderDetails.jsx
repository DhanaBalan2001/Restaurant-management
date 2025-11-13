import React from 'react';

const OrderDetails = ({ order, onClose, onStatusUpdate }) => {
  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <div className="order-details">
      <div className="details-header">
        <h3>Order Details #{order._id.slice(-6)}</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      <div className="details-content">
        <div className="customer-info">
          <h4>Customer Information</h4>
          <p>Name: {order.customer?.name || 'Guest'}</p>
          <p>Phone: {order.customer?.phone || 'N/A'}</p>
          <p>Email: {order.customer?.email || 'N/A'}</p>
        </div>
        
        <div className="order-status">
          <h4>Order Status</h4>
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

        <div className="items-list">
          <h4>Order Items</h4>
          {order.items.map((item, index) => (
            <div key={index} className="order-item">
              <span>{item.menuItem?.name || item.name}</span>
              <span>×{item.quantity}</span>
              <span>${Number(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="order-total">
          <h4>Total Amount</h4>
          <p>${Number(calculateTotal(order.items)).toFixed(2)}</p>
        </div>

        <div className="order-timestamps">
          <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
          <p>Last Updated: {new Date(order.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;