import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import messageHandler from '../utlis/messageHandler';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    favorites: null,
  },
  reducers: {
    setFavorites: (state, {payload}) => {
      state.favorites = payload;
  },
}});

export const { setFavorites } = favoritesSlice.actions;
const token = localStorage.getItem("token");

export const getFavorites = (id) => async (dispatch) => {
  try{
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_SERVER}/posts/get-by-client/${id}`,
      headers: {
        Authorization: `Bearer ${token}`        
      }
    })
    dispatch(setFavorites(response.data));
  } catch (e) {
    messageHandler('error', e.response.data.message)
  }
}

export const addFavorite = (clientId, propertyId) => async () => {
  try{
    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER}/posts/${clientId}`,
      data: {propertyId},
      headers: {
        Authorization: `Bearer ${token}`        
      }
    })
    messageHandler('success', response.data.message)
  } catch (e) {
    messageHandler('error', e.response.data.message)
  }
}

export const deleteFavorite = (id, fetchData) => async () => {
  try{
    const response = await axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_SERVER}/posts/${id}`,
      headers: {
        Authorization: `Bearer ${token}`        
      }
    })
    messageHandler('success', response.data.message)
    fetchData()
  } catch (e) {
    messageHandler('error', e.response.data.message)
  }
}

export default favoritesSlice.reducer;
