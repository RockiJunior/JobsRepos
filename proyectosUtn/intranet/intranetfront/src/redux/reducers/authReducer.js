import * as types from '../actions/auth/types';

const initialState = {
  user: null,
  loading: true,
  message: null,
  error: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.AUTH_REQUEST:
      return {
        ...state,
        loading: true
      };

    case types.AUTH_REGISTER:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.AUTH_LOGIN:
      return {
        ...state,
        loading: false,
        user: action.payload
      };

    case types.AUTH_LOGOUT:
      return {
        ...state,
        loading: false,
        user: null
      };

    case types.AUTH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default authReducer;
