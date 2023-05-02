import { createSlice } from '@reduxjs/toolkit';

import axios from 'axios';
import messageHandler from 'utils/messageHandler';

const rolSlice = createSlice({
  name: 'roles',
  initialState:{
    data: [],
    rolesById: {}
  },
  reducers: {
    setRoles: (state, {payload}) => {
      state.data = payload;
    },
    setRolesById: (state, {payload}) => {
      state.rolesById= {
        ...state.rolesById,
        [payload.id]: payload
      }
    }
  }
});

export const { setRoles, setRolesById } = rolSlice.actions;

export const getRoles = (token) => async(dispatch) => {
  try{
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_SERVER}/roles`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    dispatch(setRoles(response.data))
  } catch (e) {
    console.log(e)
  }
}

export const createRol = (nuevoRol, realEstate, token) => async (dispatch) => {
  try{
    const newRol = {
      name: nuevoRol.nombre,
      permissionIds: []
    }
    const cleanFalses = (object) => {
      for (let key in object) {
        object[parseInt(key)] ? newRol.permissionIds.push(key) : null
      }
    }
    cleanFalses(nuevoRol?.permisos)
    const response = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER}/roles/${realEstate}`,
        data: newRol,
        headers: {
          Authorization: `Bearer ${token}`
        }
    })
      messageHandler('success', response.data.message)
  } catch (e){
      messageHandler('error', e.response.data.message)
  }
}

export const deleteRol = (id, token) => async () => {
  try{
    const response = await axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_SERVER}/roles/${id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    messageHandler('success', response.data.message)
  }catch(e){
    messageHandler('error', e.response)
  }
}

export const getRolById = (id, token) => async (dispatch) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_SERVER}/roles/${id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    dispatch(setRolesById(response.data))
  }catch(e){
    console.log(e)
  }
}

export const getRolByIdPublic = (id) => async (dispatch) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_SERVER}/users/get-user-permissions/${id}`
    })
    dispatch(setRolesById(response.data))
  }catch(e){
    console.log(e)
  }
}

export const editRol = ({id, inmobiliaria, nombre, permisos}, token) => async () => {
  try {
    const rolData = {
      roleId: id,
      name: nombre,
      permissionIds: []
    }
    const cleanFalses = (object) => {
      for (let key in object) {
        object[parseInt(key)] ? rolData.permissionIds.push(key) : null
      }
    }
    cleanFalses(permisos)
    const response = await axios ({
      method: "PATCH",
      url: `${process.env.REACT_APP_SERVER}/roles/${inmobiliaria}`,
      data: rolData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    messageHandler('success', response.data.message)
  }catch(e){
    messageHandler('error', e.response.data.message)
  }
}

export default rolSlice.reducer;