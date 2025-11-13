import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const ReservationCalendar = ({ reservations, selectedDate, onDateSelect }) => {
  const getTileContent = ({ date }) => {
    const reservationsOnDate = reservations.filter(r => 
      new Date(r.date).toDateString() === date.toDateString()
    );
    
    return reservationsOnDate.length > 0 ? (
      <div className="reservation-count">
        {reservationsOnDate.length}
      </div>
    ) : null;
  };

  return (
    <div className="reservation-calendar">
      <Calendar
        value={selectedDate}
        onChange={onDateSelect}
        tileContent={getTileContent}
        minDate={new Date()}
      />
    </div>
  );
};

export default ReservationCalendar;
