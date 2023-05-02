import * as types from '../actions/area/types';

const initialState = {
  loading: true,
  error: null,
  partners: null
};

const areaReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.AREA_REQUEST:
      return {
        ...state,
        loading: true
      };

    case types.AREA_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case types.AREA_GET_PARTNERS:
      return {
        ...state,
        loading: false,
        partners: action.payload
      };

    default:
      return state;
  }
};

export default areaReducer;
