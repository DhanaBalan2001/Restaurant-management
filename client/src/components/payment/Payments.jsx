import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './payments.css';

const Payment = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (sessionId) {
      // Payment successful, show message and redirect
      setTimeout(() => {
        navigate('/');
      }, 3000);
      return;
    }

    // Initialize payment if no session ID
    const initiatePayment = async () => {
      try {
        const response = await axios.post(`https://restaurant-management-backend-5s96.onrender.com/api/payment/create-session`, {
          reservationId
        });
        window.location.href = response.data.url;
      } catch (err) {
        setError('Payment initialization failed. Please try again.');
        setLoading(false);
      }
    };

    initiatePayment();
  }, [reservationId, navigate, searchParams]);

  // Show success message only after payment completion
  if (searchParams.get('session_id')) {
    return (
      <div className="payment-container">
        <div className="success">
          <h2>Payment Successful!</h2>
          <p>Your reservation is confirmed.</p>
          <p>Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      {loading ? (
        <div className="loading">
          <h2>Initializing Payment...</h2>
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="error">
          <h2>{error}</h2>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      ) : null}
    </div>
  );
};

export default Payment;
