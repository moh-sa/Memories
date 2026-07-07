import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { comments } from "services";
import { addUser, removeUser } from "../auth/auth.slice";
import { cookieExtractor, cookieDestroyer } from "helpers";
import type {
  ApiError,
  CommentLikeResponse,
  CommentMutationResponse,
  CommentsResponse,
  CreateCommentArg,
  DeleteCommentArg,
  GetCommentsArg,
  LikeCommentArg,
} from "types";

export const getAll = createAsyncThunk<
  CommentsResponse,
  GetCommentsArg,
  { rejectValue: ApiError }
>("comments/getAll", async (_id, thunkAPI) => {
  try {
    const { data } = await comments.getAll(_id);
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

export const create = createAsyncThunk<
  CommentMutationResponse,
  CreateCommentArg,
  { rejectValue: ApiError }
>("comments/create", async (commentData, thunkAPI) => {
  try {
    const { data } = await comments.create(commentData);
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

export const update = createAsyncThunk<
  CommentMutationResponse,
  unknown,
  { rejectValue: ApiError }
>("comments/update", async (commentData, thunkAPI) => {
  try {
    const { data } = await comments.update(commentData);
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

export const _delete = createAsyncThunk<
  DeleteCommentArg,
  DeleteCommentArg,
  { rejectValue: ApiError }
>("comments/delete", async (_id, thunkAPI) => {
  try {
    const { data } = await comments._delete(_id);
    const userData = await cookieExtractor(data.accessToken.data.accessToken);
    thunkAPI.dispatch(addUser(userData));
    return _id;
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

export const like = createAsyncThunk<
  CommentLikeResponse,
  LikeCommentArg,
  { rejectValue: ApiError }
>("comments/like", async (likeData, thunkAPI) => {
  try {
    const { data } = await comments.like(likeData);
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
