import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import '../../assets/styles/tablemanagementpage.css';

const TableManagementPage = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await api.get('/tables');
      setTables(response.data);
    } catch (error) {
      toast.error('Failed to fetch tables');
    }
  };

  const handleTableStatusChange = async (tableId, newStatus) => {
    try {
      await api.patch(`/tables/${tableId}/status`, { status: newStatus });
      fetchTables();
      toast.success('Table status updated');
    } catch (error) {
      toast.error('Failed to update table status');
    }
  };

  return (
    <div className="table-management">
      <div className="floor-plan">
        {tables.map(table => (
          <div 
            key={table._id}
            className={`table-item ${table.status}`}
            onClick={() => setSelectedTable(table)}
          >
            <div className="table-number">Table {table.number}</div>
            <div className="table-capacity">{table.capacity} seats</div>
            <div className="table-status">{table.status}</div>
          </div>
        ))}
      </div>

      {selectedTable && (
        <div className="table-details">
          <h3>Table {selectedTable.number}</h3>
          <div className="table-info">
            <p>Capacity: {selectedTable.capacity} seats</p>
            <p>Status: {selectedTable.status}</p>
            {selectedTable.currentOrder && (
              <div className="current-order">
                <h4>Current Order</h4>
                <p>Order #: {selectedTable.currentOrder.orderNumber}</p>
                <p>Time: {formatTime(selectedTable.currentOrder.createdAt)}</p>
              </div>
            )}
          </div>
          <div className="table-actions">
            <button 
              onClick={() => handleTableStatusChange(selectedTable._id, 'available')}
              disabled={selectedTable.status === 'available'}
            >
              Mark Available
            </button>
            <button 
              onClick={() => handleTableStatusChange(selectedTable._id, 'occupied')}
              disabled={selectedTable.status === 'occupied'}
            >
              Mark Occupied
            </button>
            <button 
              onClick={() => handleTableStatusChange(selectedTable._id, 'reserved')}
              disabled={selectedTable.status === 'reserved'}
            >
              Mark Reserved
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManagementPage;
