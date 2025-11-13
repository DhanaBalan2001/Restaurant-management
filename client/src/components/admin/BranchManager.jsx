import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BranchList } from '../ui';

const BranchManager = () => {
  const [branches, setBranches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: {
      address: '',
      city: ''
    },
    contactNumber: '',
    manager: '',
    email: '',
    status: 'active',
    operatingHours: {
      open: '09:00',
      close: '22:00'
    }
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/branches', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data) {
        setBranches(response.data);
      }
    } catch (error) {
      console.error('Error fetching branches:', error.response?.data?.message || error.message);
    }
  };

  const handleStatusUpdate = async (branchId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://restaurant-management-backend-5s96.onrender.com/api/branches/${branchId}/status`,
        { status },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      fetchBranches();
    } catch (error) {
      console.error('Error updating branch status:', error.response?.data?.message || error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      if (selectedBranch) {
        await axios.put(`https://restaurant-management-backend-5s96.onrender.com/api/branches/${selectedBranch._id}`,
          formData,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        await axios.post('https://restaurant-management-backend-5s96.onrender.comapi/branches',
          formData,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      fetchBranches();
      setShowForm(false);
      setSelectedBranch(null);
      setFormData({
        name: '',
        location: {
          address: '',
          city: ''
        },
        contactNumber: '',
        manager: '',
        email: '',
        status: 'active',
        operatingHours: {
          open: '09:00',
          close: '22:00'
        }
      });
    } catch (error) {
      console.error('Error saving branch:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="branch-manager">
      <div className="header">
        <h2>Branch Management</h2>
        <button onClick={() => setShowForm(true)}>Add New Branch</button>
      </div>

      <BranchList
        branches={branches}
        onSelect={setSelectedBranch}
        onStatusUpdate={handleStatusUpdate}
      />

      {showForm && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Branch Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <textarea
              placeholder="Address"
              value={formData.location.address}
              onChange={(e) => setFormData({...formData, location: {...formData.location, address: e.target.value}})}
              required
            />
            <input
              type="text"
              placeholder="City"
              value={formData.location.city}
              onChange={(e) => setFormData({...formData, location: {...formData.location, city: e.target.value}})}
              required
            />
            <input
              type="tel"
              placeholder="Contact Number"
              value={formData.contactNumber}
              onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Manager Name"
              value={formData.manager}
              onChange={(e) => setFormData({...formData, manager: e.target.value})}
              required
            />
            <div className="operating-hours">
              <h4>Operating Hours</h4>
              <div className="hours-inputs">
                <input
                  type="time"
                  value={formData.operatingHours.open}
                  onChange={(e) => setFormData({
                    ...formData,
                    operatingHours: {...formData.operatingHours, open: e.target.value}
                  })}
                />
                <span>to</span>
                <input
                  type="time"
                  value={formData.operatingHours.close}
                  onChange={(e) => setFormData({
                    ...formData,
                    operatingHours: {...formData.operatingHours, close: e.target.value}
                  })}
                />
              </div>
            </div>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Under Maintenance</option>
            </select>
            <div className="form-actions">
              <button type="submit">{selectedBranch ? 'Update' : 'Create'} Branch</button>
              <button type="button" onClick={() => {
                setShowForm(false);
                setSelectedBranch(null);
              }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BranchManager;
