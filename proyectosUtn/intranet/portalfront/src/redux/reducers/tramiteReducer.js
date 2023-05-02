import * as types from '../actions/tramite/types';

const initialState = {
  tramite: null,
  tramites: [],
  tipoTramites: [],
  loading: true,
  message: null,
  error: null,
  lastProcedure: null,
  tipoTramite: null,
  tramiteExternoResponse: null,
  tramiteExterno: null,
  matriculados: {}
};

const tramiteReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.TRAMITES_REQUEST:
      return {
        ...state,
        loading: true
      };

    case types.TRAMITES_CREATE:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.TRAMITES_GET_BY_ID:
      return {
        ...state,
        loading: false,
        tramite: action.payload
      };

    case types.TRAMITES_GET_EXTERNO:
      return {
        ...state,
        loading: false,
        tramiteExterno: action.payload
      };

    case types.TRAMITES_GET_BY_USER_ID:
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

    case types.TRAMITES_CHECK_LAST_PROCEDURE:
      return {
        ...state,
        loading: false,
        lastProcedure: action.payload
      };

    case types.TRAMITES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case types.TRAMITES_UPLOAD_PAYMENT:
      return {
        ...state,
        loading: false
      };

    case types.TRAMITES_GET_TIPOS_TRAMITE:
      return {
        ...state,
        loading: false,
        tipoTramites: action.payload
      };

    case types.TIPOTRAMITE_GET_BY_ID_EXTERNO:
      return {
        ...state,
        loading: false,
        tipoTramite: action.payload
      };

    case types.TRAMITE_GET_MATRICULADOS:
      return {
        ...state,
        loading: false,
        matriculados: action.payload
      };

    case types.TRAMITES_CREAR_EXTERNO:
      return {
        ...state,
        loading: false,
        tramiteExternoResponse: action.payload
      };

    case types.TRAMITES_RESET:
      return {
        ...state,
        tramite: null
      };

    default:
      return state;
  }
};

export default tramiteReducer;
