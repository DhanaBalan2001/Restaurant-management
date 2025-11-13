import React from 'react';
import './cartitem.css';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      onUpdateQuantity(item.menuItem, newQuantity);
    }
  };

  // Calculate total price including customizations
  const customizationPrice = item.customizations?.reduce((total, customization) => {
    return total + (customization.additionalPrice || 0);
  }, 0) || 0;
  
  const itemTotal = (item.price + customizationPrice) * item.quantity;

  return (
    <div className="cart-item row align-items-center p-3">
      <div className="cart-item-image col-12 col-sm-3">
        {item.image ? (
          <img src={item.image} alt={item.name} className="img-fluid" />
        ) : (
          <div className="placeholder-image">No Image</div>
        )}
      </div>
      <div className="cart-item-details col-12 col-sm-5">
        <h4 className="cart-item-name">{item.name}</h4>
        <div className="cart-item-price">${item.price.toFixed(2)}</div>
        
        {item.customizations && item.customizations.length > 0 && (
          <div className="cart-item-customizations">
            {item.customizations.map((customization, index) => (
              <div key={index} className="customization-detail">
                <span className="customization-name">{customization.optionName}:</span>
                <span className="customization-values">{customization.selectedValues.join(', ')}</span>
                {customization.additionalPrice > 0 && (
                  <span className="customization-price">+${customization.additionalPrice.toFixed(2)}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="cart-item-actions col-12 col-sm-4">
        <div className="cart-quantity-control d-flex align-items-center justify-content-center mb-2">
          <button 
            className="cart-quantity-btn btn btn-outline-secondary" 
            onClick={() => handleQuantityChange(item.quantity - 1)}
          >
            -
          </button>
          <span className="cart-quantity mx-2">{item.quantity}</span>
          <button 
            className="cart-quantity-btn btn btn-outline-secondary" 
            onClick={() => handleQuantityChange(item.quantity + 1)}
          >
            +
          </button>
        </div>
        <div className="cart-item-total text-center mb-2">${itemTotal.toFixed(2)}</div>
        <button 
          className="cart-remove-btn btn btn-danger d-block mx-auto" 
          onClick={() => onRemove(item.menuItem)}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default CartItem;