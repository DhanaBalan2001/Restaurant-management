import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../assets/styles/reservationconfirmationpage.css';

const ReservationConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reservation } = location.state || {};

  useEffect(() => {
    if (!reservation) {
      toast.error('No reservation information found');
      navigate('/reservations/create');
    }
  }, [reservation, navigate]);

  if (!reservation) {
    return null;
  }

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="reservation-confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-header">
          <div className="success-icon">✓</div>
          <h1>Reservation Confirmed!</h1>
          <p>Your table has been successfully reserved.</p>
        </div>
        
        <div className="confirmation-details">
          <div className="confirmation-section">
            <h2>Reservation Details</h2>
            <div className="info-row">
              <span className="info-label">Reservation ID:</span>
              <span className="info-value">{reservation._id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Date:</span>
              <span className="info-value">{formatDate(reservation.date)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Time:</span>
              <span className="info-value">{reservation.timeSlot}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Number of Guests:</span>
              <span className="info-value">{reservation.guestCount}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Status:</span>
              <span className="info-value status">{reservation.status}</span>
            </div>
          </div>
          
          <div className="confirmation-section">
            <h2>Contact Information</h2>
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{reservation.customerName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{reservation.customerEmail}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Phone:</span>
              <span className="info-value">{reservation.customerPhone}</span>
            </div>
          </div>
          
          {reservation.specialRequests && (
            <div className="confirmation-section">
              <h2>Special Requests</h2>
              <p className="special-requests">{reservation.specialRequests}</p>
            </div>
          )}
        </div>
        
        <div className="confirmation-footer">
          <p>A confirmation email has been sent to {reservation.customerEmail}</p>
          <p>Please arrive 10 minutes before your reservation time.</p>
          
          <div className="confirmation-actions">
            <Link to="/menu" className="action-btn secondary">
              Browse Menu
            </Link>
            <Link to="/reservations" className="action-btn primary">
              View My Reservations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationConfirmationPage;
