import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import MenuList from '../../components/menu/MenuList';
import Cart from '../../components/cart/Cart';
import api from '../../services/api';
import '../../assets/styles/menupage.css';

const MenuPage = () => {
  const { isAuth, user } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await api.get('/menu');
        setMenuItems(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load menu items. Please try again later.');
        setLoading(false);
        toast.error('Failed to load menu items');
      }
    };

    fetchMenuItems();
  }, []);

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const customizationsKey = JSON.stringify(item.customizations || []);
      const existingItemIndex = prevItems.findIndex(
        cartItem => 
          cartItem.menuItem === item.menuItem &&
          JSON.stringify(cartItem.customizations || []) === customizationsKey
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        toast.success(`Updated ${item.name} quantity in cart`);
        return updatedItems;
      } else {
        toast.success(`Added ${item.name} to cart`);
        return [...prevItems, item];
      }
    });
  };

  const updateCartItemQuantity = (menuItemId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.menuItem === menuItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeCartItem = (menuItemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.menuItem !== menuItemId));
    toast.info('Item removed from cart');
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info('Cart cleared');
  };

  if (loading) {
    return (
      <div className="container-fluid vh-100 menu-page">
        <div className="menu-content loading text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading menu items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid vh-100 menu-page">
        <div className="menu-content error text-center">
          <div className="alert alert-danger" role="alert">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid vh-100 menu-page">
      <div className="row menu-layout">
        <div className="col-12 col-lg-8 menu-content">
          <MenuList
            menuItems={menuItems}
            onAddToCart={addToCart}
          />
        </div>
        
        {isAuth && (
          <div className="col-12 col-lg-4 cart-sidebar">
            <Cart
              cartItems={cartItems}
              updateCartItemQuantity={updateCartItemQuantity}
              removeCartItem={removeCartItem}
              clearCart={clearCart}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;