import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import '../../assets/styles/reservationmanagementpage.css';

const ReservationManagementPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchReservations();
  }, [filterStatus, selectedDate]);

  const fetchReservations = async () => {
    try {
      const response = await api.get(`/reservations/all`, {
        params: {
          status: filterStatus !== 'all' ? filterStatus : undefined,
          date: selectedDate
        }
      });
      setReservations(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch reservations');
      setLoading(false);
    }
  };

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      await api.patch(`/reservations/${reservationId}/status`, { status: newStatus });
      toast.success('Reservation status updated');
      fetchReservations();
    } catch (error) {
      toast.error('Failed to update reservation status');
    }
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading reservations...</div>;
  }

  return (
    <div className="reservation-management">
      <div className="management-header">
        <h2>Reservation Management</h2>
        <div className="filters">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-filter"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="reservations-table-container">
        <table className="reservations-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Customer</th>
              <th>Guests</th>
              <th>Table</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(reservation => (
              <tr key={reservation._id}>
                <td>{new Date(reservation.date).toLocaleDateString()}</td>
                <td>{formatTime(reservation.timeSlot)}</td>
                <td>{reservation.customerName}</td>
                <td>{reservation.guestCount}</td>
                <td>{reservation.table?.number || 'Not Assigned'}</td>
                <td>
                  <span className={`status-badge ${reservation.status}`}>
                    {reservation.status}
                  </span>
                </td>
                <td className="action-buttons">
                  {reservation.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(reservation._id, 'confirmed')}
                        className="confirm-btn"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusChange(reservation._id, 'cancelled')}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {reservation.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusChange(reservation._id, 'completed')}
                      className="complete-btn"
                    >
                      Mark Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationManagementPage;
