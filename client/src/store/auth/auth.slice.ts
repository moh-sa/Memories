import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import * as thunk from "./auth.thunk";
import type { User } from "types";

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    removeUser(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //REGISTER
      //REGISTER
      //LOGIN
      .addCase(thunk.login.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      //LOGIN
      //VERIFY TOKEN
      .addCase(thunk.verifyToken.rejected, (state) => {
        state.user = null;
      })
      .addCase(thunk.verifyToken.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      //VERIFY TOKEN
      //LOGOUT
      .addCase(thunk.logout.rejected, (state) => {
        state.user = null;
      })
      .addCase(thunk.logout.fulfilled, (state) => {
        state.user = null;
      });
    //LOGOUT
  },
});

const { reducer, actions } = authSlice;

export const { addUser, removeUser } = actions;

export default reducer;
