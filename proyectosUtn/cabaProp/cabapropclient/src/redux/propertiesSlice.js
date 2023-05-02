import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { errorTypes, ErrorHandler } from "../utils/errorHandler.utils";

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

export const getProperties =
  (body, page = 1, realEstateId) =>
  async (dispatch) => {
    try {
      const url = `${
        process.env.REACT_APP_SERVER
      }/properties/find-properties?offset=${page - 1}&limit=${
        process.env.REACT_APP_PROPERTIES_LIMIT
      }${realEstateId ? `&realEstateId=${realEstateId}` : ""}`;
      // const url = `${process.env.REACT_APP_SERVER}/test-error`;
      const response = await axios({ method: "POST", url, data: body });
      dispatch(setProperties(response.data));
    } catch (e) {
      // ErrorHandler(null, e.response.data.message);
      ErrorHandler(errorTypes[500], e.response.data.message);
    }
  };

export const getRecommendedProperties = (body) => async (dispatch) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER}/properties/find-properties?offset=0&limit=4`,
      data: body,
    });
    dispatch(setRecommendedProperties(response.data));
  } catch (e) {
    ErrorHandler(null, e.response.data.message);
  }
};

export const getPropById = (id) => async (dispatch) => {
  let query = {
    method: "GET",
    url: `${process.env.REACT_APP_SERVER}/properties/${id}`,
  };
  const token = localStorage.getItem("token");
  if (token)
    query = {
      ...query,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  try {
    const response = await axios(query);
    dispatch(setSingleProperty(response.data));
  } catch (e) {
    ErrorHandler(errorTypes[500], e.response.data.message);
  }
};

export default propertiesSlice.reducer;
