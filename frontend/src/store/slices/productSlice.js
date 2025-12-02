import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchProducts = createAsyncThunk("products/fetch", async (params) => {
  const res = await api.get("products/", { params });
  return res.data;
});

const slice = createSlice({
  name: "products",
  initialState: { list: [], loading:false },
  extraReducers: (b) => {
    b.addCase(fetchProducts.pending, state => state.loading=true)
     .addCase(fetchProducts.fulfilled, (state, action) => { state.list = action.payload; state.loading=false; });
  }
});
export default slice.reducer;
