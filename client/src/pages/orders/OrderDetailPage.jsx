import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import '../../assets/styles/orderdetailpage.css';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load order details. Please try again later.');
        setLoading(false);
        toast.error('Failed to load order details');
      }
    };

    fetchOrder();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Order Details</h1>
              <Link to="/orders" className="btn btn-secondary">
                Back to Orders
              </Link>
            </div>
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Order Details</h1>
              <Link to="/orders" className="btn btn-secondary">
                Back to Orders
              </Link>
            </div>
            <div className="alert alert-danger">
              <p className="mb-3">{error || 'Order not found'}</p>
              <button onClick={() => navigate('/orders')} className="btn btn-primary">
                Return to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Order Details</h1>
            <Link to="/orders" className="btn btn-secondary">
              Back to Orders
            </Link>
          </div>
          
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Order Information</h2>
                <div className={`badge ${getStatusClass(order.status)}`}>
                  {order.status}
                </div>
              </div>
              
              <div className="row g-3">
                <div className="col-md-4">
                  <strong>Order ID:</strong>
                  <div>{order._id}</div>
                </div>
                <div className="col-md-4">
                  <strong>Date:</strong>
                  <div>{formatDate(order.orderDate)}</div>
                </div>
                <div className="col-md-4">
                  <strong>Total Amount:</strong>
                  <div>${order.totalAmount.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="mb-3">Order Items</h2>
              {order.items.map((item, index) => (
                <div key={index} className="card mb-2">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <span className="badge bg-secondary">{item.quantity}x</span>
                      </div>
                      <div className="col">
                        <h5 className="mb-1">{item.menuItem.name || `Menu Item ${index + 1}`}</h5>
                        {item.customizations && item.customizations.length > 0 && (
                          <div className="small text-muted">
                            {item.customizations.map((customization, idx) => (
                              <div key={idx}>
                                {customization.optionName}: {customization.selectedValues.join(', ')}
                                {customization.additionalPrice > 0 && (
                                  <span className="ms-1">
                                    +${customization.additionalPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="col-auto">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="card mt-3">
                <div className="card-body">
                  <div className="row mb-2">
                    <div className="col">Subtotal</div>
                    <div className="col-auto">${(order.totalAmount * 0.9).toFixed(2)}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col">Tax (10%)</div>
                    <div className="col-auto">${(order.totalAmount * 0.1).toFixed(2)}</div>
                  </div>
                  <div className="row fw-bold">
                    <div className="col">Total</div>
                    <div className="col-auto">${order.totalAmount.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {order.specialRequests && (
            <div className="card mb-4">
              <div className="card-body">
                <h3>Special Instructions</h3>
                <p className="mb-0">{order.specialRequests}</p>
              </div>
            </div>
          )}
          
          <div className="d-flex gap-2">
            {order.status === 'delivered' && !order.feedback && (
              <Link to={`/feedback/${order._id}`} className="btn btn-primary">
                Leave Feedback
              </Link>
            )}
            <Link to="/menu" className="btn btn-success">
              Order Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;