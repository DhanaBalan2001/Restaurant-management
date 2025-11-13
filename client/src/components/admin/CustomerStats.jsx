import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerStats = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    newCustomers: 0,
    customerOrders: [] // Initialize as empty array
  });

  useEffect(() => {
    fetchCustomerStats();
  }, []);

  const fetchCustomerStats = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/admin/analytics/customers', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Ensure customerOrders exists in response data
      const customerData = {
        ...response.data,
        customerOrders: response.data.customerOrders || []
      };

      setStats(customerData);
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      // Set default empty array if fetch fails
      setStats(prev => ({ ...prev, customerOrders: [] }));
    }
  };

  return (
    <div className="customer-stats">
      <h2>Customer Analytics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Customers</h3>
          <p>{stats.totalCustomers}</p>
        </div>
        <div className="stat-card">
          <h3>Active Customers</h3>
          <p>{stats.activeCustomers}</p>
        </div>
        <div className="stat-card">
          <h3>New Customers</h3>
          <p>{stats.newCustomers}</p>
        </div>
      </div>

      {stats.customerOrders.length > 0 ? (
        <div className="customer-orders">
          <h3>Recent Customer Orders</h3>
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Last Order</th>
              </tr>
            </thead>
            <tbody>
              {stats.customerOrders.map((customer, index) => (
                <tr key={index}>
                  <td>{customer.name}</td>
                  <td>{customer.orderCount}</td>
                  <td>${customer.totalSpent}</td>
                  <td>{new Date(customer.lastOrder).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No customer orders to display</p>
      )}
    </div>
  );
};

export default CustomerStats;
