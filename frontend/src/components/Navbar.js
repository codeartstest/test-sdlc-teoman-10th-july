import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { getTotalItems } = useCart();

  return (
    <nav style={{
      backgroundColor: '#333',
      padding: '1rem',
      color: 'white'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>
          🛍️ E-Commerce
        </Link>
        <div>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
            Products
          </Link>
          <Link to="/cart" style={{ color: 'white', textDecoration: 'none' }}>
            🛒 Cart ({getTotalItems()})
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
