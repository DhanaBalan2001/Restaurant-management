import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TableStatus = () => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/tables', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTables(response.data);
  };

  const updateTableStatus = async (tableId, status) => {
    const token = localStorage.getItem('token');
    await axios.put(`https://restaurant-management-backend-5s96.onrender.com/api/tables/${tableId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` }}
    );
    fetchTables();
  };

  return (
    <div className="table-status">
      <h2>Table Status</h2>
      <div className="table-grid">
        {tables.map(table => (
          <div key={table._id} className={`table-card ${table.status}`}>
            <h3>Table {table.number}</h3>
            <p>Capacity: {table.capacity}</p>
            <select
              value={table.status}
              onChange={(e) => updateTableStatus(table._id, e.target.value)}
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableStatus;
