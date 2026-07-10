import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Navigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Order placed successfully!');
    clearCart();
    navigate('/');
  };

  if (cartItems.length === 0) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="checkout__summary">
        <h3 className="checkout__summary-title">Order Summary</h3>
        {cartItems.map(item => (
          <div key={item.id} className="checkout__summary-item">
            <span>{item.name} x {item.quantity}</span>
            <span>${((item.price || 0) * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="checkout__summary-total">
          <span>Total:</span>
          <span>${getTotalPrice().toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="checkout__form">
        <h3 className="checkout__form-title">Shipping Information</h3>
        <div className="form-group">
          <label className="form-group__label">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-group__input"
          />
        </div>
        <div className="form-group">
          <label className="form-group__label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-group__input"
          />
        </div>
        <div className="form-group">
          <label className="form-group__label">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="form-group__input"
          />
        </div>
        <div className="form-group">
          <label className="form-group__label">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="form-group__input"
          />
        </div>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-group__label">Zip Code</label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            required
            className="form-group__input"
          />
        </div>
        <button type="submit" className="checkout__button">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
