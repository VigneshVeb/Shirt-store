import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Profile() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({ full_name: "", address_line: "", city: "", state: "", postal_code: "", phone: "" });

  useEffect(() => {
    api.get("addresses/").then((r) => setAddresses(r.data)).catch(() => setAddresses([]));
  }, []);

  const addAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post("addresses/", form);
      alert("Address added");
      const r = await api.get("addresses/");
      setAddresses(r.data);
    } catch (e) {
      alert("Failed");
    }
  };

  return (
    <div>
      <h2>My Profile</h2>
      <h3>Addresses</h3>
      {addresses.map((a) => (
        <div key={a.id}>
          {a.full_name} — {a.address_line}, {a.city}
        </div>
      ))}
      <h3>Add Address</h3>
      <form onSubmit={addAddress}>
        <input placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
        <input placeholder="Address line" value={form.address_line} onChange={(e) => setForm({ ...form, address_line: e.target.value })} required />
        <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
        <input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
        <input placeholder="Postal code" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
