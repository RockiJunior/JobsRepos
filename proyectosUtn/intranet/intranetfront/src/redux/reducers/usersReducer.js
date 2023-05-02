import * as types from '../actions/users/types';

const initialState = {
  matriculados: {},
  homeInfo: {},
  usuarios: {},
  usuario: {},
  loading: false,
  error: null
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.USERS_REQUEST:
      return {
        ...state,
        loading: true
      };

    case types.USERS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case types.USERS_GET_MATRICULADOS:
      return {
        ...state,
        loading: false,
        matriculados: action.payload
      };

    case types.GET_HOME_INFO:
      return {
        ...state,
        loading: false,
        homeInfo: action.payload
      };

    case types.GET_USUARIOS_CON_CARPETA:
      return {
        ...state,
        loading: false,
        usuarios: action.payload
      };

    case types.GET_USUARIO:
      return {
        ...state,
        loading: false,
        usuario: action.payload
      };

    default:
      return state;
  }
};

export default usersReducer;
