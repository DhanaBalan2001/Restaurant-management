import React from 'react';

const TimePicker = ({ selected, onChange }) => {
  return (
    <input
      type="time"
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      min="10:00"
      max="22:00"
      required
    />
  );
};

export default TimePicker;
