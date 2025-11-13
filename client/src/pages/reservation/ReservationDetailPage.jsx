import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { cancelReservation } from '../../services/reservation';
import '../../assets/styles/reservationdetailpage.css';

const ReservationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await api.get(`/reservations/${id}`);
        setReservation(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load reservation details. Please try again later.');
        setLoading(false);
        toast.error('Failed to load reservation details');
      }
    };

    fetchReservation();
  }, [id]);

  const handleCancelReservation = async () => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await cancelReservation(id);
        toast.success('Reservation cancelled successfully');
        
        // Update the reservation status in the state
        setReservation(prev => ({
          ...prev,
          status: 'cancelled'
        }));
      } catch (error) {
        toast.error(error.message || 'Failed to cancel reservation');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'cancelled':
        return 'status-cancelled';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  const isUpcoming = (date, status) => {
    return new Date(date) > new Date() && status !== 'cancelled';
  };

  if (loading) {
    return (
      <div className="reservation-detail-page">
        <div className="reservation-detail-header">
          <h1>Reservation Details</h1>
          <Link to="/reservations" className="back-btn">
            Back to Reservations
          </Link>
        </div>
        <div className="reservation-detail-content loading">
          <div className="loading-spinner"></div>
          <p>Loading reservation details...</p>
        </div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="reservation-detail-page">
        <div className="reservation-detail-header">
          <h1>Reservation Details</h1>
          <Link to="/reservations" className="back-btn">
            Back to Reservations
          </Link>
        </div>
        <div className="reservation-detail-content error">
          <div className="error-message">
            <p>{error || 'Reservation not found'}</p>
            <button onClick={() => navigate('/reservations')} className="return-btn">
              Return to Reservations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reservation-detail-page">
      <div className="reservation-detail-header">
        <h1>Reservation Details</h1>
        <Link to="/reservations" className="back-btn">
          Back to Reservations
        </Link>
      </div>
      
      <div className="reservation-detail-container">
        <div className="reservation-info-section">
          <div className="reservation-info-header">
            <h2>Reservation Information</h2>
            <div className={`reservation-status ${getStatusClass(reservation.status)}`}>
              {reservation.status}
            </div>
          </div>
          
          <div className="reservation-info-grid">
            <div className="info-item">
              <span className="info-label">Reservation ID</span>
              <span className="info-value">{reservation._id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Date</span>
              <span className="info-value">{formatDate(reservation.date)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Time</span>
              <span className="info-value">{reservation.timeSlot}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Number of Guests</span>
              <span className="info-value">{reservation.guestCount}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Table</span>
              <span className="info-value">Table {reservation.table?.tableNumber || 'TBD'}</span>
            </div>
          </div>
        </div>
        
        <div className="contact-info-section">
          <h2>Contact Information</h2>
          <div className="info-item">
            <span className="info-label">Name</span>
            <span className="info-value">{reservation.customerName}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{reservation.customerEmail}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Phone</span>
            <span className="info-value">{reservation.customerPhone}</span>
          </div>
        </div>
        
        {reservation.specialRequests && (
          <div className="special-requests-section">
            <h2>Special Requests</h2>
            <p>{reservation.specialRequests}</p>
          </div>
        )}
        
        <div className="reservation-actions">
          {isUpcoming(reservation.date, reservation.status) && (
            <button 
              onClick={handleCancelReservation}
              className="cancel-reservation-btn"
              disabled={reservation.status === 'cancelled'}
            >
              Cancel Reservation
            </button>
          )}
          <Link to="/menu" className="view-menu-btn">
            View Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailPage;
