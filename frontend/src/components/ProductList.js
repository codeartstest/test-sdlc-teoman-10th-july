import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { ProductSkeletonGrid } from './ProductSkeleton';

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
  if (error) return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>Error: {error}</div>;

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>No products found</h2>
        <p style={{ color: '#666', marginTop: '10px' }}>Check back later for new products.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        padding: '20px 0'
      }}>
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '15px',
        padding: '20px 0',
      }}>
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={!pagination.hasPrev}
          style={{
            padding: '8px 16px',
            backgroundColor: pagination.hasPrev ? '#3498db' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: pagination.hasPrev ? 'pointer' : 'not-allowed',
            fontSize: '1rem',
          }}
        >
          Previous
        </button>
        <span style={{ fontSize: '1rem', color: '#333' }}>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={!pagination.hasNext}
          style={{
            padding: '8px 16px',
            backgroundColor: pagination.hasNext ? '#3498db' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: pagination.hasNext ? 'pointer' : 'not-allowed',
            fontSize: '1rem',
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
