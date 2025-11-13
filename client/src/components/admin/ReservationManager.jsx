import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/admin.css';

const ReservationManager = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/reservations/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reservationId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `https://restaurant-management-backend-5s96.onrender.com/api/reservations/${reservationId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchReservations();
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  if (loading) return <div>Loading reservations...</div>;

  return (
    <div className="reservation-manager">
      <h2>Reservation Management</h2>
      <div className="reservation-grid">
        {reservations.map(reservation => (
          <div key={reservation._id} className="reservation-card">
            <div className="reservation-details">
              <h3>{reservation.customerName}</h3>
              <p>Date: {new Date(reservation.date).toLocaleDateString()}</p>
              <p>Time: {reservation.timeSlot}</p>
              <p>Guests: {reservation.guestCount}</p>
              <p>Phone: {reservation.customerPhone}</p>
              <p>Email: {reservation.customerEmail}</p>
              <p className={`status ${reservation.status}`}>
                Status: {reservation.status}
              </p>
            </div>
            {reservation.status === 'pending' && (
              <div className="reservation-actions">
                <button 
                  className="confirm-btn"
                  onClick={() => handleStatusUpdate(reservation._id, 'confirmed')}
                >
                  Confirm
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => handleStatusUpdate(reservation._id, 'rejected')}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationManager;
