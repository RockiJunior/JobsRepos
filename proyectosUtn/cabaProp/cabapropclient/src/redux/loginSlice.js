import { createSlice } from "@reduxjs/toolkit";
import decode from "jwt-decode";
import axios from "axios";
import messageHandler from "../utils/messageHandler";
import { errorTypes, ErrorHandler } from "../utils/errorHandler.utils";

const loginSlice = createSlice({
  name: "login",
  initialState: {
    loading: true,
    currentUser: null,
  },
  reducers: {
    setCurrentUser: (state, { payload }) => {
      state.currentUser = payload;
    },
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

export const { setCurrentUser, setLoading } = loginSlice.actions;

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
    ErrorHandler(null, e.response.data.message);
  }
};

export const registerClient = (userData, setTabs) => async () => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER}/clients`,
      data: userData,
    });
    messageHandler(
      "success",
      "Usuario creado con éxito. Por favor, verificá tu email antes de iniciar sesión."
    );
    setTabs(1);
    return response.data;
  } catch (e) {
    ErrorHandler(null, e.response.data.message);
  }
};

export const logOut = () => async (dispatch) => {
  try {
    localStorage.removeItem("token");
    dispatch(setCurrentUser(null));
    return window.location.replace("/");
  } catch (e) {
    ErrorHandler(null, e.response.data.message);
  }
};

export const updateCurrentUser = (token) => async (dispatch) => {
  try {
    const decoded = decode(token);
    dispatch(setCurrentUser(decoded));
  } catch (e) {
    ErrorHandler(null, e.response.data.message);
  }
};

export const checkSession = () => async (dispatch) => {
  // console.log("Ejecucion de checkSession");
  const token = localStorage.getItem("token");
  try {
    // dispatch(setLoading(true));
    if (token) {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        ErrorHandler(null, "La sesión caducó. Iniciá sesión nuevamente.");
        setTimeout(() => dispatch(logOut()), 3000);
      } else dispatch(setCurrentUser(decoded));
    }
  } catch (e) {
    ErrorHandler(errorTypes[500]);
  } finally {
    dispatch(setLoading(false));
  }
};

export const verifyClient = (callback) => async () => {
  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_SERVER}/clients/by-token/${callback}`,
    });
    if (response.status === 200) {
      localStorage.setItem("token", response.data.token);
      window.location.replace(`${process.env.REACT_APP_CLIENT}`);
    } else ErrorHandler(null, response.data.message);
  } catch (e) {
    ErrorHandler(errorTypes[500]);
  }
};

export const confirmRegistrationToken = (data) => async () => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER}/clients/verify-client/`,
      data,
    });
    if (response?.status < 300) {
      return response.status;
    } else {
      ErrorHandler(null, response.data.message);
    }
  } catch {
    ErrorHandler(
      null,
      "Hubo un error inesperado. Intentalo nuevamente o contactá con soporte."
    );
    // setTimeout(() => window.location.replace("/"), 5000);
  }
};

export const sendRecoveryToken = (email) => async () => {
  try {
    console.log("Este es el mail: ", email);
    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER}/clients/send-recovery-token`,
      data: email,
    });
    console.log("RES: ", response);
    messageHandler("success", response.data.message);
  } catch (e) {
    console.log("error!!!");
    ErrorHandler(null, e.response.data.message);
  }
};

export const sendRecoveryPassword = (data) => async () => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER}/clients/recovery-password`,
      data,
    });
    if (response?.status < 300) {
      return response.status;
    }
    messageHandler("success", response.data.message);
  } catch (e) {
    ErrorHandler(null, e.response.data.message);
  }
};

export default loginSlice.reducer;
