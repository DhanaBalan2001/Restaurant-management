import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../assets/styles/orderconfirmationpage.css';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { order, customerInfo } = location.state || {};
  
  useEffect(() => {
    // Redirect if no order data
    if (!order) {
      toast.error('No order information found');
      navigate('/menu');
    }
  }, [order, navigate]);
  
  if (!order) {
    return null;
  }
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-header">
          <div className="success-icon">✓</div>
          <h1>Order Confirmed!</h1>
          <p>Your order has been successfully placed.</p>
        </div>
        
        <div className="confirmation-details">
          <div className="confirmation-section">
            <h2>Order Information</h2>
            <div className="info-row">
              <span className="info-label">Order Number:</span>
              <span className="info-value">{order._id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Order Date:</span>
              <span className="info-value">{formatDate(order.orderDate || new Date())}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Status:</span>
              <span className="info-value status">{order.status}</span>
            </div>
          </div>
          
          <div className="confirmation-section">
            <h2>Customer Information</h2>
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{customerInfo?.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{customerInfo?.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Phone:</span>
              <span className="info-value">{customerInfo?.phone}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Address:</span>
              <span className="info-value">{customerInfo?.address}</span>
            </div>
          </div>
          
          <div className="confirmation-section">
            <h2>Order Summary</h2>
            <div className="order-items-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-item-row">
                  <div className="order-item-info">
                    <span className="order-item-quantity">{item.quantity}x</span>
                    <span className="order-item-name">
                      {item.menuItem.name || `Menu Item ${index + 1}`}
                    </span>
                  </div>
                  <span className="order-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="order-total">
              <span>Total Amount:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="confirmation-footer">
          <p>A confirmation email has been sent to {customerInfo?.email}</p>
          <p>You can track your order status in your account dashboard.</p>
          
          <div className="confirmation-actions">
            <Link to="/menu" className="action-btn secondary">
              Continue Shopping
            </Link>
            <Link to="/orders" className="action-btn primary">
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
