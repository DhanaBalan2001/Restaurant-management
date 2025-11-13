import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StaffForm } from '../ui';

const StaffManager = () => {
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/admin/staff', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    const token = localStorage.getItem('token');
    try {
      if (editingStaff) {
        await axios.put(
          `https://restaurant-management-backend-5s96.onrender.com/api/admin/staff/${editingStaff._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` }}
        );
      } else {
        await axios.post(
          'https://restaurant-management-backend-5s96.onrender.com/api/admin/staff',
          formData,
          { headers: { Authorization: `Bearer ${token}` }}
        );
      }
      await fetchStaff();
      setShowForm(false);
      setEditingStaff(null);
    } catch (error) {
      console.error('Error saving staff:', error);
    }
  };

  const updateStaffStatus = async (staffId, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `https://restaurant-management-backend-5s96.onrender.com/api/admin/staff/${staffId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      await fetchStaff();
    } catch (error) {
      console.error('Error updating staff status:', error);
    }
  };

  return (
    <div className="staff-manager">
      <div className="header">
        <h2>Staff Management</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          Add New Staff
        </button>
      </div>

      {loading ? (
        <div>Loading staff...</div>
      ) : (
        <div className="staff-grid">
          {staff.map((member) => (
            <div key={member._id} className="staff-card">
              <div className="staff-header">
                <h3>{member.name}</h3>
                <span className={`status ${member.status}`}>{member.status}</span>
              </div>
              <div className="staff-details">
                <p><strong>Role:</strong> {member.role}</p>
                <p><strong>Email:</strong> {member.email}</p>
                <p><strong>Phone:</strong> {member.phone}</p>
                <p><strong>Branch:</strong> {member.branchId?.name}</p>
              </div>
              <div className="staff-actions">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setEditingStaff(member);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className={`btn-${member.status === 'active' ? 'danger' : 'success'}`}
                  onClick={() => updateStaffStatus(
                    member._id,
                    member.status === 'active' ? 'inactive' : 'active'
                  )}
                >
                  {member.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <StaffForm
          initialData={editingStaff}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingStaff(null);
          }}
        />
      )}
    </div>
  );
};

export default StaffManager;
