import * as types from '../actions/tramite/types';

const initialState = {
  tramite: null,
  tramites: {},
  tramitesSinAsignar: {},
  relations: {},
  loading: true,
  message: null,
  error: null
};

const tramiteReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.TRAMITES_REQUEST:
      return {
        ...state,
        loading: true
      };

    case types.TRAMITES_GET_BY_ID:
      return {
        ...state,
        loading: false,
        tramite: action.payload
      };

    case types.TRAMITES_GET_ALL_BY_ADMIN_ID:
      return {
        ...state,
        loading: false,
        tramites: action.payload
      };

    case types.TRAMITES_GET_ALL_BY_AREA:
      return {
        ...state,
        loading: false,
        tramites: action.payload
      };

    case types.TRAMITES_UPSERT_INPUTS_VALUES:
      return {
        ...state,
        loading: false,
        tramite: action.payload
      };

    case types.TRAMITES_GET_SIN_ASIGNAR_POR_AREA:
      return {
        ...state,
        loading: false,
        tramitesSinAsignar: action.payload
      };

    case types.TRAMITES_PASO_ANTERIOR:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.TRAMITES_PASO_SIGUIENTE:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.TRAMITES_CREAR_INFORME:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.TRAMITES_UPDATE_INFORME:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.TRAMITES_DELETE_INFORME:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.TRAMITES_CREAR_DICTAMEN:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.TRAMITES_APROBAR_POR_AREA:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.TRAMITES_RECHAZAR_POR_AREA:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.TRAMITES_RECHAZAR_TRAMITE:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.TRAMITE_GET_RELATIONS:
      return {
        ...state,
        loading: false,
        relations: action.payload
      };

    case types.TRAMITES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default tramiteReducer;
