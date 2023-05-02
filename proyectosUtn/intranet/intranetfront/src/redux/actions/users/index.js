import axios from 'axios';
import handleError from 'utils/errorHandler';
import { getQueries } from 'utils/getQueries';
import * as types from './types';

export const usersGetMatriculados = queries => async dispatch => {
  try {
    dispatch({ type: types.USERS_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER +
        '/users/get_matriculados' +
        getQueries(queries)
    );

    dispatch({
      type: types.USERS_GET_MATRICULADOS,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.USERS_FAIL,
      payload: error
    });
  }
};

export const getHomeInfo = () => async dispatch => {
  try {
    dispatch({ type: types.USERS_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/home_info/get'
    );

    dispatch({
      type: types.GET_HOME_INFO,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.USERS_FAIL,
      payload: error
    });
  }
};

export const getUsuariosConCarpeta = queries => async dispatch => {
  try {
    dispatch({ type: types.USERS_REQUEST });
    const { data } = await axios.get(
      process.env.REACT_APP_SERVER +
        '/users/get_usuarios_con_carpeta' +
        getQueries(queries)
    );

    dispatch({
      type: types.GET_USUARIOS_CON_CARPETA,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.USERS_FAIL,
      payload: error
    });
  }
};

export const getUsuario = id => async dispatch => {
  try {
    dispatch({ type: types.USERS_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/users/by_id/' + id
    );

    dispatch({
      type: types.GET_USUARIO,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.USERS_FAIL,
      payload: error
    });
  }
};
