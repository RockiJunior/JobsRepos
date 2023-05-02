import * as types from '../actions/cedula/types';

const initialState = {
  cedula: null,
  cedulas: {},
  relations: {},
  cedulasSinAsignar: {},
  loading: false,
  error: null
};

const cedulaReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CEDULA_REQUEST:
      return {
        ...state,
        loading: true
      };

    case types.CEDULA_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case types.CEDULA_GET_BY_ID:
      return {
        ...state,
        loading: false,
        cedula: action.payload
      };

    case types.CEDULA_GET_BY_EMPLEADO_ID:
      return {
        ...state,
        loading: false,
        cedulas: action.payload
      };

    case types.CEDULA_SIN_ASIGNAR:
      return {
        ...state,
        loading: false,
        cedulasSinAsignar: action.payload
      };

    case types.CEDULA_ASIGNAR_EMPLEADO:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.ACTUALIZAR_FECHA_RECEPCION:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.CEDULA_PASO_SIGUIENTE:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.CEDULA_GET_RELATIONS:
      return {
        ...state,
        loading: false,
        relations: action.payload
      };

    case types.CEDULA_GET_ALL_BY_AREA:
      return {
        ...state,
        loading: false,
        cedulas: action.payload
      };

    default:
      return state;
  }
};

export default cedulaReducer;
