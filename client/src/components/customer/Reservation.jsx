import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/customer.css';

const Reservation = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: '',
    timeSlot: '',
    guestCount: '1',
    table: ''
  });
  
  const [availableSlots, setAvailableSlots] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (formData.date && formData.guestCount) {
      fetchAvailableSlots();
    }
  }, [formData.date, formData.guestCount]);

  const fetchAvailableSlots = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://restaurant-management-backend-5s96.onrender.com/api/reservations/available-slots`, {
        params: {
          date: formData.date,
          guestCount: Number(formData.guestCount)
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setAvailableSlots(response.data.availability);
    } catch (error) {
      setMessage('Error fetching available slots');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please login to make a reservation');
        return;
      }

      const reservationData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        date: new Date(formData.date).toISOString(),
        timeSlot: formData.timeSlot,
        guestCount: Number(formData.guestCount),
        table: formData.table,
        status: 'pending'
      };

      const response = await axios.post(
        'https://restaurant-management-backend-5s96.onrender.com/api/reservations/create', 
        reservationData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data) {
        setMessage('Reservation created successfully!');
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          date: '',
          timeSlot: '',
          guestCount: '1',
          table: ''
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setMessage('Access denied. Please login again.');
      } else {
        setMessage('Error creating reservation. Please try again.');
      }
      console.error('Reservation error:', error);
    }
  };

  return (
    <div className="reservation-container">
      <h2>Make a Reservation</h2>
      {message && <div className="message">{message}</div>}
      
      <form onSubmit={handleSubmit} className="reservation-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Your Name"
            value={formData.customerName}
            onChange={(e) => setFormData({...formData, customerName: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Your Email"
            value={formData.customerEmail}
            onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="tel"
            placeholder="Your Phone"
            value={formData.customerPhone}
            onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="number"
            placeholder="Number of Guests"
            value={formData.guestCount}
            min="1"
            max="10"
            onChange={(e) => setFormData({...formData, guestCount: e.target.value})}
            required
          />
        </div>

        {availableSlots.length > 0 && (
          <div className="time-slots-grid">
            {availableSlots.map((slot) => (
              <div
                key={slot.timeSlot}
                className={`time-slot ${formData.timeSlot === slot.timeSlot ? 'selected' : ''}`}
                onClick={() => setFormData({
                  ...formData, 
                  timeSlot: slot.timeSlot,
                  table: slot.availableTables[0]?._id
                })}
              >
                <span>{slot.timeSlot}</span>
                <small>{slot.availableTables.length} tables available</small>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="submit-button"
          disabled={!formData.timeSlot || !formData.table}
        >
          Book Table
        </button>
      </form>
    </div>
  );
};

export default Reservation;
