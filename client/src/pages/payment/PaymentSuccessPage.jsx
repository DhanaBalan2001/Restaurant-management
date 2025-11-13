import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../../assets/styles/paymentsuccesspage.css';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const { reservation } = location.state || {};
  
  if (!reservation) {
    return (
      <div className="payment-success-page">
        <div className="success-container error">
          <h2>Error</h2>
          <p>No reservation information found.</p>
          <Link to="/reservations" className="back-button">
            Go to My Reservations
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="payment-success-page">
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h1>Payment Successful!</h1>
        <p>Your reservation has been confirmed and paid.</p>
        
        <div className="reservation-details">
          <h2>Reservation Details</h2>
          <div className="detail-row">
            <span className="detail-label">Reservation ID:</span>
            <span className="detail-value">{reservation._id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date:</span>
            <span className="detail-value">{new Date(reservation.date).toLocaleDateString()}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Time:</span>
            <span className="detail-value">{reservation.timeSlot}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Guests:</span>
            <span className="detail-value">{reservation.guestCount}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Table:</span>
            <span className="detail-value">Table {reservation.table?.tableNumber || 'TBD'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Amount Paid:</span>
            <span className="detail-value">${(reservation.amount / 100).toFixed(2)}</span>
          </div>
        </div>
        
        <div className="success-message">
          <p>A confirmation email has been sent to {reservation.customerEmail}</p>
          <p>We look forward to seeing you!</p>
        </div>
        
        <div className="success-actions">
          <Link to="/menu" className="action-button secondary">
            Browse Menu
          </Link>
          <Link to="/reservations" className="action-button primary">
            View My Reservations
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
