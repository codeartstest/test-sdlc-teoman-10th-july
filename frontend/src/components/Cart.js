import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Your cart is empty</h2>
        <Link to="/" style={{ color: '#3498db', textDecoration: 'none' }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2>Shopping Cart</h2>
      <div>
        {cartItems.map(item => (
          <div key={item.id} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '15px',
            borderBottom: '1px solid #ddd',
            backgroundColor: 'white',
            marginBottom: '10px',
            borderRadius: '4px'
          }}>
            <img 
              src={item.image} 
              alt={item.name}
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'cover',
                borderRadius: '4px'
              }}
            />
            <div style={{ flex: 1, marginLeft: '20px' }}>
              <h3>{item.name}</h3>
              <p>${(item.price || 0).toFixed(2)}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                -
              </button>
              <span style={{ minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#2ecc71',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginLeft: '10px'
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3>Total: ${getTotalPrice().toFixed(2)}</h3>
        <Link to="/checkout">
          <button style={{
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginTop: '10px'
          }}>
            Proceed to Checkout
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
