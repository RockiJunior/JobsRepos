import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import messageHandler from '../utlis/messageHandler';

const searchesSlice = createSlice({
  name: 'searches',
  initialState: {
    searches: null,
  },
  reducers: {
    setSearches: (state, {payload}) => {
      state.searches = payload;
  },
}});

export const { setSearches } = searchesSlice.actions;
const token = localStorage.getItem("token");

export const getSearches = (id) => async (dispatch) => {
  try{
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_SERVER}/searches/get-by-client/${id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    dispatch(setSearches(response.data));
  } catch (e) {
    messageHandler('error', e.response.data.message)
  }
}

export const addSearch = (clientId, body) => async () => {
  try{
    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER}/searches/${clientId}`,
      data: body,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    messageHandler('success', response.data.message)
  } catch (e) {
    messageHandler('error', e.response.data.message)
  }
}

export const deleteSearch = (id) => async () => {
  try{
    const response = await axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_SERVER}/searches/${id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    messageHandler('success', response.data.message)
  } catch (e) {
    messageHandler('error', e.response.data.message)
  }
}

export const updateSearch = (id, body) => async () => {
  try{
    const response = await axios({
      method: "PATCH",
      url: `${process.env.REACT_APP_SERVER}/searches/update-search-name/${id}`,
      data: body,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    messageHandler('success', response.data.message)
  } catch (e) {
    messageHandler('error', e.response.data.message)
  }
}

export default searchesSlice.reducer;
