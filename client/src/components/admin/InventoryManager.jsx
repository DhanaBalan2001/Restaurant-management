import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { InventoryTable, InventoryForm } from '../ui';

const InventoryManager = () => {
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/inventory', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      alert('Failed to fetch inventory items');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    const token = localStorage.getItem('token');
    try {
      if (editingItem) {
        await axios.put(
          `https://restaurant-management-backend-5s96.onrender.com/inventory/update/${editingItem._id}`,
          {
            name: formData.name,
            quantity: parseInt(formData.quantity),
            minimumRequired: parseInt(formData.minimumRequired),
            unit: formData.unit
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        await axios.post(
          'https://restaurant-management-backend-5s96.onrender.com/api/inventory',
          formData,
          { headers: { Authorization: `Bearer ${token}` }}
        );
      }
      await fetchInventory();
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error details:', error.response?.data);
      alert('Failed to save inventory item');
    }
  };

  const handleDelete = async (id) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://restaurant-management-backend-5s96.onrender.com/api/inventory/${itemToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchInventory();
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) 
      ? date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'N/A';
  };

  return (
    <div className="inventory-manager">
      <div className="header">
        <h2>Inventory Management</h2>
        <button
          className="btn-primary"
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
        >
          Add New Item
        </button>
      </div>

      {loading ? (
        <div>Loading inventory...</div>
      ) : (
        <>
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Min Threshold</th>
                <th>Price</th>
                <th>Last Restock Date/Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.minThreshold}</td>
                  <td>${item.price}</td>
                  <td>{formatDate(item.lastRestockDate)}</td>
                  <td>
                    <button className="btn-secondary" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {showForm && (
        <InventoryForm 
          initialData={editingItem}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}

      {showDeleteConfirm && (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this item?</p>
          <div className="button-group">
            <button className="btn-danger" onClick={confirmDelete}>Yes, Delete</button>
            <button className="btn-secondary" onClick={() => {
              setShowDeleteConfirm(false);
              setItemToDelete(null);
            }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
