import React from 'react';

const MenuTable = ({ items, onEdit, onDelete }) => {
  return (
    <div className="menu-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>${item.price}</td>
              <td>{item.category}</td>
              <td>{item.availabilityStatus}</td>
              <td>
                <button onClick={() => onEdit(item)} className="edit-btn">Edit</button>
                <button onClick={() => onDelete(item._id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MenuTable;
