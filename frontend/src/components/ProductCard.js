import React from 'react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-card__image"
      />
      <h3 className="product-card__title">{product.name}</h3>
      <p className="product-card__description">{product.description}</p>
      <p className="product-card__price">
        ${(product.price || 0).toFixed(2)}
      </p>
      <button
        onClick={() => addToCart(product)}
        className="product-card__button"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
