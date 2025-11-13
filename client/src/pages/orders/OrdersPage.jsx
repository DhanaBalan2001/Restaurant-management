import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import '../../assets/styles/orderspage.css';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/user');
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load orders. Please try again later.');
        setLoading(false);
        toast.error('Failed to load orders');
      }
    };

    fetchOrders();
  }, []);

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
            <h1>My Orders</h1>
            <div className="text-center mt-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <h1>My Orders</h1>
            <div className="alert alert-danger mt-4" role="alert">
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="btn btn-danger">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <h1>My Orders</h1>
          <Link to="/menu" className="btn btn-primary">
            Back to Menu
          </Link>
        </div>
      </div>
      
      <div className="row">
        {orders.length === 0 ? (
          <div className="col-12 text-center">
            <p className="mb-4">You haven't placed any orders yet.</p>
            <Link to="/menu" className="btn btn-success">
              Start Ordering
            </Link>
          </div>
        ) : (
          <div className="col-12">
            {orders.map((order) => (
              <div key={order._id} className="card mb-4 shadow-sm border-0 rounded-3">
                <div className="card-header bg-light border-bottom-0 py-3">
                  <div className="row">
                    <div className="col-md-4">
                      <strong className="text-muted">Order ID:</strong> 
                      <span className="ms-2">{order._id}</span>
                    </div>
                    <div className="col-md-4">
                      <strong className="text-muted">Date:</strong> 
                      <span className="ms-2">{formatDate(order.orderDate)}</span>
                    </div>
                    <div className="col-md-4">
                      <strong className="text-muted">Status:</strong> 
                      <span className={`badge ms-2 ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="card-body bg-white">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <tbody>
                        {order.items.map((item, index) => (
                          <tr key={index} className="align-middle">
                            <td className="col-1 fw-bold">{item.quantity}x</td>
                            <td className="col">{item.menuItem.name || `Menu Item ${index + 1}`}</td>
                            <td className="col-2 text-end fw-bold">${(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="card-footer bg-white border-top py-3">
                  <div className="row align-items-center">
                    <div className="col">
                      <strong className="fs-5">Total:</strong> 
                      <span className="fs-5 ms-2">${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="col text-end">
                      <Link to={`/orders/${order._id}`} className="btn btn-outline-primary rounded-pill px-4">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;