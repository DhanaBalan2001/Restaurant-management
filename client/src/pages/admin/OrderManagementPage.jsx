import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import '../../assets/styles/ordermanagementpage.css';

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, dateFilter]);

  const fetchOrders = async () => {
    try {
      let url = '/orders';
      const params = {};
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      if (dateFilter) {
        params.date = dateFilter;
      }
      
      const response = await api.get(url, { params });
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load orders');
      setLoading(false);
      toast.error('Failed to load orders');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      
      // Update order in state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      // Update selected order if it's the one being changed
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setSelectedOrder(response.data);
      setShowOrderDetails(true);
    } catch (error) {
      toast.error('Failed to load order details');
    }
  };

  const closeOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'preparing':
        return 'status-preparing';
      case 'ready':
        return 'status-ready';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="order-management loading">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-management error">
        <p>{error}</p>
        <button onClick={fetchOrders} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="order-management">
      <div className="page-header">
        <h2>Order Management</h2>
      </div>
      
      <div className="order-filters">
        <div className="filter-group">
          <label htmlFor="statusFilter">Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="dateFilter">Date:</label>
          <input
            type="date"
            id="dateFilter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        
        <button 
          className="clear-filters-btn"
          onClick={() => {
            setStatusFilter('all');
            setDateFilter('');
          }}
        >
          Clear Filters
        </button>
      </div>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders found matching the selected filters.</p>
        </div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>#{order._id.substring(0, 8)}</td>
                  <td>{order.customer?.username || 'Guest'}</td>
                  <td>
                    <div>{formatDate(order.orderDate)}</div>
                    <div className="order-time">{formatTime(order.orderDate)}</div>
                  </td>
                  <td>{order.items.length} items</td>
                  <td>{formatCurrency(order.totalAmount)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div className="order-actions">
                      <button 
                        className="view-btn"
                        onClick={() => handleViewDetails(order._id)}
                      >
                        View
                      </button>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {showOrderDetails && selectedOrder && (
        <div className="order-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Order Details</h3>
              <button className="close-btn" onClick={closeOrderDetails}>×</button>
            </div>
            <div className="modal-body">
              <div className="order-info">
                <div className="info-group">
                  <span className="info-label">Order ID:</span>
                  <span className="info-value">{selectedOrder._id}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Date:</span>
                  <span className="info-value">
                    {formatDate(selectedOrder.orderDate)} at {formatTime(selectedOrder.orderDate)}
                  </span>
                </div>
                <div className="info-group">
                  <span className="info-label">Customer:</span>
                  <span className="info-value">
                    {selectedOrder.customer?.username || 'Guest'}
                  </span>
                </div>
                <div className="info-group">
                  <span className="info-label">Status:</span>
                  <span className={`info-value status-badge ${getStatusClass(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>
              
              <div className="order-items-list">
                <h4>Order Items</h4>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="item-name">
                            {item.menuItem?.name || `Item #${index + 1}`}
                          </div>
                          {item.customizations && item.customizations.length > 0 && (
                            <div className="item-customizations">
                              {item.customizations.map((customization, idx) => (
                                <div key={idx} className="customization">
                                  {customization.optionName}: {customization.selectedValues.join(', ')}
                                  {customization.additionalPrice > 0 && (
                                    <span className="additional-price">
                                      +{formatCurrency(customization.additionalPrice)}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="total-label">Total</td>
                      <td className="total-value">{formatCurrency(selectedOrder.totalAmount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {selectedOrder.specialRequests && (
                <div className="special-requests">
                  <h4>Special Requests</h4>
                  <p>{selectedOrder.specialRequests}</p>
                </div>
              )}
              
              <div className="status-update">
                <h4>Update Status</h4>
                <div className="status-buttons">
                  <button 
                    className={`status-btn pending ${selectedOrder.status === 'pending' ? 'active' : ''}`}
                    onClick={() => handleStatusChange(selectedOrder._id, 'pending')}
                  >
                    Pending
                  </button>
                  <button 
                    className={`status-btn confirmed ${selectedOrder.status === 'confirmed' ? 'active' : ''}`}
                    onClick={() => handleStatusChange(selectedOrder._id, 'confirmed')}
                  >
                    Confirmed
                  </button>
                  <button 
                    className={`status-btn preparing ${selectedOrder.status === 'preparing' ? 'active' : ''}`}
                    onClick={() => handleStatusChange(selectedOrder._id, 'preparing')}
                  >
                    Preparing
                  </button>
                  <button 
                    className={`status-btn ready ${selectedOrder.status === 'ready' ? 'active' : ''}`}
                    onClick={() => handleStatusChange(selectedOrder._id, 'ready')}
                  >
                    Ready
                  </button>
                  <button 
                    className={`status-btn delivered ${selectedOrder.status === 'delivered' ? 'active' : ''}`}
                    onClick={() => handleStatusChange(selectedOrder._id, 'delivered')}
                  >
                    Delivered
                  </button>
                  <button 
                    className={`status-btn cancelled ${selectedOrder.status === 'cancelled' ? 'active' : ''}`}
                    onClick={() => handleStatusChange(selectedOrder._id, 'cancelled')}
                  >
                    Cancelled
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagementPage;
