import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/axios";

// 🔹 Fetch cart
export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const res = await api.get("cart/");
  return res.data;
});

// 🔹 NEW addToCart (updated as you requested)
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product_id, size = "S", quantity = 1 }) => {
    const res = await axios.post("http://localhost:8000/api/cart/add/", {
      product_id,
      size,
      quantity,
    });
    return res.data; // new cart item returned
  }
);

// 🔹 Remove a single item
export const removeFromCart = createAsyncThunk("cart/remove", async (id) => {
  await api.delete(`cart/${id}/`);
  return id;
});

// 🔹 Clear cart
export const clearCart = createAsyncThunk("cart/clear", async () => {
  await api.delete("cart/clear/");
  return [];
});

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], loading: false },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH CART
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })

      // ADD TO CART (NEW)
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items.push(action.payload); // append new cart item
      })

      // REMOVE ITEM
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })

      // CLEAR CART
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default cartSlice.reducer;
