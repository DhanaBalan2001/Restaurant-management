import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getAvailableTimeSlots, createReservation } from '../../services/reservation';
import { useAuth } from '../../hooks/useAuth';
import './reservationform.css';

const ReservationForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [guestCount, setGuestCount] = useState(2);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [formData, setFormData] = useState({
    customerName: user?.username || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    specialRequests: '',
  });

  // Set minimum date to today
  const minDate = new Date();
  // Set maximum date to 30 days from now
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

  useEffect(() => {
    if (selectedDate && guestCount) {
      fetchAvailableSlots();
    }
  }, [selectedDate, guestCount]);

  const fetchAvailableSlots = async () => {
    setCheckingAvailability(true);
    setSelectedTimeSlot('');
    setSelectedTable('');
    
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const data = await getAvailableTimeSlots(formattedDate, guestCount);
      setAvailableSlots(data.availability || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch available time slots');
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleGuestCountChange = (e) => {
    const count = parseInt(e.target.value);
    setGuestCount(count);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot.timeSlot);
    // Reset selected table when time slot changes
    setSelectedTable('');
  };

  const handleTableSelect = (tableId) => {
    setSelectedTable(tableId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTable) {
      toast.error('Please select a table');
      return;
    }
    
    if (!selectedTimeSlot) {
      toast.error('Please select a time slot');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create the complete reservation data object
      const reservationData = {
        ...formData,
        date: selectedDate.toISOString(),
        timeSlot: selectedTimeSlot,
        guestCount: guestCount,
        table: selectedTable // Include the selected table ID
      };
      
      const response = await createReservation(reservationData);
      toast.success('Reservation created successfully!');
      navigate('/reservations/confirmation', { 
        state: { reservation: response.data }
      });
    } catch (error) {
      console.error('Reservation error:', error);
      toast.error(error.message || 'Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  // Get available tables for the selected time slot
  const getAvailableTablesForTimeSlot = () => {
    const timeSlot = availableSlots.find(slot => slot.timeSlot === selectedTimeSlot);
    return timeSlot ? timeSlot.availableTables : [];
  };

  return (
    <div className="reservation-form-container">
      <h2>Make a Reservation</h2>
      
      <form onSubmit={handleSubmit} className="reservation-form">
        <div className="form-section">
          <h3>Reservation Details</h3>
          
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              minDate={minDate}
              maxDate={maxDate}
              dateFormat="MMMM d, yyyy"
              className="date-picker"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="guestCount">Number of Guests</label>
            <select
              id="guestCount"
              value={guestCount}
              onChange={handleGuestCountChange}
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          
          {checkingAvailability ? (
            <div className="checking-availability">
              <div className="spinner"></div>
              <p>Checking availability...</p>
            </div>
          ) : (
            <>
              {availableSlots.length > 0 ? (
                <div className="form-group">
                  <label>Available Time Slots</label>
                  <div className="time-slots">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.timeSlot}
                        type="button"
                        className={`time-slot-btn ${selectedTimeSlot === slot.timeSlot ? 'selected' : ''}`}
                        onClick={() => handleTimeSlotSelect(slot)}
                      >
                        {slot.timeSlot}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="no-slots-message">
                  <p>No available time slots for the selected date and party size.</p>
                  <p>Please try a different date or party size.</p>
                </div>
              )}
              
              {selectedTimeSlot && (
                <div className="form-group">
                  <label>Select a Table</label>
                  <div className="tables-grid">
                    {getAvailableTablesForTimeSlot().map((table) => (
                      <button
                        key={table._id}
                        type="button"
                        className={`table-btn ${selectedTable === table._id ? 'selected' : ''}`}
                        onClick={() => handleTableSelect(table._id)}
                      >
                        <div className="table-number">Table {table.tableNumber}</div>
                        <div className="table-capacity">Seats {table.capacity}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="form-section">
          <h3>Contact Information</h3>
          
          <div className="form-group">
            <label htmlFor="customerName">Full Name</label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="customerEmail">Email</label>
            <input
              type="email"
              id="customerEmail"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="customerPhone">Phone Number</label>
            <input
              type="tel"
              id="customerPhone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="specialRequests">Special Requests (Optional)</label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading || !selectedTimeSlot || !selectedTable}
          >
            {loading ? 'Creating Reservation...' : 'Confirm Reservation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;
