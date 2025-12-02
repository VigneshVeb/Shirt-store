import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const createOrder = createAsyncThunk("orders/create", async (payload) => {
  const res = await api.post("orders/", payload);
  return res.data;
});
export const fetchOrders = createAsyncThunk("orders/fetch", async () => {
  const res = await api.get("orders/");
  return res.data;
});

const slice = createSlice({ name:"orders", initialState:{list:[]}, extraReducers:b=>{
  b.addCase(fetchOrders.fulfilled,(s,a)=> s.list=a.payload)
   .addCase(createOrder.fulfilled,(s,a)=> s.list=[a.payload,...s.list]);
}});
export default slice.reducer;
