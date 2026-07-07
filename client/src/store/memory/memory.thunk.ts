import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { memory } from "services";
import { addUser, removeUser } from "../auth/auth.slice";
import { cookieExtractor, cookieDestroyer } from "helpers";
import type {
  ApiError,
  GetSingleMemoryArg,
  LikeMemoryArg,
  MemoryMutationResponse,
  MemoryResponse,
} from "types";

export const getSingle = createAsyncThunk<
  MemoryResponse,
  GetSingleMemoryArg,
  { rejectValue: ApiError }
>("memory/getSingle", async (memoryData, thunkAPI) => {
  try {
    const { data } = await memory.getSingle(memoryData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(error.response?.data as ApiError);
    }
    return thunkAPI.rejectWithValue(error as ApiError);
  }
});

export const like = createAsyncThunk<
  MemoryMutationResponse,
  LikeMemoryArg,
  { rejectValue: ApiError }
>("memory/like", async (likeData, thunkAPI) => {
  try {
    const { data } = await memory.like(likeData);
    const userData = await cookieExtractor(data.accessToken.data.accessToken);
    thunkAPI.dispatch(addUser(userData));
    return data;
  } catch (error) {
    const errorData = axios.isAxiosError(error)
      ? (error.response?.data as ApiError | undefined)
      : undefined;
    if (errorData?.accessToken || errorData?.refreshToken) {
      thunkAPI.dispatch(removeUser());
      await cookieDestroyer();
    }
    return thunkAPI.rejectWithValue(errorData ?? (error as ApiError));
  }
});
