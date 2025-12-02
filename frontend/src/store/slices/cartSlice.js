import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const res = await api.get("cart/");
  return res.data;
});
export const addToCart = createAsyncThunk("cart/add", async (payload) => {
  const res = await api.post("cart/", payload);
  return res.data;
});
export const clearCart = createAsyncThunk("cart/clear", async () => {
  await api.delete("cart/clear/");
  return [];
});

const slice = createSlice({
  name: "cart",
  initialState: { items: [], loading:false },
  extraReducers: b => {
    b.addCase(fetchCart.fulfilled, (s,a)=> s.items = a.payload)
     .addCase(addToCart.fulfilled, (s,a)=> { /* push or update */ s.items = [...s.items.filter(i=>i.id!==a.payload.id), a.payload]; });
  }
});
export default slice.reducer;
