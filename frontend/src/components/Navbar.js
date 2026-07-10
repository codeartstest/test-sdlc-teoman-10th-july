import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { getTotalItems } = useCart();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__title">
        E-Commerce
      </Link>
      <div>
        <Link to="/" className="navbar__cart-link">
          Products
        </Link>
        <Link to="/cart" className="navbar__cart-link">
          Cart
          <span className="navbar__cart-count">{getTotalItems()}</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
