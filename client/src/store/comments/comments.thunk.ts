import { createAsyncThunk } from "@reduxjs/toolkit";
import { comments } from "services";
import { addUser, removeUser } from "../auth/auth.slice";
import { cookieExtractor, cookieDestroyer, getApiError } from "helpers";
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
  CommentsResponse,
  GetCommentsArg,
  { rejectValue: ApiError }
>("comments/getAll", async (_id, thunkAPI) => {
  try {
    const { data } = await comments.getAll(_id);
    return data;
  }
  catch (error) {
    return thunkAPI.rejectWithValue(handleAuthTokenError(error, thunkAPI));
  }
});

export const create = createAsyncThunk<
  CommentMutationResponse,
  CreateCommentArg,
  { rejectValue: ApiError }
>("comments/create", async (commentData, thunkAPI) => {
  try {
    const { data } = await comments.create(commentData);
    const userData = cookieExtractor(data.accessToken.data.accessToken);
    thunkAPI.dispatch(addUser(userData));
    return data;
  }
  catch (error) {
    return thunkAPI.rejectWithValue(handleAuthTokenError(error, thunkAPI));
  }
});

export const update = createAsyncThunk<
  CommentMutationResponse,
  unknown,
  { rejectValue: ApiError }
>("comments/update", async (commentData, thunkAPI) => {
  try {
    const { data } = await comments.update(commentData);
    const userData = cookieExtractor(data.accessToken.data.accessToken);
    thunkAPI.dispatch(addUser(userData));
    return data;
  }
  catch (error) {
    return thunkAPI.rejectWithValue(handleAuthTokenError(error, thunkAPI));
  }
});

export const _delete = createAsyncThunk<
  DeleteCommentArg,
  DeleteCommentArg,
  { rejectValue: ApiError }
>("comments/delete", async (_id, thunkAPI) => {
  try {
    const { data } = await comments._delete(_id);
    const userData = cookieExtractor(data.accessToken.data.accessToken);
    thunkAPI.dispatch(addUser(userData));
    return _id;
  }
  catch (error) {
    return thunkAPI.rejectWithValue(handleAuthTokenError(error, thunkAPI));
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
  }
  catch (error) {
    return thunkAPI.rejectWithValue(handleAuthTokenError(error, thunkAPI));
  }
});
