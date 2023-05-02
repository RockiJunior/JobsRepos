import axios from 'axios';
import { ToastContent } from 'components/common/Toast';
import { toast } from 'react-toastify';
import React from 'react';
import handleError from 'utils/errorHandler';
import * as types from './types';

export const disponibilidadGetByArea = areaId => async dispatch => {
  try {
    dispatch({ type: types.DISPONIBILIDAD_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/disponibilidad/byArea/' + areaId
    );

    dispatch({
      type: types.DISPONIBILIDAD_GET_BY_AREA,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.DISPONIBILIDAD_FAIL,
      payload: error
    });
  }
};

export const disponibilidadCreate = data => async dispatch => {
  try {
    dispatch({ type: types.DISPONIBILIDAD_REQUEST });
    console.log(data);
    await axios.post(
      process.env.REACT_APP_SERVER + '/disponibilidad/create',
      data
    );

    toast.success(
      <ToastContent
        title="Disponibilidad creada"
        content="Se ha creado la disponibilidad correctamente"
      />
    );

    dispatch({
      type: types.DISPONIBILIDAD_CREATE
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.DISPONIBILIDAD_FAIL,
      payload: error
    });
  }
};

export const disponibilidadUpdate = data => async dispatch => {
  try {
    dispatch({ type: types.DISPONIBILIDAD_REQUEST });

    const { id, ...dispData } = data;
    await axios.put(
      process.env.REACT_APP_SERVER + '/disponibilidad/update/' + id,
      dispData
    );

    toast.success(
      <ToastContent
        title="Disponibilidad actualizada"
        content="Se ha actualizado la disponibilidad correctamente"
      />
    );

    dispatch({
      type: types.DISPONIBILIDAD_UPDATE
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.DISPONIBILIDAD_FAIL,
      payload: error
    });
  }
};

export const disponibilidadDelete = id => async dispatch => {
  try {
    dispatch({ type: types.DISPONIBILIDAD_REQUEST });

    await axios.delete(
      process.env.REACT_APP_SERVER + '/disponibilidad/delete/' + id
    );

    toast.success(
      <ToastContent
        title="Disponibilidad eliminada"
        content="Se ha eliminado la disponibilidad correctamente"
      />
    );

    dispatch({
      type: types.DISPONIBILIDAD_DELETE
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.DISPONIBILIDAD_FAIL,
      payload: error
    });
  }
};
