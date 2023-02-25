import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import messageHandler from "../utlis/messageHandler";

const propertiesSlice = createSlice({
  name: "properties",
  initialState: {
    properties: null,
    singleProperty: null,
    recommendedProperties: null,
  },
  reducers: {
    setProperties: (state, { payload }) => {
      state.properties = payload;
    },
    setSingleProperty: (state, { payload }) => {
      state.singleProperty = payload;
    },
    setRecommendedProperties: (state, { payload }) => {
      state.recommendedProperties = payload;
    },
  },
});

export const { setProperties, setSingleProperty, setRecommendedProperties } =
  propertiesSlice.actions;

export const getProperties = (body, page = 1) => async (dispatch) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${
        process.env.REACT_APP_SERVER
      }/properties/find-properties?offset=${page - 1}&limit=${process.env.REACT_APP_PROPERTIES_LIMIT}`,
      data: body,
    });
    dispatch(setProperties(response.data));
  } catch (e) {
    messageHandler("error", e.response.data.message);
  }
};

export const getRecommendedProperties = (body) => async (dispatch) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER}/properties/find-properties?offset=0&limit=10`,
      data: body,
    });
    dispatch(setRecommendedProperties(response.data));
  } catch (e) {
    messageHandler("error", e.response.data.message);
  }
};

export const getPropById = (id) => async (dispatch) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_SERVER}/properties/${id}`,
    });
    dispatch(setSingleProperty(response.data));
  } catch (e) {
    window.location.replace("http://localhost:3000/");
  }
};

export default propertiesSlice.reducer;
