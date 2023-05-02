import axios from 'axios';
import * as types from './types';
import errorHandler from 'utils/errorHandler';

const serverUrl = process.env.REACT_APP_SERVER;

export const register =
  ({ email, contrasenia, nombre, apellido, dni }, navigate) =>
  async dispatch => {
    try {
      dispatch({ type: types.AUTH_REQUEST });

      const { data } = await axios.post(serverUrl + '/users/create', {
        email,
        contrasenia,
        nombre,
        apellido,
        dni
      });

      dispatch({
        type: types.AUTH_REGISTER,
        payload: data
      });

      return navigate('/login');
    } catch (error) {
      errorHandler(error, dispatch);
    }
  };

export const login =
  ({ email, contrasenia }, navigate) =>
  async dispatch => {
    try {
      dispatch({ type: types.AUTH_REQUEST });

      const { data } = await axios.post(serverUrl + '/auth/login_empleado', {
        email,
        contrasenia
      });

      const { token, user } = data;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);

      dispatch({
        type: types.AUTH_LOGIN,
        payload: user
      });

      navigate('/home');
    } catch (error) {
      dispatch({
        type: types.AUTH_ERROR
      });
      errorHandler(error, dispatch);
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
