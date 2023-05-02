import * as types from '../actions/tipoTramite/types';

const initialState = {
  tipoTramites: [],
  message: null,
  loading: true,
  error: null
};

const tipoTramiteReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.TIPO_TRAMITE_REQUEST:
      return {
        ...state,
        loading: true
      };

    case types.TIPO_TRAMITE_GET_ALL:
      return {
        ...state,
        loading: false,
        tipoTramites: action.payload
      };

    case types.TIPO_TRAMITE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default tipoTramiteReducer;
