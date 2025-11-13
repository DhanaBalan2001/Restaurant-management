import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCustomerReservations, cancelReservation } from '../../services/reservation';
import '../../assets/styles/reservationspage.css';

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await getCustomerReservations();
      setReservations(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load reservations. Please try again later.');
      setLoading(false);
      toast.error('Failed to load reservations');
    }
  };

  const handleCancelReservation = async (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await cancelReservation(id);
        toast.success('Reservation cancelled successfully');
        fetchReservations();
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
      <div className="reservations-page">
        <div className="reservations-header">
          <h1>My Reservations</h1>
          <Link to="/reservations/create" className="create-reservation-btn">
            Make a Reservation
          </Link>
        </div>
        <div className="reservations-content loading">
          <div className="loading-spinner"></div>
          <p>Loading reservations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reservations-page">
        <div className="reservations-header">
          <h1>My Reservations</h1>
          <Link to="/reservations/create" className="create-reservation-btn">
            Make a Reservation
          </Link>
        </div>
        <div className="reservations-content error">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchReservations} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Separate upcoming and past reservations
  const upcomingReservations = reservations.filter(res => 
    isUpcoming(res.date, res.status)
  );
  
  const pastReservations = reservations.filter(res => 
    !isUpcoming(res.date, res.status)
  );

  return (
    <div className="reservations-page">
      <div className="reservations-header">
        <h1>My Reservations</h1>
        <Link to="/reservations/create" className="create-reservation-btn">
          Make a Reservation
        </Link>
      </div>
      
      <div className="reservations-content">
        {reservations.length === 0 ? (
          <div className="no-reservations">
            <p>You don't have any reservations yet.</p>
            <Link to="/reservations/create" className="start-reserving-btn">
              Make Your First Reservation
            </Link>
          </div>
        ) : (
          <>
            {upcomingReservations.length > 0 && (
              <div className="reservations-section">
                <h2>Upcoming Reservations</h2>
                <div className="reservations-list">
                  {upcomingReservations.map((reservation) => (
                    <div key={reservation._id} className="reservation-card">
                      <div className="reservation-header">
                        <div className="reservation-date">
                          {formatDate(reservation.date)}
                        </div>
                        <div className={`reservation-status ${getStatusClass(reservation.status)}`}>
                          {reservation.status}
                        </div>
                      </div>
                      
                      <div className="reservation-details">
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
                      </div>
                      
                      <div className="reservation-actions">
                        {reservation.status !== 'cancelled' && (
                          <button 
                            onClick={() => handleCancelReservation(reservation._id)}
                            className="cancel-btn"
                          >
                            Cancel Reservation
                          </button>
                        )}
                        <Link 
                          to={`/reservations/${reservation._id}`} 
                          className="view-details-btn"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {pastReservations.length > 0 && (
              <div className="reservations-section">
                <h2>Past Reservations</h2>
                <div className="reservations-list">
                  {pastReservations.map((reservation) => (
                    <div key={reservation._id} className="reservation-card past">
                      <div className="reservation-header">
                        <div className="reservation-date">
                          {formatDate(reservation.date)}
                        </div>
                        <div className={`reservation-status ${getStatusClass(reservation.status)}`}>
                          {reservation.status}
                        </div>
                      </div>
                      
                      <div className="reservation-details">
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
                          <span className="detail-value">Table {reservation.table?.tableNumber || 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div className="reservation-actions">
                        <Link 
                          to={`/reservations/${reservation._id}`} 
                          className="view-details-btn"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReservationsPage;
