import { createSlice } from "@reduxjs/toolkit";
import * as thunk from "./memory.thunk";
import { Common } from "components";

const initialState = {
  memory: null,
};

const memorySlice = createSlice({
  name: "memory",
  initialState,
  extraReducers: (builder) => {
    builder
      //GET SINGLE
      .addCase(thunk.getSingle.fulfilled, (state, action) => {
        state.memory = action.payload.data.memory;
      })
      //GET SINGLE
      //LIKE
      .addCase(thunk.like.pending, () => {
        Common.Notifications.ID.Pending(
          "like",
          "Hold on...",
          "Please wait while we handle your request."
        );
      })
      .addCase(thunk.like.rejected, () => {
        Common.Notifications.ID.Failure(
          "like",
          "Uh Oh!",
          "Your session has ended. Please Login and try again."
        );
      })
      .addCase(thunk.like.fulfilled, (state, action) => {
        Common.Notifications.ID.Success("like", "Done!", "");
        state.memory = action.payload.memory.data.memory;
      });
    //LIKE
  },
});

const { reducer } = memorySlice;

export default reducer;
