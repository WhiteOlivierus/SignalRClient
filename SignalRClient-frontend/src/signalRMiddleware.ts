import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import {
  getHubProxyFactory,
  getReceiverRegister,
  type Disposable,
} from "./generated/TypedSignalR.Client";
import type {
  IChatHub,
  IChatReceiver,
} from "./generated/TypedSignalR.Client/SignalRClient.Api";
import { chatSlice } from "./chatSlice";
import type { Middleware } from "@reduxjs/toolkit";
import { createAction } from "@reduxjs/toolkit";

export const start = createAction("signalR/start");
export const stop = createAction("signalR/stop");
export const join = createAction<{ username: string }>("signalR/join");
export const send = createAction<{ text: string }>("signalR/send");
export const getParticipants = createAction("signalR/getParticipants");

export const signalRActions = {
  start,
  stop,
  join,
  send,
  getParticipants,
};

const HUB_URL = "http://localhost:5180/hubs/chathub";
const HUB_NAME = "IChatHub";
const RECEIVER_NAME = "IChatReceiver";

let connection: HubConnection | null = null;
let hubProxy: IChatHub | null = null;
let subscriptionDispose: Disposable | null = null;

export const signalRMiddleware: Middleware =
  (storeAPI) => (next) => async (action) => {
    if (start.match(action)) {
      if (connection && connection.state === "Connected") return next(action);

      connection = new HubConnectionBuilder().withUrl(HUB_URL).build();
      hubProxy = getHubProxyFactory(HUB_NAME).createHubProxy(connection);

      const receiver: IChatReceiver = {
        onReceiveMessage: async (message) => {
          storeAPI.dispatch(chatSlice.actions.receiveMessage(message));
        },
        onJoin: async (username, dateTime) => {
          storeAPI.dispatch(
            chatSlice.actions.userJoined({ username, dateTime })
          );
        },
        onLeave: async (username, dateTime) => {
          storeAPI.dispatch(chatSlice.actions.userLeft({ username, dateTime }));
        },
      };

      const register = getReceiverRegister(RECEIVER_NAME);
      subscriptionDispose = register.register(connection, receiver);

      await connection.start();
    }

    if (stop.match(action)) {
      if (subscriptionDispose) {
        subscriptionDispose.dispose();
        subscriptionDispose = null;
      }
      if (connection) {
        connection.stop();
        connection = null;
        hubProxy = null;
      }
    }

    if (join.match(action)) {
      if (!hubProxy) throw new Error("SignalR not started");
      await hubProxy.join(action.payload.username);
    }

    if (send.match(action)) {
      if (!hubProxy) throw new Error("SignalR not started");
      await hubProxy.sendMessage(action.payload.text);
    }

    if (getParticipants.match(action)) {
      if (!hubProxy) throw new Error("SignalR not started");
      const participants = await hubProxy.getParticipants();
      storeAPI.dispatch({
        type: "signalR/setParticipants",
        payload: participants,
      });
    }

    return next(action);
  };
