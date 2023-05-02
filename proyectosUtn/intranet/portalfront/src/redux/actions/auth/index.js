import axios from 'axios';
import React from 'react';
import * as types from './types';
import handleError from 'utils/errorHandler';
import { toast } from 'react-toastify';
import { ToastContent } from 'components/common/Toast';

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  config.headers['usuarioid'] = userId;
  config.headers['authorization'] = token;
  return config;
});

const serverUrl = process.env.REACT_APP_SERVER;

export const register =
  ({ email, password, name, lastname, dni }, navigate, setSended) =>
  async dispatch => {
    try {
      dispatch({ type: types.AUTH_REQUEST });

      const { data } = await axios.post(serverUrl + '/users/create', {
        email,
        contrasenia: password,
        nombre: name,
        apellido: lastname,
        dni
      });

      dispatch({
        type: types.AUTH_REGISTER,
        payload: data
      });

      return navigate('/verificar-email/' + email);
    } catch (error) {
      handleError(error, dispatch);
      setSended(false);
    }
  };

export const login =
  ({ email, password }, navigate) =>
  async dispatch => {
    try {
      dispatch({ type: types.AUTH_REQUEST });

      const { data } = await axios.post(serverUrl + '/auth/login', {
        email,
        contrasenia: password
      });

      const { token, user } = data;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);

      dispatch({
        type: types.AUTH_LOGIN,
        payload: user
      });

      toast.success(
        <ToastContent
          title="Te logueaste"
          body={'Te logueaste como ' + data.user.email.toLowerCase()}
          time="Justo ahora"
        />
      );

      navigate('/home');
    } catch (error) {
      if (error?.response?.data?.message === 'Usuario no verificado') {
        return navigate('/verificar-email/' + email);
      }
      handleError(error, dispatch);
    }
  };

export const checkLogged = userId => async dispatch => {
  try {
    dispatch({ type: types.AUTH_REQUEST });

    const { data } = await axios.post(serverUrl + '/auth/check_logged', {
      userId
    });

    dispatch({
      type: types.AUTH_LOGIN,
      payload: data.user
    });
  } catch (error) {
    dispatch({
      type: types.AUTH_LOGOUT
    });
  }
};

export const logout = () => async dispatch => {
  try {
    dispatch({ type: types.AUTH_REQUEST });

    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    dispatch({
      type: types.AUTH_LOGOUT
    });
  } catch (error) {
    console.log(error);
  }
};
