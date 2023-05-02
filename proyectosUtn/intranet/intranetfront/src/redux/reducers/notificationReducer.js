import * as types from '../actions/notificaciones/types';

const initialState = {
  loading: true,
  notificaciones: null,
  error: null
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.NOTIFICATIONS_REQUEST:
      return {
        ...state,
        loading: true
      };

    case types.NOTIFICATIONS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case types.NOTIFICATIONS_BY_USERID:
      return {
        ...state,
        loading: false,
        notificaciones: action.payload
      };

    case types.NOTIFICATIONS_MARK_ALL_AS_READ:
      return {
        ...state,
        loading: false
      };

    case types.NOTIFICATIONS_MARK_ALL_AS_SEEN:
      return {
        ...state,
        loading: false
      };

    case types.NOTIFICATIONS_MARK_AS_READ:
      return {
        ...state,
        loading: false
      };

    default:
      return state;
  }
};

export default notificationReducer;
