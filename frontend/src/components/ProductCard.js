import React from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <img 
        src={product.image} 
        alt={product.name}
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          borderRadius: '4px'
        }}
      />
      <h3 style={{ margin: '10px 0' }}>{product.name}</h3>
      <p style={{ color: '#666', flex: 1 }}>{product.description}</p>
      <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2c3e50' }}>
        ${(product.price || 0).toFixed(2)}
      </p>
      <button
        onClick={() => addToCart(product)}
        style={{
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px',
          fontSize: '1rem'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
