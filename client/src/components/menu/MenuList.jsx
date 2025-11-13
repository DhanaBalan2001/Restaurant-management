import React, { useState } from 'react';
import MenuCard from './MenuCard';
import './menulist.css';

const MenuList = ({ menuItems, onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'appetizers', name: 'Appetizers' },
    { id: 'maincourse', name: 'Main Course' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'drinks', name: 'Drinks' }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-12 col-md-6 mb-3">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control search-input"
            />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="category-filters d-flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                className={`btn ${activeCategory === category.id ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="alert alert-info text-center">
          <p className="mb-0">No menu items found. Please try a different search or category.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {filteredItems.map(item => (
            <div className="col" key={item._id}>
              <MenuCard
                item={item}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuList;