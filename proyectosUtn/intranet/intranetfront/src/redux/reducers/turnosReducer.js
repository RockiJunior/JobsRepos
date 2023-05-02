import * as types from '../actions/turnos/types';

const initialState = {
  turnosArea: [],
  turnosByMonth: [],
  turnosAreas: {},
  loading: true,
  error: null
};

const turnosReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.TURNOS_REQUEST:
      return {
        ...state,
        loading: true
      };

    case types.TURNOS_GET_ALL_BY_AREA_ID:
      return {
        ...state,
        loading: false,
        turnosArea: action.payload
      };

    case types.TURNOS_GET_ALL_AREAS:
      return {
        ...state,
        loading: false,
        turnosAreas: action.payload
      };

    case types.TURNOS_UPDATE_STATUS:
      return {
        ...state,
        loading: false,
        message: action.payload
      };

    case types.TURNOS_GET_BY_MONTH:
      return {
        ...state,
        loading: false,
        turnosByMonth: action.payload
      };

    case types.TURNOS_RESERVAR:
      return {
        ...state,
        loading: false
      };

    case types.TURNOS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default turnosReducer;
