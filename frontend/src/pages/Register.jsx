import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const dispatch = useDispatch();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(register(form)).unwrap();
      alert("Registered. Please login.");
      nav("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 420 }}>
      <h2>Register</h2>
      <div>
        <input placeholder="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
      </div>
      <div>
        <input type="email" placeholder="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div>
        <input type="password" placeholder="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      </div>
      <button type="submit">Register</button>
    </form>
  );
}
