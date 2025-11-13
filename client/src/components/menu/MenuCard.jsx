import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './menucard.css';

const MenuCard = ({ item, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState({});
  const { isAuth } = useAuth();

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value > 0 ? value : 1);
  };

  const handleCustomizationChange = (optionName, value, isMultiSelect) => {
    setSelectedCustomizations(prev => {
      if (isMultiSelect) {
        // For multi-select options
        const currentValues = prev[optionName] || [];
        if (currentValues.includes(value)) {
          return {
            ...prev,
            [optionName]: currentValues.filter(v => v !== value)
          };
        } else {
          return {
            ...prev,
            [optionName]: [...currentValues, value]
          };
        }
      } else {
        // For single-select options
        return {
          ...prev,
          [optionName]: [value]
        };
      }
    });
  };

  const handleAddToCart = () => {
    const customizations = Object.entries(selectedCustomizations).map(([optionName, selectedValues]) => {
      const option = item.customizationOptions?.find(opt => opt.name === optionName);
      const additionalPrice = selectedValues.reduce((total, value) => {
        const optionItem = option?.options.find(opt => opt.name === value);
        return total + (optionItem?.price || 0);
      }, 0);

      return {
        optionName,
        selectedValues,
        additionalPrice
      };
    });

    onAddToCart({
      menuItem: item._id,
      name: item.name,
      price: item.price,
      quantity,
      customizations,
      image: item.image
    });

    // Reset after adding to cart
    setQuantity(1);
    setSelectedCustomizations({});
  };

  return (
    <div className="menu-card">
      <div className="menu-card-image">
        {item.image ? (
          <img src={item.image} alt={item.name} />
        ) : (
          <div className="placeholder-image">No Image</div>
        )}
        {!item.isAvailable && <div className="unavailable-badge">Out of Stock</div>}
      </div>
      <div className="menu-card-content">
        <h3 className="menu-item-name">{item.name}</h3>
        <p className="menu-item-description">{item.description}</p>
        <div className="menu-item-price">${item.price.toFixed(2)}</div>
        
        {item.customizationOptions && item.customizationOptions.length > 0 && (
          <div className="customization-options">
            <h4>Customizations</h4>
            {item.customizationOptions.map((option) => (
              <div key={option.name} className="customization-group">
                <p className="customization-title">
                  {option.name} {option.required && <span className="required">*</span>}
                </p>
                <div className="options-list">
                  {option.options.map((opt) => (
                    <div key={opt.name} className="option-item">
                      <label className="option-label">
                        <input
                          type={option.multiSelect ? "checkbox" : "radio"}
                          name={option.name}
                          value={opt.name}
                          checked={(selectedCustomizations[option.name] || []).includes(opt.name)}
                          onChange={() => handleCustomizationChange(option.name, opt.name, option.multiSelect)}
                        />
                        <span>{opt.name}</span>
                        {opt.price > 0 && <span className="option-price">+${opt.price.toFixed(2)}</span>}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {item.isAvailable && isAuth && (
          <div className="menu-item-actions">
            <div className="quantity-control">
              <button 
                className="quantity-btn" 
                onClick={() => setQuantity(prev => (prev > 1 ? prev - 1 : 1))}
              >
                -
              </button>
              <input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={handleQuantityChange} 
                className="quantity-input"
              />
              <button 
                className="quantity-btn" 
                onClick={() => setQuantity(prev => prev + 1)}
              >
                +
              </button>
            </div>
            <button 
              className="add-to-cart-btn" 
              onClick={handleAddToCart}
              disabled={!item.isAvailable}
            >
              Add to Cart
            </button>
          </div>
        )}
        
        {(!item.isAvailable || !isAuth) && (
          <div className="menu-item-actions">
            {!item.isAvailable && (
              <p className="out-of-stock-message">This item is currently unavailable</p>
            )}
            {!isAuth && (
              <p className="login-message">Please login to order</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuCard;