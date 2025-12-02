import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const login = createAsyncThunk("auth/login", async (credentials) => {
  const res = await api.post("auth/login/", credentials);
  const tokens = res.data;
  localStorage.setItem("accessToken", tokens.access);
  localStorage.setItem("refreshToken", tokens.refresh);
  // fetch user
  const me = await api.get("users/me/").catch(()=>null);
  if(me) localStorage.setItem("user", JSON.stringify(me.data));
  return { tokens, user: me ? me.data : null };
});

export const register = createAsyncThunk("auth/register", async (data) => {
  await api.post("auth/register/", data);
  return {};
});

const initialState = { user: JSON.parse(localStorage.getItem("user") || "null"), loading:false };

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.loading = false;
    }).addCase(login.pending, (state)=> state.loading=true);
  }
});

export const { logout } = slice.actions;
export default slice.reducer;
