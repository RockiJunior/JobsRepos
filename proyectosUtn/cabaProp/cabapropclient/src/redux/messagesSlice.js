import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import messageHandler from "../utils/messageHandler";
import { ErrorHandler, errorTypes } from "../utils/errorHandler.utils";

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    conversation: null,
    messages: null,
  },
  reducers: {
    setConversation: (state, { payload }) => {
      state.conversation = payload;
    },
    setMessages: (state, { payload }) => {
      state.messages = payload;
    },
  },
});

const token = localStorage.getItem("token");
export const { setConversation, setMessages } = messagesSlice.actions;

export const getConversations = (id) => async (dispatch) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_SERVER}/conversations/client/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (e) {
    ErrorHandler(errorTypes[500]);
  }
};

export const postMessage = (body) => async () => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER}/messages/client`,
      data: body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    messageHandler("success", response.data.message);
  } catch (e) {
    ErrorHandler(null, e.response.data.message);
  }
};

export const getMessages = (chatId, setChats) => async (dispatch) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_SERVER}/messages/${chatId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(setMessages(response.data));
    setChats(response.data);
  } catch (e) {
    ErrorHandler(null, e.response.data.message);
  }
};

export const readMessage = (id) => async () => {
  try {
    const response = await axios({
      method: "PATCH",
      url: `${process.env.REACT_APP_SERVER}/messages/update-read-at/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (e) {
    ErrorHandler(null, e.response.data.message);
  }
};

export default messagesSlice.reducer;
