import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import decode from 'jwt-decode';
import messageHandler from 'utils/messageHandler';

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    currentUser: null,
    loading: true
  },
  reducers: {
    setCurrentUser: (state, { payload }) => {
      state.currentUser = payload;
      state.loading = false;
    }
  }
});

export const { setCurrentUser } = loginSlice.actions;

export const loginColab = (userData, navigate) => async dispatch => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER}/users/login`,
      data: userData
    });

    const newToken = response.data.token;
    if (newToken) {
      localStorage.setItem('token', newToken);
      const decoded = decode(newToken);
      dispatch(setCurrentUser(decoded));
    }

    localStorage.setItem('token', response.data.token);
    return navigate('/propiedades');
  } catch (e) {
    messageHandler('error', e.response.data.message);
  }
};

export const loginAdmin = (userData, navigate) => async dispatch => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER}/admin-users/login`,
      data: userData
    });

    const newToken = response.data.token;
    if (newToken) {
      localStorage.setItem('token', newToken);
      const decoded = decode(newToken);
      dispatch(setCurrentUser(decoded));
    }

    localStorage.setItem('token', response.data.token);
    return navigate('/propiedades');
  } catch (e) {
    messageHandler('error', e.response.data.message);
  }
};

export const updateUser = userData => async dispatch => {
  try {
    localStorage.setItem('token', userData);
    const userLogged = await decode(userData, process.env.JWT_SECRET);
    dispatch(setCurrentUser(userLogged));
  } catch (e) {
    messageHandler('error', e.response.data.message);
  }
};

export const logOut = navigate => async dispatch => {
  try {
    localStorage.removeItem('token');
    dispatch(setCurrentUser(null));
    return navigate('/ingresar');
  } catch (e) {
    messageHandler('error', e.response.data.message);
  }
};

export const checkSession = () => async dispatch => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decode(token);
      dispatch(setCurrentUser(decoded));
    }
  } catch (e) {
    console.log(e);
  }
};

export const tokenRefresh = token => async dispatch => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER}/users/refresh-token`,
      data: { token: token }
    });
    const newToken = response.data.newToken;
    if (newToken) {
      localStorage.setItem('token', newToken);
      const decoded = decode(newToken);
      dispatch(setCurrentUser(decoded));
    }
  } catch (e) {
    console.log(e);
  }
};

export default loginSlice.reducer;
