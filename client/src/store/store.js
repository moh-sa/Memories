import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/auth.slice";
import memoryReducer from "./memory/memory.slice";
import memoriesReducer from "./memories/memories.slice";
import commentsReducer from "./comments/comments.slice";
const ENV = process.env.NODE_ENV === "development";

const store = configureStore({
  reducer: {
    auth: authReducer,
    memory: memoryReducer,
    memories: memoriesReducer,
    comments: commentsReducer,
  },
  devTools: ENV,
});

export default store;
