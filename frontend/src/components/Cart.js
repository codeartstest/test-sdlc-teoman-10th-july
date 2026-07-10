import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <Link to="/" className="cart-summary__button">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      <div>
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <img
              src={item.image}
              alt={item.name}
              className="cart-item__image"
            />
            <div className="cart-item__details">
              <h3 className="cart-item__name">{item.name}</h3>
              <p className="cart-item__price">${(item.price || 0).toFixed(2)}</p>
            </div>
            <div className="cart-item__controls">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="cart-item__button cart-item__button--remove"
              >
                -
              </button>
              <span className="cart-item__quantity">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="cart-item__button"
              >
                +
              </button>
              <button
                onClick={() => removeFromCart(item.id)}
                className="cart-item__button cart-item__button--remove"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3 className="cart-summary__total">Total: ${getTotalPrice().toFixed(2)}</h3>
        <Link to="/checkout" className="cart-summary__button">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default Cart;
