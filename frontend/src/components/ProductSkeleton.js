import React from 'react';

const ProductSkeleton = () => {
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
      <div style={{
        width: '100%',
        height: '200px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        marginBottom: '10px',
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
      <div style={{
        height: '20px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        marginBottom: '8px',
        width: '70%',
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
      <div style={{
        height: '16px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        marginBottom: '8px',
        width: '100%',
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
      <div style={{
        height: '16px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        marginBottom: '12px',
        width: '90%',
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
      <div style={{
        height: '24px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        width: '40%',
        marginBottom: '10px',
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
      <div style={{
        height: '40px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
    </div>
  );
};

const ProductSkeletonGrid = ({ count = 8 }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
      padding: '20px 0'
    }}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
};

export { ProductSkeletonGrid };
export default ProductSkeleton;