import React from 'react';

const TableList = ({ tables, onSelect, onStatusUpdate }) => {
  const getStatusClass = (status) => {
    const statusClasses = {
      'available': 'status-available',
      'occupied': 'status-occupied',
      'reserved': 'status-reserved',
      'maintenance': 'status-maintenance'
    };
    return `status ${statusClasses[status] || ''}`;
  };

  return (
    <div className="table-list">
      {tables.map(table => (
        <div key={table._id} className={`table-item ${table.status}`}>
          <div className="table-header" onClick={() => onSelect(table)}>
            <h3>Table #{table.tableNumber}</h3>
            <span className={getStatusClass(table.status)}>{table.status}</span>
          </div>
          <div className="table-details">
            <p>Capacity: {table.capacity}</p>
            <p>Branch: {table.branchId}</p>
            {table.currentReservations?.length > 0 && (
              <div className="reservation-info">
                <p>Current Reservations: {table.currentReservations.length}</p>
              </div>
            )}
          </div>
          <select
            value={table.status}
            onChange={(e) => onStatusUpdate(table._id, e.target.value)}
            className="status-select"
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default TableList;