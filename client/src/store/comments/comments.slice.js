import { createSlice } from "@reduxjs/toolkit";
import * as thunk from "./comments.thunk";
import { Common } from "components";
const NOTIF = Common.Notifications.ID;

const initialState = {
  comments: null,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  extraReducers: (builder) => {
    builder
      //👇 GET ALL
      .addCase(thunk.getAll.fulfilled, (state, action) => {
        state.comments = action.payload.data.comments;
      })
      //👆 GET ALL
      //👇 CREATE
      .addCase(thunk.create.pending, () => {
        NOTIF.Pending(
          "create",
          "Hold on...",
          "Please wait while we handle your request."
        );
      })
      .addCase(thunk.create.rejected, () => {
        NOTIF.Failure(
          "create",
          "Uh Oh!",
          "Your session has ended. Please Login and try again."
        );
      })
      .addCase(thunk.create.fulfilled, (state, action) => {
        NOTIF.Success(
          "create",
          "Done!",
          "Thank you! We have recieved your comment."
        );
        state.comments.unshift(action.payload.comment.data.comment);
      })
      //👆 CREATE
      //👇 UPDATE
      .addCase(thunk.update.pending, () => {
        NOTIF.Pending(
          "update",
          "Hold on...",
          "Please wait while we handle your request."
        );
      })
      .addCase(thunk.update.rejected, () => {
        NOTIF.Failure(
          "update",
          "Uh Oh!",
          "Your session has ended. Please Login and try again."
        );
      })
      .addCase(thunk.update.fulfilled, (state, action) => {
        NOTIF.Success("update", "Done!", "Your comment has been updated.");

        const data = action.payload.comment.data.comment;
        state.comments = state.comments.map((comment) =>
          comment._id === data._id ? data : comment
        );
      })
      //👆 UPDATE
      //👇 DELETE
      .addCase(thunk._delete.pending, () => {
        NOTIF.Pending(
          "delete",
          "Hold on...",
          "Please wait while we handle your request."
        );
      })
      .addCase(thunk._delete.rejected, () => {
        NOTIF.Failure(
          "delete",
          "Uh Oh!",
          "Your session has ended. Please Login and try again."
        );
      })
      .addCase(thunk._delete.fulfilled, (state, action) => {
        NOTIF.Success("delete", "Done!", "Your comment has been deleted.");

        const data = action.payload._id;
        state.comments = state.comments.filter(
          (comment) => comment._id !== data
        );
      })
      //👆 DELETE
      //👇 LIKE
      .addCase(thunk.like.pending, () => {
        NOTIF.Pending(
          "like",
          "Hold on...",
          "Please wait while we handle your request."
        );
      })
      .addCase(thunk.like.rejected, () => {
        NOTIF.Failure(
          "like",
          "Uh Oh!",
          "Your session has ended. Please Login and try again."
        );
      })
      .addCase(thunk.like.fulfilled, (state, action) => {
        NOTIF.Success("like", "Done!", "");

        const data = action.payload.comment.data.comment;
        state.comments = state.comments.map((comment) =>
          comment._id === data._id ? data : comment
        );
      });
    //👆 LIKE
  },
});

const { reducer } = commentsSlice;

export default reducer;
