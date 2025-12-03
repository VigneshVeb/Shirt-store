import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart, clearCart } from "../store/slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const items = useSelector((s) => s.cart.items);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const total = items.reduce((acc, it) => acc + Number(it.product.price) * it.quantity, 0);

  return (
    <div>
      <h2>Your Cart</h2>
      {items.length === 0 && <div>Cart empty. <Link to="/products">Shop now</Link></div>}
      <div>
        {items.map((it) => (
          <div key={it.id} style={{ borderBottom: "1px solid #eee", padding: 8, display: "flex", justifyContent: "space-between" }}>
            <div>
              <strong>{it.product.name}</strong> <br />
              Size: {it.size} | Qty: {it.quantity} <br />
              Price: ₹{it.product.price}
            </div>
            <div>
              <button onClick={() => dispatch(removeFromCart(it.id))}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      {items.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h3>Total: ₹{total}</h3>
          <button onClick={() => nav("/checkout")}>Proceed to Checkout</button>
          <button onClick={() => dispatch(clearCart())} style={{ marginLeft: 8 }}>
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
}
