  import React, { useState, useEffect } from 'react';
  import axios from 'axios';

  const StaffForm = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      role: 'staff',
      branchId: '',
      status: 'active'
    });
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          role: initialData.role || 'staff',
          branchId: initialData.branchId?._id || '',
          status: initialData.status || 'active'
        });
      }
      fetchBranches();
    }, [initialData]);

    const fetchBranches = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/branches', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBranches(response.data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        await onSave(formData);
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="modal">
        <div className="modal-content">
          <h2>{initialData ? 'Edit Staff' : 'Add New Staff'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Role:</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div className="form-group">
              <label>Branch:</label>
              <select name="branchId" value={formData.branchId} onChange={handleChange} required>
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button type="button" className="btn-secondary" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default StaffForm;
