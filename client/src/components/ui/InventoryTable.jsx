import React from 'react';

const InventoryTable = ({ items, onUpdateStock, onEdit }) => {
  return (
    <div className="inventory-table">
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Current Stock</th>
            <th>Minimum Required</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => onUpdateStock(item._id, e.target.value)}
                />
              </td>
              <td>{item.minimumRequired}</td>
              <td className={item.quantity < item.minimumRequired ? 'low-stock' : ''}>
                {item.quantity < item.minimumRequired ? 'Low Stock' : 'In Stock'}
              </td>
              <td>
                <button onClick={() => onEdit(item)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
