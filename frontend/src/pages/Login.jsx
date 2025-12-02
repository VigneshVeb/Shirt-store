import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const [form,setForm] = useState({username:"",password:""});
  const dispatch = useDispatch();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(form)).unwrap();
      nav("/");
    } catch(err){ alert("Login failed"); }
  };
  return (
    <form onSubmit={submit}>
      <input value={form.username} onChange={e=>setForm({...form,username:e.target.value})} placeholder="username" />
      <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="password" />
      <button type="submit">Login</button>
    </form>
  );
}
