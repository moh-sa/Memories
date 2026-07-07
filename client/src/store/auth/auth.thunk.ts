import { createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "services";
import { cookieExtractor, cookieDestroyer, getApiError } from "helpers";
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
    return thunkAPI.rejectWithValue(getApiError(error));
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
    return thunkAPI.rejectWithValue(getApiError(error));
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
    return thunkAPI.rejectWithValue(getApiError(error));
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
    return thunkAPI.rejectWithValue(getApiError(error));
  }
});
