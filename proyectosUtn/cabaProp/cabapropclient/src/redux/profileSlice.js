import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import messageHandler from "../utils/messageHandler";
import decode from "jwt-decode";
import { setCurrentUser } from "./loginSlice";
import { ErrorHandler } from "../utils/errorHandler.utils";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
  },
  reducers: {
    setProfile: (state, { payload }) => {
      state.profile = payload;
    },
  },
});

export const { setProfile } = profileSlice.actions;

export const updateInfo = (userData, id, token) => async () => {
  try {
    const response = await axios({
      method: "PATCH",
      url: `${process.env.REACT_APP_SERVER}/clients/update-data/${id}`,
      data: userData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.setItem("token", response.data.token);
    messageHandler("success", response.data.message);
    return response.data.token;
  } catch (e) {
    ErrorHandler(null, e.response.data.message);
  }
};

export const updatePassword = (userData, id, token) => async () => {
  try {
    const response = await axios({
      method: "PATCH",
      url: `${process.env.REACT_APP_SERVER}/clients/update-password/${id}`,
      data: userData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.setItem("token", response.data.token);
    setCurrentUser(decode(response.data.token));
    messageHandler("success", response.data.message);
  } catch (e) {
    ErrorHandler(null, e.response.data.message);
  }
};

export const uploadImage = (id, formData, token) => async () => {
  try {
    const response = await axios({
      url: `${process.env.REACT_APP_SERVER}/clients/upload-photo/${id}`,
      method: "PATCH",
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.setItem("token", response.data.token);
    setCurrentUser(decode(response.data.token));
    messageHandler("success", response.data.message);
  } catch (e) {
    ErrorHandler(null, e.response.data.message);
  }
};

export const deleteImage = (id, token) => async () => {
  try {
    const response = await axios({
      url: `${process.env.REACT_APP_SERVER}/clients/delete-profile-picture/${id}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.setItem("token", response.data.token);
    setCurrentUser(decode(response.data.token));
    messageHandler("success", response.data.message);
  } catch (e) {
    ErrorHandler(null, e.response.data.message);
  }
};

export default profileSlice.reducer;
