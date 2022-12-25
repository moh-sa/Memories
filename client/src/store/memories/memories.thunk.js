import { createAsyncThunk } from "@reduxjs/toolkit";
import { memory, search } from "services";
import { addUser, removeUser } from "../auth/auth.slice";
import { cookieExtractor, cookieDestroyer } from "helpers";

export const getAll = createAsyncThunk(
  "memories/getAll",
  async (memoryData, thunkAPI) => {
    try {
      const { data } = await memory.getAll(memoryData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const create = createAsyncThunk(
  "memories/create",
  async (memoryData, thunkAPI) => {
    try {
      const { data } = await memory.create(memoryData);
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

export const update = createAsyncThunk(
  "memories/update",
  async (memoryData, thunkAPI) => {
    try {
      const { data } = await memory.update(memoryData);
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

export const _delete = createAsyncThunk(
  "memories/delete",
  async (memoryData, thunkAPI) => {
    try {
      const { data } = await memory._delete(memoryData);
      const userData = await cookieExtractor(data.accessToken.data.accessToken);
      thunkAPI.dispatch(addUser(userData));
      return { ...data, ...memoryData };
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

export const like = createAsyncThunk(
  "memories/like",
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

export const searchReq = createAsyncThunk(
  "memories/search",
  async (searchData, thunkAPI) => {
    try {
      const { data } = await search.search(searchData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
