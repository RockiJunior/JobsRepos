import axios from 'axios';
import handleError from 'utils/errorHandler';
import * as types from './types';

export const tipoTramiteGetAll = () => async dispatch => {
  try {
    dispatch({ type: types.TIPO_TRAMITE_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/tipo_tramite/get_all_empleado'
    );

    dispatch({
      type: types.TIPO_TRAMITE_GET_ALL,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.TIPO_TRAMITE_FAIL,
      payload: error
    });
  }
};
