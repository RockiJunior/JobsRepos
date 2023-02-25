import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import messageHandler from "../utlis/messageHandler";

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
    // dispatch(setConversation(response.data));
    return response.data;
  } catch (e) {
    messageHandler("error");
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
    messageHandler("error", e.response.data.message);
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
    messageHandler("error", e.response.data.message);
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
  } catch (error) {
    console.error(error);
  }
};

// export const findConversation = (clientId, propertyId) => async (dispatch) => {
//   try{
//     const response = await axios({
//       method: "GET",
//       url: `${process.env.REACT_APP_SERVER}/messages/${chatId}`,
//       headers: { Authorization: `Bearer ${userId}` }
//     })
//     dispatch(setMessages(response.data));
//   } catch (e) {
//     messageHandler('error', e.response.data.message)
//   }
// }

export default messagesSlice.reducer;
