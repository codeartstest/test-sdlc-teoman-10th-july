import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', color: '#333', marginBottom: '10px' }}>404</h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '20px' }}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        style={{
          color: '#3498db',
          textDecoration: 'none',
          fontSize: '1rem',
          padding: '10px 24px',
          border: '1px solid #3498db',
          borderRadius: '4px'
        }}
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;