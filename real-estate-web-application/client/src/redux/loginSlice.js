import { createSlice } from "@reduxjs/toolkit";
import decode from "jwt-decode";
import axios from "axios";
import messageHandler from "../utlis/messageHandler";

const loginSlice = createSlice({
  name: "login",
  initialState: {
    currentUser: null,
  },
  reducers: {
    setCurrentUser: (state, { payload }) => {
      state.currentUser = payload;
    },
  },
});

export const { setCurrentUser } = loginSlice.actions;
const token = localStorage.getItem("token");

export const loginClient = (userData) => async () => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER}/clients/login`,
      data: userData,
    });
    localStorage.setItem("token", response.data.token);
    window.location.reload();
  } catch (e) {
    messageHandler("error", e.response.data.message);
  }
};

export const registerClient = (userData, setTabs) => async () => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER}/clients`,
      data: userData,
    });
    messageHandler("success", response.data.message);
    setTabs(1)
    return response.data;
  } catch (e) {
    messageHandler("error", e.response.data.message);
  }
};

export const logOut = () => async (dispatch) => {
  try {
    localStorage.removeItem("token");
    dispatch(setCurrentUser(null));
    return window.location.reload();
  } catch (e) {
    messageHandler("error", e.response.data.message);
  }
};

export const checkSession = (setUserLogged) => async (dispatch) => {
  try {
    if (token !== null) {
      const decoded = decode(token);
      dispatch(setCurrentUser(decoded));
      setUserLogged(decoded)
    }
  } catch (e) {
    messageHandler("error", e.response.data.message);
  }
};

export const verifyClient = (token) => async () => {
  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_SERVER}/clients/by-token/${token}`,
      headers: {
        Authorization: `Bearer ${token}`        
      }
    });
    if (response.status === 200) {
      localStorage.setItem("token", response.data.token);
      window.location.replace("http://localhost:3000/");
    } else {
      messageHandler("error", response.data.message);
    }
  } catch (e) {
    messageHandler("error", e.response.data.message);
  }
};

export const sendRecoveryToken = async (email) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER}/clients/send-recovery-token`,
      body: email
    })
    messageHandler("success", response.data.message);
  } catch (e) {
    messageHandler("success", e.response.data.message);
  }
}

export const uploadImage = (id, formData, setUserLogged) => async () => {
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
    setUserLogged(decode(response.data.token))
    setCurrentUser(decode(response.data.token))
    messageHandler("success", response.data.message);
  } catch (e) {
    messageHandler("error", e.response.data.message);
  }
};

export const deleteImage = (id, setUserLogged) => async () => {
  try {
    const response = await axios({
      url: `${process.env.REACT_APP_SERVER}/clients/delete-profile-picture/${id}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.setItem("token", response.data.token);
    setUserLogged(decode(response.data.token))
    setCurrentUser(decode(response.data.token))
    messageHandler("success", response.data.message);
  } catch (e) {
    messageHandler("error", e.response.data.message);
  }
};

export default loginSlice.reducer;
