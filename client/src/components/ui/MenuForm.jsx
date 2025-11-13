import React, { useState, useEffect } from 'react';

const MenuForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    availabilityStatus: 'in-stock'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  return (
    <form className="menu-form" onSubmit={(e) => {
      e.preventDefault();
      onSave(formData);
    }}>
      <input
        type="text"
        placeholder="Item Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
      />
      <input
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={(e) => setFormData({...formData, price: e.target.value})}
      />
      <select
        value={formData.category}
        onChange={(e) => setFormData({...formData, category: e.target.value})}
      >
        <option value="">Select Category</option>
        <option value="appetizers">Appetizers</option>
        <option value="drinks">Drinks</option>
        <option value="maincourse">Main Course</option>
        <option value="desserts">Desserts</option>
      </select>
      <div className="form-actions">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default MenuForm;
