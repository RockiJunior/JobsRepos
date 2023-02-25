import { createSlice } from '@reduxjs/toolkit';
import decode from 'jwt-decode'
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import messageHandler from 'utils/messageHandler';

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    currentUser: null
  },
  reducers: {
    setCurrentUser: (state, { payload }) => {
      state.currentUser = payload;
    }
  }
});

export const { setCurrentUser } = loginSlice.actions;

export const loginColab = (userData) => async () => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER}/users/login`,
      data: userData
    })
    localStorage.setItem("token", response.data.token)
    return window.open("/home", "_self")
  } catch (e) {
    messageHandler('error', e.response.data.message)
  }
}

export const loginAdmin = (userData) => async () => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER}/admin-users/login`,
      data: userData
    })
    localStorage.setItem("token", response.data.token)
    return window.open("/home", "_self")
  } catch (e) {
    messageHandler('error', e.response.data.message)
  }
}

export const updateUser = (userData) => async (dispatch) => {
  try {
    dispatch(setCurrentUser(userData))
  } catch (e) {
    messageHandler('error', e.response.data.message)
  }
}

export const logOut = () => async (dispatch) => {
  try {
    localStorage.removeItem("token")
    dispatch(setCurrentUser(null))
    return window.open("/ingresar", "_self")
  } catch (e) {
    messageHandler('error', e.response.data.message)
  }
}

export const checkSession = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("token")
    if (token !== null) {
      const decoded = decode(token)
      dispatch(setCurrentUser(decoded))
    }
  } catch (e) {
    console.log(e)
  }
}

export const tokenRefresh = (token) => async (dispatch) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER}/users/refresh-token`,
      data: { token: token }
    })
    const newToken = response.data.newToken
    if (newToken) {
      localStorage.setItem("token", newToken)
      const decoded = decode(newToken)
      dispatch(setCurrentUser(decoded))
    }
  } catch (e) {
    console.log(e)
  }
}

export default loginSlice.reducer;
