import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import messageHandler from "../utils/messageHandler";
import { ErrorHandler } from "../utils/errorHandler.utils";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    favorites: null,
  },
  reducers: {
    setFavorites: (state, { payload }) => {
      state.favorites = payload;
    },
  },
});

export const { setFavorites } = favoritesSlice.actions;
const token = localStorage.getItem("token");

export const getFavorites = (id, page) => async (dispatch) => {
  try {
    const url = `${process.env.REACT_APP_SERVER}/posts/get-by-client/${id}?offset=${page}&limit=${process.env.REACT_APP_PROPERTIES_LIMIT}`;
    const response = await axios({
      method: "GET",
      url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(setFavorites(response.data));
    return response.data;
  } catch (e) {
    console.log("EJECUTO GET FAV");
    ErrorHandler(
      null,
      "Hubo un error al cargar los favoritos. Por favor, intentalo de nuevo más tarde."
    );
  }
};

export const addFavorite = (clientId, propertyId) => async () => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER}/posts/${clientId}`,
      data: { propertyId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    messageHandler("success", response.data.message);
  } catch (e) {
    ErrorHandler(null, e.response.data.message);
  }
};

export const deleteFavorite = (clientId, propertyId) => async () => {
  try {
    const response = await axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_SERVER}/posts/${clientId}`,
      data: { propertyId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    messageHandler("success", response.data.message);
  } catch (e) {
    ErrorHandler(null, e.response.data.message);
  }
};

export default favoritesSlice.reducer;
