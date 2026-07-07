import { createSlice } from "@reduxjs/toolkit";
import * as thunk from "./memory.thunk";
import NOTIF from "components/common/Notifications/WithID";
import type { Memory } from "types";

interface MemoryState {
  memory: Memory | null;
}

const initialState: MemoryState = {
  memory: null,
};

const memorySlice = createSlice({
  name: "memory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET SINGLE
      .addCase(thunk.getSingle.fulfilled, (state, action) => {
        state.memory = action.payload.data.memory;
      })
      // GET SINGLE
      // LIKE
      .addCase(thunk.like.pending, () => {
        NOTIF.Pending(
          "like",
          "Hold on...",
          "Please wait while we handle your request.",
        );
      })
      .addCase(thunk.like.rejected, () => {
        NOTIF.Failure(
          "like",
          "Uh Oh!",
          "Your session has ended. Please Login and try again.",
        );
      })
      .addCase(thunk.like.fulfilled, (state, action) => {
        NOTIF.Success("like", "Done!", "");
        state.memory = action.payload.memory.data.memory;
      });
    // LIKE
  },
});

const { reducer } = memorySlice;

export default reducer;
