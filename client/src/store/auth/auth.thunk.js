import { createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "services";
import { cookieExtractor, cookieDestroyer } from "helpers";

export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const { data } = await auth.login(userData);
      return await cookieExtractor(data.data.accessToken);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const { data } = await auth.register(userData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await cookieDestroyer();
    const { data } = await auth.logout();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, thunkAPI) => {
    try {
      const { data } = await auth.verifyToken();
      return await cookieExtractor(data.data.accessToken);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
