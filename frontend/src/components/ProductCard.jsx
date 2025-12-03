import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const imageUrl =
    product.image?.startsWith("http")
      ? product.image
      : `http://localhost:8000${product.image}`;

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: 10,
        margin: 10,
        width: 250,
        cursor: "pointer",
      }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <img
        src={imageUrl}
        alt={product.name}
        style={{ width: "100%", height: 200, objectFit: "cover" }}
      />

      <h3>{product.name}</h3>
      <p>Brand: {product.brand?.name}</p>
      <p>₹ {product.price}</p>

      <button>Add to Cart</button>
    </div>
  );
}
