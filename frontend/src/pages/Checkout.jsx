import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../store/slices/orderSlice";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState("");
  const dispatch = useDispatch();
  const nav = useNavigate();
  const cart = useSelector((s) => s.cart.items);

  useEffect(() => {
    api.get("addresses/").then((r) => setAddresses(r.data)).catch(() => setAddresses([]));
  }, []);

  const placeOrder = async () => {
    if (!addressId) return alert("Select address");
    try {
      await dispatch(createOrder({ address_id: addressId })).unwrap();
      alert("Order placed");
      nav("/orders");
    } catch (e) {
      alert("Order failed");
    }
  };

  const total = cart.reduce((acc, it) => acc + Number(it.product.price) * it.quantity, 0);

  return (
    <div>
      <h2>Checkout</h2>
      <div>
        <h3>Address</h3>
        {addresses.map((a) => (
          <div key={a.id}>
            <label>
              <input type="radio" name="address" value={a.id} onChange={(e) => setAddressId(e.target.value)} /> {a.full_name} - {a.address_line}, {a.city}
            </label>
          </div>
        ))}
        {addresses.length === 0 && <div>No addresses. Add via account API or admin.</div>}
      </div>
      <div style={{ marginTop: 12 }}>
        <h3>Order Summary</h3>
        <div>Total: ₹{total}</div>
        <button onClick={placeOrder}>Place Order (payment integration pending)</button>
      </div>
    </div>
  );
}
