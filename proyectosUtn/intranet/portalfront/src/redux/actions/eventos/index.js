import axios from 'axios';
import * as types from './types';
import handleError from 'utils/errorHandler';

export const eventosGetAll = () => async dispatch => {
  try {
    dispatch({ type: types.EVENTOS_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/evento/by_user_id'
    );

    dispatch({
      type: types.EVENTOS_GET_ALL,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);

    dispatch({
      type: types.EVENTOS_FAIL,
      payload: error
    });
  }
};

export const eventosGetById = id => async dispatch => {
  try {
    dispatch({ type: types.EVENTOS_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + `/evento/by_id/${id}`
    );

    dispatch({
      type: types.EVENTOS_GET_BY_ID,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);

    dispatch({
      type: types.EVENTOS_FAIL,
      payload: error
    });
  }
};

export const eventosAceptarRechazar =
  (usuarioEventoId, estado, info) => async dispatch => {
    try {
      dispatch({ type: types.EVENTOS_REQUEST });

      const { data } = await axios.put(
        process.env.REACT_APP_SERVER + `/evento/aceptar_rechazar`,
        { estado, usuarioEventoId, info }
      );

      dispatch({
        type: types.EVENTOS_ACEPTAR_RECHAZAR,
        payload: data
      });
    } catch (error) {
      handleError(error, dispatch);

      dispatch({
        type: types.EVENTOS_FAIL,
        payload: error
      });
    }
  };

export const eventosClear = () => dispatch => {
  dispatch({ type: types.EVENTOS_CLEAR });
};
