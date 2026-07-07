import { createAsyncThunk } from "@reduxjs/toolkit";
import { memory, search } from "services";
import { addUser, removeUser } from "../auth/auth.slice";
import { cookieExtractor, cookieDestroyer, getApiError, isApiError } from "helpers";
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

function handleAuthTokenError(
  error: unknown,
  thunkAPI: { dispatch: (action: unknown) => void },
): ApiError {
  const errorData = getApiError(error);
  if (errorData.accessToken || errorData.refreshToken) {
    thunkAPI.dispatch(removeUser());
    cookieDestroyer();
  }
  return errorData;
}

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
    return thunkAPI.rejectWithValue(getApiError(error));
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
    return thunkAPI.rejectWithValue(handleAuthTokenError(error, thunkAPI));
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
    return thunkAPI.rejectWithValue(handleAuthTokenError(error, thunkAPI));
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
    return thunkAPI.rejectWithValue(handleAuthTokenError(error, thunkAPI));
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
    return thunkAPI.rejectWithValue(handleAuthTokenError(error, thunkAPI));
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
    return thunkAPI.rejectWithValue(getApiError(error));
  }
});

export { isApiError };
