import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/dashboard.css';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [reports, setReports] = useState({});
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isAvailable: true,
    availabilityStatus: 'in-stock'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [ordersRes, inventoryRes, menuRes, dailyReportRes, reservationsRes] = await Promise.all([
          axios.get('https://restaurant-management-backend-5s96.onrender.com/api/orders', { headers }),
          axios.get('https://restaurant-management-backend-5s96.onrender.com/api/inventory', { headers }),
          axios.get('https://restaurant-management-backend-5s96.onrender.com/api/menu', { headers }),
          axios.get('https://restaurant-management-backend-5s96.onrender.com/api/reports/daily', { headers }),
          axios.get('https://restaurant-management-backend-5s96.onrender.com/api/reservations/all', { headers })
        ]);

        setOrders(ordersRes.data);
        setInventory(inventoryRes.data);
        setMenuItems(menuRes.data);
        setReservations(reservationsRes.data);
        setReports({
          daily: dailyReportRes.data,
          monthly: { revenue: 0 },
          peakHours: { peak: 'N/A' }
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const handleReservationStatus = async (reservationId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `https://restaurant-management-backend-5s96.onrender.comapi/reservations/${reservationId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      alert(response.data.message);
      
      const reservationsRes = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/reservations/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(reservationsRes.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://restaurant-management-backend-5s96.onrender.com/api/orders/${orderId}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      const ordersRes = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(ordersRes.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateInventory = async (inventoryId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://restaurant-management-backend-5s96.onrender.com/api/inventory/update/${inventoryId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      const inventoryRes = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/inventory', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventory(inventoryRes.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateMenuItem = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!newMenuItem.name || !newMenuItem.description || !newMenuItem.price || !newMenuItem.category) {
        setError('All fields are required');
        return;
      }

      const response = await axios.post('https://restaurant-management-backend-5s96.onrender.com/api/menu',
        {
          ...newMenuItem,
          price: Number(newMenuItem.price)
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMenuItems([...menuItems, response.data]);
      
      setNewMenuItem({
        name: '',
        description: '',
        price: '',
        category: '',
        isAvailable: true,
        availabilityStatus: 'in-stock'
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create menu item');
    }
  };

  const startEditing = (item) => {
    setEditingMenuId(item._id);
    setEditingMenuItem({ ...item });
  };

  const handleUpdateMenuItem = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://restaurant-management-backend-5s96.onrender.com/api/menu/${editingMenuItem._id}`,
        editingMenuItem,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      const menuRes = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/menu', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMenuItems(menuRes.data);
      setEditingMenuId(null);
      setEditingMenuItem(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteMenuItem = async (menuId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://restaurant-management-backend-5s96.onrender.com/api/menu/${menuId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const menuRes = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/menu', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMenuItems(menuRes.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const filterCurrentAndFutureReservations = (reservations) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    return reservations.filter(reservation => {
      const reservationDate = new Date(reservation.date);
      reservationDate.setHours(0, 0, 0, 0);
      return reservationDate >= currentDate;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="reports-section">
        <h2>Reports Overview</h2>
        <div className="reports-grid">
          <div className="report-card">
            <h3>Daily Sales</h3>
            <p>Total: ${reports.daily?.total || 0}</p>
          </div>
          <div className="report-card">
            <h3>Monthly Performance</h3>
            <p>Revenue: ${reports.monthly?.revenue || 0}</p>
          </div>
          <div className="report-card">
            <h3>Peak Hours</h3>
            <p>Busiest Time: {reports.peakHours?.peak || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="reservations-section">
        <h2>Reservations Management</h2>
        <div className="reservations-grid">
          {filterCurrentAndFutureReservations(reservations)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(reservation => (
              <div key={reservation._id} className="reservation-card">
                <div className="reservation-details">
                  <h3>{reservation.customerName}</h3>
                  <p>Date: {new Date(reservation.date).toLocaleDateString()}</p>
                  <p>Time: {reservation.timeSlot}</p>
                  <p>Guests: {reservation.guestCount}</p>
                  <p>Table: {reservation.table?.tableNumber || 'N/A'}</p>
                  <p className={`status ${reservation.status}`}>
                    Status: {reservation.status}
                  </p>
                </div>
                <div className="reservation-actions">
                  {reservation.status === 'pending' && (
                    <>
                      <button
                        className="confirm-btn"
                        onClick={() => handleReservationStatus(reservation._id, 'confirmed')}
                      >
                        Confirm
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => handleReservationStatus(reservation._id, 'cancelled')}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
          ))}
        </div>
      </div>

      <div className="current-orders">
        <h2>Current Orders</h2>
        <div className="orders-grid">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <p>Order #{order._id}</p>
              <p>Status: {order.status}</p>
              <p>Total: ${order.total}</p>
              <p>Items: {order.items?.length || 0}</p>
              <select 
                value={order.status}
                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="inventory-management">
        <h2>Inventory Management</h2>
        <div className="inventory-grid">
          {inventory.map(item => (
            <div key={item._id} className="inventory-card">
              <p>{item.name}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Status: {item.quantity < item.minimumRequired ? 'Low Stock' : 'In Stock'}</p>
              <input 
                type="number" 
                value={item.quantity}
                onChange={(e) => handleUpdateInventory(item._id, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="menu-management">
        <h2>Menu Management</h2>
        
        {!showMenuForm ? (
          <button
            onClick={() => setShowMenuForm(true)}
            className="btn-show-form"
          >
            Add New Menu Item
          </button>
        ) : (
          <div className="add-menu-form">
            <h3>Add New Menu Item</h3>
            <div className="form-group">
              <input
                type="text"
                placeholder="Name"
                value={newMenuItem.name}
                onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Description"
                value={newMenuItem.description}
                onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Price"
                value={newMenuItem.price}
                onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <select
                value={newMenuItem.category}
                onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                className="form-control"
              >
                <option value="">Select Category</option>
                <option value="appetizers">Appetizers</option>
                <option value="drinks">Drinks</option>
                <option value="maincourse">Main Course</option>
                <option value="desserts">Desserts</option>
              </select>
            </div>
            <div className="form-group">
              <select
                value={newMenuItem.availabilityStatus}
                onChange={(e) => setNewMenuItem({...newMenuItem, availabilityStatus: e.target.value})}
                className="form-control"
              >
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
            <div className="form-actions">
              <button onClick={handleCreateMenuItem} className="btn-add">Add Menu Item</button>
              <button onClick={() => setShowMenuForm(false)} className="btn-cancel">Cancel</button>
            </div>
          </div>
        )}

        <div className="menu-grid">
          {menuItems.map(item => (
            <div key={item._id} className="menu-card">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Price: ${item.price}</p>
              <p>Category: {item.category}</p>
              <p>Status: {item.availabilityStatus}</p>
              <div className="menu-actions">
                <button onClick={() => startEditing(item)}>Edit</button>
                <button onClick={() => handleDeleteMenuItem(item._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
