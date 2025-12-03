import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import { addToCart } from "../store/slices/cartSlice";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  const nav = useNavigate();

  useEffect(() => {
    api
      .get(`products/${id}/`)
      .then((r) => setProduct(r.data))
      .catch(console.error);
  }, [id]);

  const handleAdd = async () => {
    if (!size) return alert("Please select size");
    try {
      await dispatch(
        addToCart({ product_id: product.id, size, quantity: qty })
      ).unwrap();
      nav("/cart");
    } catch (e) {
      alert("Add to cart failed");
    }
  };

  if (!product) return <div>Loading...</div>;

  // Clean image logic
  const imgSrc = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${product.image}`
    : "/placeholder.png";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div>
        <img
          src={imgSrc}
          alt={product.name}
          style={{ width: "100%" }}
        />
      </div>

      <div>
        <h2>{product.name}</h2>
        <p>Brand: {product.brand?.name}</p>
        <p>Price: ₹{product.price}</p>
        <p>{product.description}</p>

        <div>
          <label>
            Size:
            <select value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="">Select</option>
              {product.sizes?.map((s) => (
                <option key={s.id} value={s.size}>
                  {s.size} ({s.stock})
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label>
            Quantity:
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
          </label>
        </div>

        <button onClick={handleAdd}>Add to cart</button>
      </div>
    </div>
  );
}
