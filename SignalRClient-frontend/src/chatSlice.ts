import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Message } from "./generated/SignalRClient.Api";

type ChatState = {
  participants: string[];
  messages: Message[];
};

const initialState: ChatState = {
  participants: [],
  messages: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    receiveMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    userJoined(
      state,
      action: PayloadAction<{ username: string; dateTime: string | Date }>
    ) {
      state.participants.push(action.payload.username);
      state.messages.push({
        content: `${action.payload.username} joined`,
        timeStamp: action.payload.dateTime,
        username: action.payload.username,
      });
    },
    userLeft(
      state,
      action: PayloadAction<{ username: string; dateTime: string | Date }>
    ) {
      state.participants = state.participants.filter(
        (u) => u !== action.payload.username
      );
      state.messages.push({
        content: `${action.payload.username} left`,
        timeStamp: action.payload.dateTime,
        username: action.payload.username,
      });
    },
    setParticipants(state, action: PayloadAction<string[]>) {
      state.participants = action.payload;
    },
    clearChat(state) {
      state.participants = [];
      state.messages = [];
    },
  },
});

export default chatSlice.reducer;
