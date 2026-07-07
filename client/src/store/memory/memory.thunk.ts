import { createAsyncThunk } from "@reduxjs/toolkit";
import { memory } from "services";
import { addUser, removeUser } from "../auth/auth.slice";
import { cookieExtractor, cookieDestroyer, getApiError } from "helpers";
import type {
  ApiError,
  GetSingleMemoryArg,
  LikeMemoryArg,
  MemoryMutationResponse,
  MemoryResponse,
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

export const getSingle = createAsyncThunk<
  MemoryResponse,
  GetSingleMemoryArg,
  { rejectValue: ApiError }
>("memory/getSingle", async (memoryData, thunkAPI) => {
  try {
    const { data } = await memory.getSingle(memoryData);
    return data;
  }
  catch (error) {
    return thunkAPI.rejectWithValue(getApiError(error));
  }
});

export const like = createAsyncThunk<
  MemoryMutationResponse,
  LikeMemoryArg,
  { rejectValue: ApiError }
>("memory/like", async (likeData, thunkAPI) => {
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
