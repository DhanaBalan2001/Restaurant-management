import React from 'react';

const ReservationList = ({ reservations, onStatusUpdate }) => {
  return (
    <div className="reservation-list">
      {reservations.map(reservation => (
        <div key={reservation._id} className="reservation-card">
          <div className="reservation-info">
            <h3>{reservation.customerName}</h3>
            <p>Time: {reservation.timeSlot}</p>
            <p>Guests: {reservation.guestCount}</p>
            <p>Status: {reservation.status}</p>
          </div>
          <div className="reservation-actions">
            {reservation.status === 'pending' && (
              <>
                <button 
                  onClick={() => onStatusUpdate(reservation._id, 'confirmed')}
                  className="confirm-btn"
                >
                  Confirm
                </button>
                <button 
                  onClick={() => onStatusUpdate(reservation._id, 'cancelled')}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReservationList;
