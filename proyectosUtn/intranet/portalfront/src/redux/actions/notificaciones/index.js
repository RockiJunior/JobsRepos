import axios from 'axios';
import * as types from './types';
import handleError from 'utils/errorHandler';

export const getAllNotificationsByUserid = userId => async dispatch => {
  try {
    dispatch({ type: types.NOTIFICATIONS_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + `/notificacion/by_user_id/${userId}`
    );

    dispatch({
      type: types.NOTIFICATIONS_BY_USERID,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const markAllNotificationsAsSeen = userId => async dispatch => {
  try {
    dispatch({ type: types.NOTIFICATIONS_REQUEST });

    const { data } = await axios.put(
      process.env.REACT_APP_SERVER +
        `/notificacion/marcar_todas_vistas/${userId}`
    );

    dispatch({
      type: types.NOTIFICATIONS_MARK_ALL_AS_SEEN,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const markAllNotificationAsRead = userId => async dispatch => {
  try {
    dispatch({ type: types.NOTIFICATIONS_REQUEST });

    const { data } = await axios.put(
      process.env.REACT_APP_SERVER +
        `/notificacion/marcar_todas_leidas/${userId}`
    );

    dispatch({
      type: types.NOTIFICATIONS_MARK_ALL_AS_READ,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const markNotificationAsRead = notificacionId => async dispatch => {
  try {
    dispatch({ type: types.NOTIFICATIONS_REQUEST });

    const { data } = await axios.put(
      process.env.REACT_APP_SERVER +
        `/notificacion/marcar_leida/${notificacionId}`
    );

    dispatch({
      type: types.NOTIFICATIONS_MARK_AS_READ,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};
