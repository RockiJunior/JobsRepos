import * as types from '../actions/turnos/types';

const initialState = {
  loading: true,
  error: null,
  turnosByMonth: []
};

const tramiteReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.TURNOS_REQUEST:
      return {
        ...state,
        loading: true
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

    default:
      return state;
  }
};

export default tramiteReducer;
