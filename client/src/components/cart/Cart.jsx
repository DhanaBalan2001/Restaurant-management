import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem';
import './cart.css';

const Cart = ({ cartItems, updateCartItemQuantity, removeCartItem, clearCart }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    const customizationPrice = item.customizations?.reduce((sum, customization) => {
      return sum + (customization.additionalPrice || 0);
    }, 0) || 0;
    
    return total + ((item.price + customizationPrice) * item.quantity);
  }, 0);

  // Calculate tax (assuming 10%)
  const taxRate = 0.1;
  const tax = subtotal * taxRate;

  // Calculate total
  const total = subtotal + tax;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    
    // In a real app, you would process the order here
    setTimeout(() => {
      navigate('/checkout', { 
        state: { 
          cartItems, 
          subtotal, 
          tax, 
          total 
        } 
      });
      setIsCheckingOut(false);
    }, 1000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="inner row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-6">
            <div className="cart-container empty text-center p-4">
              <div className="empty-cart-message">
                <div className="empty-cart-icon">🛒</div>
                <h3 className="h4 mb-3">Your cart is empty</h3>
                <p className="text-muted">Add some delicious items to your cart to get started!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-6">
          <div className="cart-container p-4">
            <div className="cart-header d-flex justify-content-between align-items-center mb-4">
              <h3 className="h4 mb-0">Your Order</h3>
              <button 
                className="btn btn-outline-danger clear-cart-btn" 
                onClick={clearCart}
              >
                Clear All
              </button>
            </div>
            
            <div className="cart-items mb-4">
              {cartItems.map((item) => (
                <CartItem
                  key={`${item.menuItem}-${JSON.stringify(item.customizations)}`}
                  item={item}
                  onUpdateQuantity={updateCartItemQuantity}
                  onRemove={removeCartItem}
                />
              ))}
            </div>
            
            <div className="cart-summary bg-light p-4 rounded">
              <div className="summary-row d-flex justify-content-between mb-3">
                <span className="fs-6">Subtotal</span>
                <span className="fw-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row d-flex justify-content-between mb-3">
                <span className="fs-6">Tax ({(taxRate * 100).toFixed(0)}%)</span>
                <span className="fw-bold">${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total d-flex justify-content-between mb-0">
                <span className="fs-5">Total</span>
                <span className="fs-5 fw-bold">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              className="btn btn-primary w-100 py-3 mt-4 checkout-btn" 
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;