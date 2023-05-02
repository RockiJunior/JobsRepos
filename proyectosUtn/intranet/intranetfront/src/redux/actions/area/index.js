import axios from 'axios';
import * as types from './types';
import errorHandler from 'utils/errorHandler';

const serverUrl = process.env.REACT_APP_SERVER;

export const getPartners = () => async dispatch => {
  try {
    dispatch({ type: types.AREA_REQUEST });

    const { data } = await axios.get(serverUrl + '/empleado/by_user_area');

    dispatch({
      type: types.AREA_GET_PARTNERS,
      payload: data
    });
  } catch (error) {
    errorHandler(error, dispatch);
  }
};
