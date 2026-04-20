import React, { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useDebounce } from '../hooks/useDebounce';
import ProductCard from '../components/ProductCard';
import { FiSearch, FiFilter } from 'react-icons/fi';
import './Products.css';

const Products = () => {
  const { products, categories, loading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortOption, setSortOption] = useState('');
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Search filter
    if (debouncedSearchTerm) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Price Filter
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      if (max) {
        result = result.filter(p => p.price >= min && p.price <= max);
      } else {
        result = result.filter(p => p.price >= min);
      }
    }

    // Sort options
    if (sortOption === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      result = [...result].sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
    }

    return result;
  }, [products, debouncedSearchTerm, selectedCategory, priceRange, sortOption]);

  if (loading) return <div className="page-loader">Loading collection...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>All Collections</h1>
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="shop-layout">
        <aside className="filters-sidebar">
          <div className="filter-group">
            <h3><FiFilter /> Categories</h3>
            <ul>
              <li>
                <button 
                  className={selectedCategory === '' ? 'active' : ''} 
                  onClick={() => setSelectedCategory('')}
                >
                  All Products
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat}>
                  <button 
                    className={selectedCategory === cat ? 'active' : ''} 
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-group">
            <h3>Price Range</h3>
            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
              <option value="">Any Price</option>
              <option value="0-50">Under $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-500">$100 - $500</option>
              <option value="500-">Over $500</option>
            </select>
          </div>

          <div className="filter-group">
            <h3>Sort By</h3>
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </aside>

        <main className="products-main">
          <div className="results-info">
            Showing {filteredProducts.length} results
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="no-results">No products found for your criteria.</div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
