import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import api from '../../services/api';

const ReservationCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  
  useEffect(() => {
    fetchAvailableSlots(selectedDate);
  }, [selectedDate]);

  const fetchAvailableSlots = async (date) => {
    const response = await api.get(`/reservations/available-slots?date=${date}`);
    setAvailableSlots(response.data.availability);
  };

  return (
    <div className="reservation-calendar">
      <Calendar onChange={setSelectedDate} value={selectedDate} />
      <div className="time-slots">
        {availableSlots.map(slot => (
          <TimeSlot key={slot.timeSlot} slot={slot} />
        ))}
      </div>
    </div>
  );
};
