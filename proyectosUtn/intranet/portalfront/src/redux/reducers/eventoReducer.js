import * as types from '../actions/eventos/types';

const initialState = {
  loading: true,
  error: null,
  eventos: [],
  evento: null,
  message: null
};

const eventoReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.EVENTOS_REQUEST:
      return {
        ...state,
        loading: true
      };

    case types.EVENTOS_GET_ALL:
      return {
        ...state,
        loading: false,
        eventos: action.payload
      };

    case types.EVENTOS_GET_BY_ID:
      return {
        ...state,
        loading: false,
        evento: action.payload
      };

    case types.EVENTOS_ACEPTAR_RECHAZAR:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.EVENTOS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case types.EVENTOS_CLEAR:
      return {
        ...state,
        loading: false,
        error: null,
        eventos: [],
        evento: null,
        message: null
      };

    default:
      return state;
  }
};

export default eventoReducer;
