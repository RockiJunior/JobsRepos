import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ErrorHandler, errorTypes } from "../utils/errorHandler.utils";

const realEstateSlice = createSlice({
  name: "realEstates",
  initialState: {
    realEstates: null,
    singleRealEstate: null,
  },
  reducers: {
    setRealEstates: (state, { payload }) => {
      state.realEstates = payload;
    },
    setSingleRealEstate: (state, { payload }) => {
      state.singleRealEstate = payload;
    },
  },
});

export const { setRealEstates, setSingleRealEstate } = realEstateSlice.actions;

export const getRealEstates =
  (field = "", page = 0) =>
  async (dispatch) => {
    try {
      const url = `${process.env.REACT_APP_SERVER}/real-estate?${
        field ? `field=${field}&` : ""
      }offset=${page}&limit=${process.env.REACT_APP_PROPERTIES_LIMIT}`;
      const response = await axios({
        method: "GET",
        url,
      });
      dispatch(setRealEstates(response.data));
    } catch (e) {
      ErrorHandler(errorTypes[500]);
      dispatch(setRealEstates([]));
    }
  };

export const getSingleRealEstate = (id) => async (dispatch) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_SERVER}/real-estate/${id}`,
    });
    dispatch(setSingleRealEstate(response.data));
  } catch (e) {
    ErrorHandler(errorTypes[500]);
  }
};

export default realEstateSlice.reducer;
