import { createAsyncThunk } from "@reduxjs/toolkit";
import { comments } from "services";
import { addUser, removeUser } from "../auth/auth.slice";
import { cookieExtractor, cookieDestroyer } from "helpers";

export const getAll = createAsyncThunk(
  "comments/getAll",
  async (_id, thunkAPI) => {
    try {
      const { data } = await comments.getAll(_id);
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

export const create = createAsyncThunk(
  "comments/create",
  async (commentData, thunkAPI) => {
    try {
      const { data } = await comments.create(commentData);
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
  "comments/update",
  async (commentData, thunkAPI) => {
    try {
      const { data } = await comments.update(commentData);
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
  "comments/delete",
  async (_id, thunkAPI) => {
    try {
      const { data } = await comments._delete(_id);
      const userData = await cookieExtractor(data.accessToken.data.accessToken);
      thunkAPI.dispatch(addUser(userData));
      return _id;
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
  "comments/like",
  async (likeData, thunkAPI) => {
    try {
      const { data } = await comments.like(likeData);
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
