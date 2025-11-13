import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/customer.css';

const MenuView = () => {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await axios.get('https://restaurant-management-backend-5s96.onrender.com/api/menu');
      setMenu(response.data);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item._id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCart(cart.map(item =>
      item._id === itemId
        ? { ...item, quantity: Math.max(1, newQuantity) }
        : item
    ));
  };

  const placeOrder = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('https://restaurant-management-backend-5s96.onrender.com/api/orders', {
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart([]);
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <div className="menu-container">
      <div className="menu-grid">
        {menu.map(item => (
          <div key={item._id} className="menu-card">
            <img src={item.image} alt={item.name} className="menu-image" />
            <div className="menu-details">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p className="price">${item.price}</p>
              <button onClick={() => addToCart(item)} className="add-to-cart">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="cart-panel">
          <h3>Your Order</h3>
          {cart.map(item => (
            <div key={item._id} className="cart-item">
              <span>{item.name}</span>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
              </div>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
              <button onClick={() => removeFromCart(item._id)} className="remove-item">×</button>
            </div>
          ))}
          <div className="cart-total">
            <strong>Total:</strong>
            <span>${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
          </div>
          <button onClick={placeOrder} className="place-order">
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuView;
