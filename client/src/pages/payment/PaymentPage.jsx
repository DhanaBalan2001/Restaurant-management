import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../../services/api';
import '../../assets/styles/paymentpage.css';

// Load Stripe outside of component to avoid recreating it on renders
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51PofX4JMju3UYc4uD6W6tDJlIUPaFO5FuolZqRUpLpKd075IMhe1KvvqHEXJGFFPJUZqsHHkQGSwrXKvQOk9UMC500pTvtfbsg');

const PaymentForm = ({ clientSecret, reservation }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: reservation.customerName,
            email: reservation.customerEmail
          }
        }
      });
      
      if (result.error) {
        setError(result.error.message);
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!');
        navigate('/payment/success', { 
          state: { reservation }
        });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      toast.error('Payment processing failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="card-element-container">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      
      {error && <div className="payment-error">{error}</div>}
      
      <button 
        type="submit" 
        disabled={!stripe || loading}
        className="payment-button"
      >
        {loading ? 'Processing...' : `Pay $${(reservation.amount / 100).toFixed(2)}`}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchReservationAndCreateIntent = async () => {
      try {
        // Fetch reservation details
        const reservationResponse = await api.get(`/reservations/${reservationId}`);
        const reservationData = reservationResponse.data;
        
        // Check if payment is already completed
        if (reservationData.paymentStatus === 'paid') {
          navigate('/payment/success', { 
            state: { reservation: reservationData }
          });
          return;
        }
        
        // Create payment intent
        const paymentResponse = await api.post('/payment/create-payment-intent', {
          reservationId
        });
        
        // Calculate amount based on guest count (same logic as server)
        const amount = reservationData.guestCount * 1500; // $15 per guest in cents
        
        setReservation({
          ...reservationData,
          amount
        });
        setClientSecret(paymentResponse.data.clientSecret);
        setLoading(false);
      } catch (err) {
        console.error('Error setting up payment:', err);
        setError('Failed to load payment information. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchReservationAndCreateIntent();
  }, [reservationId]);
  
  if (loading) {
    return (
      <div className="payment-page">
        <div className="payment-container loading">
          <div className="spinner"></div>
          <p>Loading payment information...</p>
        </div>
      </div>
    );
  }
  
  if (error || !reservation) {
    return (
      <div className="payment-page">
        <div className="payment-container error">
          <h2>Payment Error</h2>
          <p>{error || 'Reservation not found'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Complete Your Payment</h1>
          <p>Secure payment processing by Stripe</p>
        </div>
        
        <div className="reservation-summary">
          <h2>Reservation Summary</h2>
          <div className="summary-details">
            <div className="summary-row">
              <span>Date:</span>
              <span>{new Date(reservation.date).toLocaleDateString()}</span>
            </div>
            <div className="summary-row">
              <span>Time:</span>
              <span>{reservation.timeSlot}</span>
            </div>
            <div className="summary-row">
              <span>Guests:</span>
              <span>{reservation.guestCount}</span>
            </div>
            <div className="summary-row">
              <span>Table:</span>
              <span>Table {reservation.table?.tableNumber || 'TBD'}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${(reservation.amount / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="payment-section">
          <h2>Payment Information</h2>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm 
              clientSecret={clientSecret} 
              reservation={reservation} 
            />
          </Elements>
        </div>
        
        <div className="payment-footer">
          <p>Your card will be charged ${(reservation.amount / 100).toFixed(2)}</p>
          <p>By completing this payment, you agree to our terms and conditions.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
