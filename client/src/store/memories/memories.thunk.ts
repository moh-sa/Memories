import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { memory, search } from "services";
import { addUser, removeUser } from "../auth/auth.slice";
import { cookieExtractor, cookieDestroyer } from "helpers";
import type {
  AccessTokenResponse,
  ApiError,
  DeleteMemoryArg,
  GetMemoriesArg,
  LikeMemoryArg,
  MemoriesResponse,
  MemoryMutationResponse,
  SearchArg,
} from "types";

export const getAll = createAsyncThunk<
  MemoriesResponse,
  GetMemoriesArg,
  { rejectValue: ApiError }
>("memories/getAll", async (memoryData, thunkAPI) => {
  try {
    const { data } = await memory.getAll(memoryData);
    return data;
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(error.response?.data as ApiError);
    }
    return thunkAPI.rejectWithValue(error as ApiError);
  }
});

export const create = createAsyncThunk<
  MemoryMutationResponse,
  unknown,
  { rejectValue: ApiError }
>("memories/create", async (memoryData, thunkAPI) => {
  try {
    const { data } = await memory.create(memoryData);
    const userData = cookieExtractor(data.accessToken.data.accessToken);
    thunkAPI.dispatch(addUser(userData));
    return data;
  }
  catch (error) {
    const errorData = axios.isAxiosError(error)
      ? (error.response?.data as ApiError | undefined)
      : undefined;
    if (errorData?.accessToken || errorData?.refreshToken) {
      thunkAPI.dispatch(removeUser());
      cookieDestroyer();
    }
    return thunkAPI.rejectWithValue(errorData ?? (error as ApiError));
  }
});

export const update = createAsyncThunk<
  MemoryMutationResponse,
  unknown,
  { rejectValue: ApiError }
>("memories/update", async (memoryData, thunkAPI) => {
  try {
    const { data } = await memory.update(memoryData);
    const userData = cookieExtractor(data.accessToken.data.accessToken);
    thunkAPI.dispatch(addUser(userData));
    return data;
  }
  catch (error) {
    const errorData = axios.isAxiosError(error)
      ? (error.response?.data as ApiError | undefined)
      : undefined;
    if (errorData?.accessToken || errorData?.refreshToken) {
      thunkAPI.dispatch(removeUser());
      cookieDestroyer();
    }
    return thunkAPI.rejectWithValue(errorData ?? (error as ApiError));
  }
});

export const _delete = createAsyncThunk<
  DeleteMemoryArg & { accessToken: AccessTokenResponse },
  DeleteMemoryArg,
  { rejectValue: ApiError }
>("memories/delete", async (memoryData, thunkAPI) => {
  try {
    const { data } = await memory._delete(memoryData);
    const userData = cookieExtractor(data.accessToken.data.accessToken);
    thunkAPI.dispatch(addUser(userData));
    return { ...data, ...memoryData };
  }
  catch (error) {
    const errorData = axios.isAxiosError(error)
      ? (error.response?.data as ApiError | undefined)
      : undefined;
    if (errorData?.accessToken || errorData?.refreshToken) {
      thunkAPI.dispatch(removeUser());
      cookieDestroyer();
    }
    return thunkAPI.rejectWithValue(errorData ?? (error as ApiError));
  }
});

export const like = createAsyncThunk<
  MemoryMutationResponse,
  LikeMemoryArg,
  { rejectValue: ApiError }
>("memories/like", async (likeData, thunkAPI) => {
  try {
    const { data } = await memory.like(likeData);
    const userData = cookieExtractor(data.accessToken.data.accessToken);
    thunkAPI.dispatch(addUser(userData));
    return data;
  }
  catch (error) {
    const errorData = axios.isAxiosError(error)
      ? (error.response?.data as ApiError | undefined)
      : undefined;
    if (errorData?.accessToken || errorData?.refreshToken) {
      thunkAPI.dispatch(removeUser());
      cookieDestroyer();
    }
    return thunkAPI.rejectWithValue(errorData ?? (error as ApiError));
  }
});

export const searchReq = createAsyncThunk<
  MemoriesResponse,
  SearchArg,
  { rejectValue: ApiError }
>("memories/search", async (searchData, thunkAPI) => {
  try {
    const { data } = await search.search(searchData);
    return data;
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(error.response?.data as ApiError);
    }
    return thunkAPI.rejectWithValue(error as ApiError);
  }
});
