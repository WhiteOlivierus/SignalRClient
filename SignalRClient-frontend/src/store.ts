import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";
import { signalRMiddleware } from "./signalRMiddleware";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  middleware: (getDefault) => getDefault().concat(signalRMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
