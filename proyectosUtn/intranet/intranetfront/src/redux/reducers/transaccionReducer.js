import * as types from '../actions/transaccion/types';

const initialState = {
  transaccion: null,
  transacciones: {},
  loading: true,
  message: null,
  error: null
};

const transaccionReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.TRANSACCION_REQUEST:
      return {
        ...state,
        loading: true
      };

    case types.TRANSACCION_GET_BY_ID:
      return {
        ...state,
        loading: false,
        transaccion: action.payload
      };

    case types.TRANSACCION_GET_ALL_BY_ADMIN_ID:
      return {
        ...state,
        loading: false,
        transacciones: action.payload
      };

    case types.TRANSACCION_GET_ALL:
      return {
        ...state,
        loading: false,
        transacciones: action.payload
      };

    case types.TRANSACCION_APROBAR_RECHAZAR:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.TRANSACCION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default transaccionReducer;
