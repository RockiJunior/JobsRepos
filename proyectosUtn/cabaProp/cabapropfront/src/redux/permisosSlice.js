import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const permisosSlice = createSlice({
  name: 'permisos',
  initialState:{
    data: []
  },
  reducers: {
    setPermisos: (state, {payload}) => {
      state.data = payload;
    }
  }
});

export const { setPermisos } = permisosSlice.actions;

export const getPermisos = (token) => async(dispatch) => {
  const response = await axios({
    method: "GET",
    url: `${process.env.REACT_APP_SERVER}/permissions`,
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
  dispatch(setPermisos(response.data))
}

export default permisosSlice.reducer;