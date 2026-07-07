import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { auth } from "services";
import { cookieExtractor, cookieDestroyer } from "helpers";
import type {
  ApiError,
  LoginRequest,
  MessageResponse,
  RegisterRequest,
  User,
} from "types";

export const login = createAsyncThunk<
  User,
  LoginRequest,
  { rejectValue: ApiError }
>("auth/login", async (userData, thunkAPI) => {
  try {
    const { data } = await auth.login(userData);
    return cookieExtractor(data.data.accessToken);
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(error.response?.data as ApiError);
    }
    return thunkAPI.rejectWithValue(error as ApiError);
  }
});

export const register = createAsyncThunk<
  MessageResponse,
  RegisterRequest,
  { rejectValue: ApiError }
>("auth/register", async (userData, thunkAPI) => {
  try {
    const { data } = await auth.register(userData);
    return data;
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(error.response?.data as ApiError);
    }
    return thunkAPI.rejectWithValue(error as ApiError);
  }
});

export const logout = createAsyncThunk<
  MessageResponse,
  undefined,
  { rejectValue: ApiError }
>("auth/logout", async (_, thunkAPI) => {
  try {
    cookieDestroyer();
    const { data } = await auth.logout();
    return data;
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(error.response?.data as ApiError);
    }
    return thunkAPI.rejectWithValue(error as ApiError);
  }
});

export const verifyToken = createAsyncThunk<
  User,
  undefined,
  { rejectValue: ApiError }
>("auth/verifyToken", async (_, thunkAPI) => {
  try {
    const { data } = await auth.verifyToken();
    return cookieExtractor(data.data.accessToken);
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(error.response?.data as ApiError);
    }
    return thunkAPI.rejectWithValue(error as ApiError);
  }
});
