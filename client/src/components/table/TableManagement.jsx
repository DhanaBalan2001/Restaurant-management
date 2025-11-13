import React, { useState } from 'react';

const TableManagement = () => {
  const [tableData, setTableData] = useState({
    tableNumber: '',
    capacity: '',
    location: '',
    status: 'available'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('https://restaurant-management-backend-5s96.onrender.com/api/tables', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(tableData)
    });
    if (response.ok) {
      setTableData({
        tableNumber: '',
        capacity: '',
        location: '',
        status: 'available'
      });
    }
  };

  return (
    <div className="table-management">
      <h2>Create New Table</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Table Number"
          value={tableData.tableNumber}
          onChange={(e) => setTableData({...tableData, tableNumber: e.target.value})}
        />
        <input
          type="number"
          placeholder="Capacity"
          value={tableData.capacity}
          onChange={(e) => setTableData({...tableData, capacity: e.target.value})}
        />
        <input
          type="text"
          placeholder="Location"
          value={tableData.location}
          onChange={(e) => setTableData({...tableData, location: e.target.value})}
        />
        <button type="submit">Create Table</button>
      </form>
    </div>
  );
};

export default TableManagement;
