import { createAsyncThunk } from "@reduxjs/toolkit";
import { memory } from "services";
import { addUser, removeUser } from "../auth/auth.slice";
import { cookieExtractor, cookieDestroyer } from "helpers";

export const getSingle = createAsyncThunk(
  "memory/getSingle",
  async (memoryData, thunkAPI) => {
    try {
      const { data } = await memory.getSingle(memoryData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const like = createAsyncThunk(
  "memory/like",
  async (likeData, thunkAPI) => {
    try {
      const { data } = await memory.like(likeData);
      const userData = await cookieExtractor(data.accessToken.data.accessToken);
      thunkAPI.dispatch(addUser(userData));
      return data;
    } catch (error) {
      if (
        error.response.data?.accessToken ||
        error.response.data?.refreshToken
      ) {
        thunkAPI.dispatch(removeUser());
        await cookieDestroyer();
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
