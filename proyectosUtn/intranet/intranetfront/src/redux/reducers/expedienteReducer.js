import * as types from '../actions/expediente/types';
import * as typesProcesosLegales from '../actions/procesoLegales/types';
import * as typesFiscalizacion from '../actions/fiscalizacion/types';

const initialState = {
  expediente: null,
  expedientes: {},
  relations: {},
  expedientesSinAsignar: {},
  loading: true,
  message: null,
  error: null,
  imputaciones: [],
  conceptos: []
};

const expedienteReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.EXPEDIENTES_REQUEST:
      return {
        ...state,
        loading: true
      };

    case types.EXPEDIENTES_GET_BY_ID:
      return {
        ...state,
        loading: false,
        expediente: action.payload
      };

    case types.EXPEDIENTES_GET_ALL_BY_AREA:
      return {
        ...state,
        loading: false,
        expedientes: action.payload
      };

    case types.EXPEDIENTES_GET_ALL_BY_ADMIN_ID:
      return {
        ...state,
        loading: false,
        expedientes: action.payload
      };

    case types.EXPEDIENTES_GET_SIN_ASIGNAR_POR_AREA:
      return {
        ...state,
        loading: false,
        expedientesSinAsignar: action.payload
      };

    case types.EXPEDIENTE_GET_RELATIONS:
      return {
        ...state,
        loading: false,
        relations: action.payload
      };

    case types.EXPEDIENTES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case typesProcesosLegales.PROCESO_LEGALES_GET_IMPUTACIONES:
      return {
        ...state,
        loading: false,
        imputaciones: action.payload
      };

    case typesFiscalizacion.FISCALIZACION_GET_CONCEPTOS:
      return {
        ...state,
        loading: false,
        conceptos: action.payload
      };

    default:
      return state;
  }
};

export default expedienteReducer;
