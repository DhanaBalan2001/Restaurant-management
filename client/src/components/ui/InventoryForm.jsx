import React, { useState, useEffect } from 'react';

const InventoryForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    minThreshold: 0,
    unit: 'units',
    category: '',
    supplier: '',
    price: 0,
    lastRestocked: null
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        quantity: Number(initialData.quantity) || 0,
        minThreshold: Number(initialData.minThreshold) || 0,
        price: Number(initialData.price) || 0,
        lastRestocked: initialData.lastRestocked || null
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form data
    if (!formData.name || formData.quantity < 0) {
      alert('Please fill all required fields correctly');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <form className="inventory-form" onSubmit={handleSubmit}>
        <h3>{initialData ? 'Edit Item' : 'Add New Item'}</h3>
        
        <div className="form-group">
          <label>Item Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Current Quantity</label>
          <input
            type="number"
            value={formData.quantity || 0}
            onChange={(e) => setFormData({...formData, quantity: Number(e.target.value) || 0})}
            required
          />
        </div>

        <div className="form-group">
          <label>Minimum Threshold</label>
          <input
            type="number"
            value={formData.minThreshold || 0}
            onChange={(e) => setFormData({...formData, minThreshold: Number(e.target.value) || 0})}
            required
          />
        </div>

        <div className="form-group">
          <label>Unit</label>
          <select
            value={formData.unit}
            onChange={(e) => setFormData({...formData, unit: e.target.value})}
          >
            <option value="units">Units</option>
            <option value="kg">Kilograms</option>
            <option value="liters">Liters</option>
            <option value="boxes">Boxes</option>
          </select>
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            value={formData.price || 0}
            onChange={(e) => setFormData({...formData, price: Number(e.target.value) || 0})}
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Supplier</label>
          <input
            type="text"
            value={formData.supplier}
            onChange={(e) => setFormData({...formData, supplier: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Last Restocked</label>
          <input
            type="date"
            value={formData.lastRestocked ? new Date(formData.lastRestocked).toISOString().split('T')[0] : ''}
            onChange={(e) => setFormData({...formData, lastRestocked: e.target.value})}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {initialData ? 'Update' : 'Add'} Item
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default InventoryForm;