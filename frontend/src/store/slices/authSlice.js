import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const res = await api.post("auth/login/", credentials);
    const tokens = res.data;
    localStorage.setItem("accessToken", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);
    // If your backend exposes a /users/me/ endpoint, adjust accordingly.
    return { tokens };
  } catch (err) {
    return rejectWithValue(err.response?.data || { detail: "Login failed" });
  }
});

export const register = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    await api.post("auth/register/", payload);
    return {};
  } catch (err) {
    return rejectWithValue(err.response?.data || { detail: "Registration failed" });
  }
});

const initialState = {
  tokens: {
    access: localStorage.getItem("accessToken"),
    refresh: localStorage.getItem("refreshToken"),
  },
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      state.tokens = { access: null, refresh: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false;
        s.tokens = a.payload.tokens;
      })
      .addCase(login.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(register.pending, (s) => (s.loading = true))
      .addCase(register.fulfilled, (s) => (s.loading = false))
      .addCase(register.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;
