import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const dispatch = useDispatch();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(form)).unwrap();
      nav("/");
    } catch (err) {
      alert(err.detail || "Login failed");
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 420 }}>
      <h2>Login</h2>
      <div>
        <input placeholder="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
      </div>
      <div>
        <input type="password" placeholder="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
