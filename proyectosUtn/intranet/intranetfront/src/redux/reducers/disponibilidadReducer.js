import * as types from '../actions/disponibilidad/types';

const initialState = {
  disponibilidades: [],
  message: null,
  loading: true,
  error: null
};

const disponibilidadReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.DISPONIBILIDAD_REQUEST:
      return {
        ...state,
        loading: true
      };

    case types.DISPONIBILIDAD_GET_BY_AREA:
      return {
        ...state,
        loading: false,
        disponibilidades: action.payload
      };

    case types.DISPONIBILIDAD_CREATE:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.DISPONIBILIDAD_UPDATE:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.DISPONIBILIDAD_DELETE:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.DISPONIBILIDAD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default disponibilidadReducer;
