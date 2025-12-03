import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../store/slices/orderSlice";

export default function Orders() {
  const dispatch = useDispatch();
  const orders = useSelector((s) => s.orders.list);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div>
      <h2>My Orders</h2>
      {orders.length === 0 && <div>No orders yet.</div>}
      {orders.map((o) => (
        <div key={o.id} style={{ border: "1px solid #eee", padding: 8, marginBottom: 8 }}>
          <div>Order #{o.id} — ₹{o.total_amount} — {o.status}</div>
          <div>Placed: {new Date(o.created_at).toLocaleString()}</div>
          <div>
            Items:
            <ul>
              {o.items?.map((it) => (
                <li key={it.id}>{it.product?.name} — {it.quantity} × ₹{it.price}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
