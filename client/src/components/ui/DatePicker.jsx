import React from 'react';

const DatePicker = ({ selected, onChange }) => {
  return (
    <input
      type="date"
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      min={new Date().toISOString().split('T')[0]}
      required
    />
  );
};

export default DatePicker;
