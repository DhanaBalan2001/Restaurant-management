import React from 'react';

const BranchList = ({ branches, onSelect, onStatusUpdate }) => {
  return (
    <div className="branch-list">
      {branches.map(branch => (
        <div key={branch._id} className="branch-item">
          <div className="branch-header" onClick={() => onSelect(branch)}>
            <h3>{branch.name}</h3>
            <span className={`status ${branch.status}`}>{branch.status}</span>
          </div>
          <div className="branch-details">
            <p><i className="fas fa-map-marker-alt"></i> {branch.address}</p>
            <p><i className="fas fa-phone"></i> {branch.phone}</p>
            <p><i className="fas fa-user"></i> Manager: {branch.manager}</p>
            <p><i className="fas fa-table"></i> Tables: {branch.tables?.length || 0}</p>
            <p><i className="fas fa-users"></i> Staff: {branch.staff?.length || 0}</p>
          </div>
          <select
            value={branch.status}
            onChange={(e) => onStatusUpdate(branch._id, e.target.value)}
            className="status-select"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Under Maintenance</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default BranchList;