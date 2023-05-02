import * as types from '../actions/eventos/types';

const initialState = {
  eventos: [],
  evento: null,
  tipoEventos: [],
  listaEspera: [],
  message: null,
  loading: true,
  error: null
};

const eventoReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.EVENTO_REQUEST:
      return {
        ...state,
        loading: true
      };

    case types.EVENTO_WAIT_LIST:
      return {
        ...state,
        listaEspera: action.payload,
        loading: false
      };

    case types.EVENTO_GET_BY_ID:
      return {
        ...state,
        evento: action.payload,
        loading: false
      };

    case types.EVENTO_GET_ALL_PENDING:
      return {
        ...state,
        eventos: action.payload,
        loading: false
      };

    case types.EVENTO_CREATE:
      return {
        ...state,
        message: action.payload,
        loading: false
      };

    case types.EVENTO_GET_ALL_TYPES:
      return {
        ...state,
        tipoEventos: action.payload,
        loading: false
      };

    case types.EVENTO_APPROVE_REJECT:
      return {
        ...state,
        message: action.payload,
        loading: false
      };

    case types.EVENTO_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default eventoReducer;
