import * as types from '../actions/superadmin/types';

const initialState = {
  loading: true,
  roles: [],
  permisos: [],
  empleados: {},
  areas: [],
  tramites: [],
  message: null,
  error: null,
  config: null
};

const saReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SA_REQUEST:
      return {
        ...state,
        loading: true
      };

    case types.SA_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case types.SA_GET_ROLES:
      return {
        ...state,
        loading: false,
        roles: action.payload
      };

    case types.SA_GET_PERMISSIONS:
      return {
        ...state,
        loading: false,
        permisos: action.payload
      };

    case types.SA_GET_EMPLEADOS:
      return {
        ...state,
        loading: false,
        empleados: action.payload
      };

    case types.SA_CREATE_ROL:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.SA_UPDATE_ROL:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.SA_DELETE_ROL:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.SA_CREATE_EMPLEADO:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.SA_GET_AREAS:
      return {
        ...state,
        loading: false,
        areas: action.payload
      };

    case types.SA_GET_ALL_TRAMITES:
      return {
        ...state,
        loading: false,
        tramites: action.payload
      };

    case types.SA_GET_CONFIGURATION:
      return {
        ...state,
        loading: false,
        config: action.payload
      };

    default:
      return state;
  }
};

export default saReducer;
