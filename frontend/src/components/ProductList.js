import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { ProductSkeletonGrid } from './ProductSkeleton';
import './ProductList.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const fetchProducts = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/products?page=${page}&limit=10`);
      const data = Array.isArray(response.data) ? response.data : response.data.data;
      setProducts(data);
      if (!Array.isArray(response.data) && response.data.pagination) {
        setPagination(response.data.pagination);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const handlePageChange = (newPage) => {
    fetchProducts(newPage);
  };

  if (loading) return <ProductSkeletonGrid count={8} />;
  if (error) return <div className="empty-state" style={{ color: 'red' }}>Error: {error}</div>;

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <h2 className="empty-state__title">No products found</h2>
        <p className="empty-state__text">Check back later for new products.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={!pagination.hasPrev}
          className="pagination__button"
        >
          Previous
        </button>
        <span className="pagination__info">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={!pagination.hasNext}
          className="pagination__button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
