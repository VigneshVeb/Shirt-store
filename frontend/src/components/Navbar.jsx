import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";

export default function Navbar() {
  const cart = useSelector((s) => s.cart.items);
  const auth = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const doLogout = () => {
    dispatch(logout());
    nav("/");
  };

  return (
    <nav style={{ padding: 10, display: "flex", gap: 20, borderBottom: "1px solid #ddd" }}>
      <Link to="/">ShirtStore</Link>
      <Link to="/products">Products</Link>
      <Link to="/cart">Cart({cart?.length || 0})</Link>
      {auth.tokens.access ? (
        <>
          <Link to="/orders">Orders</Link>
          <Link to="/account">Account</Link>
          <button onClick={doLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
