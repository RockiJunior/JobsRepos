import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import messageHandler from "../utils/messageHandler";
import { ErrorHandler } from "../utils/errorHandler.utils";

const searchesSlice = createSlice({
  name: "searches",
  initialState: {
    searches: null,
  },
  reducers: {
    setSearches: (state, { payload }) => {
      state.searches = payload;
    },
  },
});

export const { setSearches } = searchesSlice.actions;
const token = localStorage.getItem("token");

export const getSearches =
  (id, page = 0) =>
  async (dispatch) => {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_SERVER}/searches/get-by-client/${id}?offset=${page}&limit=${process.env.REACT_APP_PROPERTIES_LIMIT}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setSearches(response.data));
    } catch (e) {
      ErrorHandler(null, e.response.data.message);
    }
  };

export const addSearch = (clientId, body) => async () => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER}/searches/${clientId}`,
      data: body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    messageHandler("success", response.data.message);
  } catch (e) {
    ErrorHandler(null, e.response.data.message);
  }
};

export const deleteSearch = (clientId, name) => async () => {
  try {
    const response = await axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_SERVER}/searches/${clientId}`,
      data: name,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    messageHandler("success", response.data.message);
  } catch (e) {
    ErrorHandler(null, e.response.data.message);
  }
};

export const updateSearch = (id, body) => async () => {
  try {
    const response = await axios({
      method: "PATCH",
      url: `${process.env.REACT_APP_SERVER}/searches/update-search-name/${id}`,
      data: body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    messageHandler("success", response.data.message);
  } catch (e) {
    ErrorHandler(null, e.response.data.message);
  }
};

export default searchesSlice.reducer;
