import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TableList } from '../ui';

const TableManager = () => {
  const [tables, setTables] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: 4,
    status: 'available',
    branchId: ''
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/tables', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const handleStatusUpdate = async (tableId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://restaurant-management-backend-5s96.onrender.com/api/tables/${tableId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchTables();
    } catch (error) {
      console.error('Error updating table status:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      if (selectedTable) {
        await axios.put(`https://restaurant-management-backend-5s96.onrender.com/api/tables/${selectedTable._id}`, 
          formData,
          { headers: { Authorization: `Bearer ${token}` }}
        );
      } else {
        await axios.post('https://restaurant-management-backend-5s96.onrender.com/api/tables', 
          formData,
          { headers: { Authorization: `Bearer ${token}` }}
        );
      }
      
      fetchTables();
      setShowForm(false);
      setSelectedTable(null);
      setFormData({
        tableNumber: '',
        capacity: 4,
        status: 'available',
        branchId: ''
      });
    } catch (error) {
      console.error('Error saving table:', error);
    }
  };

  return (
    <div className="table-manager">
      <div className="header">
        <h2>Table Management</h2>
        <button onClick={() => setShowForm(true)}>Add New Table</button>
      </div>

      <TableList 
        tables={tables}
        onSelect={setSelectedTable}
        onStatusUpdate={handleStatusUpdate}
      />

      {showForm && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Table Number"
              value={formData.tableNumber}
              onChange={(e) => setFormData({...formData, tableNumber: e.target.value})}
              required
            />
            <input
              type="number"
              placeholder="Capacity"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
              required
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              required
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <input
              type="text"
              placeholder="Branch ID"
              value={formData.branchId}
              onChange={(e) => setFormData({...formData, branchId: e.target.value})}
              required
            />
            <div className="form-actions">
              <button type="submit">{selectedTable ? 'Update' : 'Create'} Table</button>
              <button type="button" onClick={() => {
                setShowForm(false);
                setSelectedTable(null);
              }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TableManager;
