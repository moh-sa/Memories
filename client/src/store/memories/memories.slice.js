import { createSlice } from "@reduxjs/toolkit";
import * as thunk from "./memories.thunk";
import { Common } from "components";
const NOTIF = Common.Notifications.ID;

const initialState = {
  memories: null,
  numberOfPages: null,
};

const memoriesSlice = createSlice({
  name: "memories",
  initialState,
  extraReducers: (builder) => {
    builder
      //👇 GET ALL
      .addCase(thunk.getAll.fulfilled, (state, action) => {
        state.memories = action.payload.data.memories;
        state.numberOfPages = action.payload.data.numberOfPages;
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
      .addCase(thunk.create.fulfilled, () => {
        NOTIF.Success(
          "create",
          "Done!",
          "Thanks for sharing your wonderful memory with us!"
        );
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
      .addCase(thunk.update.fulfilled, () => {
        NOTIF.Success("update", "Done!", "Your memory has been updated.");
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
        NOTIF.Success("delete", "Done!", "Your memory has been deleted.");

        state.memories = state.memories.filter(
          (memory) => memory._id !== action.payload._id
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

        const payload = action.payload.memory.data.memory;
        state.memories = state.memories.map((memory) =>
          memory._id === payload._id ? payload : memory
        );
      })
      //👆 LIKE
      //👇 SEARCH
      .addCase(thunk.searchReq.fulfilled, (state, action) => {
        state.memories = action.payload.data.memories;
        state.numberOfPages = action.payload.data.numberOfPages;
      });
    //👆 SEARCH
  },
});

const { reducer } = memoriesSlice;

export default reducer;
