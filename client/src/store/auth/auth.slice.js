import { createSlice } from "@reduxjs/toolkit";
import * as thunk from "./auth.thunk";

const initialState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addUser(state, action) {
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
      .addCase(thunk.verifyToken.rejected, (state, action) => {
        state.user = null;
      })
      .addCase(thunk.verifyToken.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      //VERIFY TOKEN
      //LOGOUT
      .addCase(thunk.logout.rejected, (state, action) => {
        state.user = null;
      })
      .addCase(thunk.logout.fulfilled, (state, action) => {
        state.user = null;
      });
    //LOGOUT
  },
});

const { reducer, actions } = authSlice;

export const { addUser, removeUser } = actions;

export default reducer;
