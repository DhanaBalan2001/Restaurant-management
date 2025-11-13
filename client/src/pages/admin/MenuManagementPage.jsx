import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import '../../assets/styles/menumanagementpage.css';

const MenuManagementPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'appetizers',
    isAvailable: true,
    availabilityStatus: 'in-stock', // Updated to match the enum in Menu.js
    image: ''
  });
  const [filter, setFilter] = useState('all');

  // Define availability status options based on the enum in Menu.js
  const availabilityStatusOptions = [
    { value: 'in-stock', label: 'In Stock', color: '#4CAF50' },
    { value: 'out-of-stock', label: 'Out of Stock', color: '#F44336' }
  ];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await api.get('/menu');
      setMenuItems(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load menu items');
      setLoading(false);
      toast.error('Failed to load menu items');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // If changing availability status, also update isAvailable accordingly
    if (name === 'availabilityStatus') {
      setFormData(prev => ({
        ...prev,
        isAvailable: value === 'in-stock'
      }));
    }
    
    // If changing isAvailable, also update availabilityStatus accordingly
    if (name === 'isAvailable') {
      setFormData(prev => ({
        ...prev,
        availabilityStatus: checked ? 'in-stock' : 'out-of-stock'
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      if (editingItem) {
        await api.put(`/menu/${editingItem._id}`, data);
        toast.success('Menu item updated successfully');
      } else {
        await api.post('/menu', data);
        toast.success('Menu item created successfully');
      }
      
      resetForm();
      fetchMenuItems();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save menu item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      isAvailable: item.isAvailable,
      availabilityStatus: item.availabilityStatus || 'in-stock', // Set default if not present
      image: item.image || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await api.delete(`/menu/${id}`);
        toast.success('Menu item deleted successfully');
        fetchMenuItems();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete menu item');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'appetizers',
      isAvailable: true,
      availabilityStatus: 'in-stock',
      image: ''
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const toggleForm = () => {
    if (showForm && editingItem) {
      resetForm();
    } else {
      setShowForm(!showForm);
    }
  };

  const filteredMenuItems = filter === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === filter);

  // Helper function to get status badge class and text
  const getStatusBadge = (status) => {
    const statusOption = availabilityStatusOptions.find(option => option.value === status) || 
                         availabilityStatusOptions[0];
    
    return {
      className: `status-badge status-${statusOption.value.replace('-', '_')}`,
      text: statusOption.label,
      style: { backgroundColor: statusOption.color }
    };
  };

  if (loading) {
    return (
      <div className="menu-management loading">
        <div className="spinner"></div>
        <p>Loading menu items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-management error">
        <p>{error}</p>
        <button onClick={fetchMenuItems} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="menu-management">
      <div className="page-header">
        <h2>{editingItem ? 'Edit Menu Item' : 'Menu Management'}</h2>
        <button 
          className={`toggle-form-btn ${showForm ? 'cancel' : 'add'}`}
          onClick={toggleForm}
        >
          {showForm ? 'Cancel' : 'Add New Item'}
        </button>
      </div>
      
      {showForm && (
        <div className="menu-form-container">
          <form onSubmit={handleSubmit} className="menu-form">
            <div className="form-group">
              <label htmlFor="name">Item Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="appetizers">Appetizers</option>
                  <option value="maincourse">Main Course</option>
                  <option value="desserts">Desserts</option>
                  <option value="drinks">Drinks</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="image">Image URL</label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            {/* Availability Status Dropdown - Updated to match Menu.js enum values */}
            <div className="form-group">
              <label htmlFor="availabilityStatus">Availability Status</label>
              <select
                id="availabilityStatus"
                name="availabilityStatus"
                value={formData.availabilityStatus}
                onChange={handleInputChange}
                required
              >
                {availabilityStatusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="form-hint">
                {formData.availabilityStatus === 'in-stock' ? 
                  'Item will be available for ordering' : 
                  'Item will not be available for ordering'}
              </p>
            </div>
            
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="save-btn">
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </form>
          
          {formData.image && (
            <div className="image-preview">
              <h3>Image Preview</h3>
              <img src={formData.image} alt="Preview" />
            </div>
          )}
        </div>
      )}
      
      <div className="menu-list-container">
        <div className="menu-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'appetizers' ? 'active' : ''}`}
            onClick={() => setFilter('appetizers')}
          >
            Appetizers
          </button>
          <button 
            className={`filter-btn ${filter === 'maincourse' ? 'active' : ''}`}
            onClick={() => setFilter('maincourse')}
          >
            Main Course
          </button>
          <button 
            className={`filter-btn ${filter === 'desserts' ? 'active' : ''}`}
            onClick={() => setFilter('desserts')}
          >
            Desserts
          </button>
          <button 
            className={`filter-btn ${filter === 'drinks' ? 'active' : ''}`}
            onClick={() => setFilter('drinks')}
          >
            Drinks
          </button>
        </div>
        
        {filteredMenuItems.length === 0 ? (
          <div className="no-items">
            <p>No menu items found.</p>
          </div>
        ) : (
          <div className="menu-items-grid">
            {filteredMenuItems.map(item => {
              // Get status badge information
              const statusBadge = getStatusBadge(item.availabilityStatus || 
                                               (item.isAvailable ? 'in-stock' : 'out-of-stock'));
              
              return (
                <div key={item._id} className="menu-item-card">
                  <div className="menu-item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                    <div 
                      className={statusBadge.className}
                      style={statusBadge.style}
                    >
                      {statusBadge.text}
                    </div>
                  </div>
                  <div className="menu-item-details">
                    <h3 className="menu-item-name">{item.name}</h3>
                    <p className="menu-item-description">{item.description}</p>
                    <div className="menu-item-meta">
                      <span className="menu-item-price">${item.price.toFixed(2)}</span>
                      <span className="menu-item-category">{item.category}</span>
                    </div>
                  </div>
                  <div className="menu-item-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagementPage;
