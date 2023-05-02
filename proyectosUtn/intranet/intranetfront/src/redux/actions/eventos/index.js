import axios from 'axios';
import { ToastContent } from 'components/common/Toast';
import { toast } from 'react-toastify';
import React from 'react';
import handleError from 'utils/errorHandler';
import * as types from './types';

export const getWaitList = () => async dispatch => {
  try {
    dispatch({ type: types.EVENTO_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/evento/lista_espera'
    );

    dispatch({
      type: types.EVENTO_WAIT_LIST,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.EVENTO_FAIL,
      payload: error
    });
  }
};

export const inviteUsers = (eventoId, usuarioEventos) => async dispatch => {
  try {
    dispatch({ type: types.EVENTO_REQUEST });

    await axios.put(process.env.REACT_APP_SERVER + '/evento/invitar_usuarios', {
      eventoId,
      usuarioEventos
    });

    toast.success(
      <ToastContent
        title="Usuarios invitados"
        content="Se han invitado los usuarios correctamente"
      />
    );

    dispatch({
      type: types.EVENTO_INVITE_USERS
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.EVENTO_FAIL,
      payload: error
    });
  }
};

export const eventoGetById = id => async dispatch => {
  try {
    dispatch({ type: types.EVENTO_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/evento/by_id/' + id
    );

    dispatch({
      type: types.EVENTO_GET_BY_ID,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.EVENTO_FAIL,
      payload: error
    });
  }
};

export const eventoGetAllPending = () => async dispatch => {
  try {
    dispatch({ type: types.EVENTO_REQUEST });

    const res = await axios.get(
      process.env.REACT_APP_SERVER + '/evento/all_pending'
    );

    dispatch({
      type: types.EVENTO_GET_ALL_PENDING,
      payload: res.data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.EVENTO_FAIL,
      payload: error
    });
  }
};

export const eventoGetAllTypes = () => async dispatch => {
  try {
    dispatch({ type: types.EVENTO_REQUEST });

    const res = await axios.get(
      process.env.REACT_APP_SERVER + '/evento/event_types'
    );

    dispatch({
      type: types.EVENTO_GET_ALL_TYPES,
      payload: res.data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.EVENTO_FAIL,
      payload: error
    });
  }
};

export const eventoCreate = (fecha, tipoEventoId) => async dispatch => {
  try {
    dispatch({ type: types.EVENTO_REQUEST });

    await axios.post(process.env.REACT_APP_SERVER + '/evento/create', {
      fecha,
      tipoEventoId
    });

    toast.success(
      <ToastContent
        title="Evento creado"
        content="Se ha creado el evento correctamente"
      />
    );

    dispatch({
      type: types.EVENTO_CREATE
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.EVENTO_FAIL,
      payload: error
    });
  }
};

export const eventoUpdate = (eventoId, data) => async dispatch => {
  try {
    dispatch({ type: types.EVENTO_REQUEST });

    await axios.put(
      process.env.REACT_APP_SERVER + '/evento/update/' + eventoId,
      {
        data
      }
    );

    toast.success(
      <ToastContent
        title="Evento actualizado"
        content="Se ha actualizado el evento correctamente"
      />
    );

    dispatch({
      type: types.EVENTO_UPDATE
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.EVENTO_FAIL,
      payload: error
    });
  }
};

export const eventoDelete = eventoId => async dispatch => {
  try {
    dispatch({ type: types.EVENTO_REQUEST });

    await axios.delete(
      process.env.REACT_APP_SERVER + '/evento/delete/' + eventoId
    );

    toast.success(
      <ToastContent
        title="Evento eliminado"
        content="Se ha eliminado el evento correctamente"
      />
    );

    dispatch({
      type: types.EVENTO_DELETE
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.EVENTO_FAIL,
      payload: error
    });
  }
};

export const eventoApproveReject =
  (usuarioId, usuarioEventoId, estado) => async dispatch => {
    try {
      dispatch({ type: types.EVENTO_REQUEST });

      await axios.put(
        process.env.REACT_APP_SERVER + '/evento/aceptar_rechazar_empleado',
        {
          usuarioId,
          usuarioEventoId,
          estado
        }
      );

      toast.success(
        <ToastContent
          title="Evento actualizado"
          content="Se ha actualizado el evento correctamente"
        />
      );

      dispatch({
        type: types.EVENTO_APPROVE_REJECT
      });
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.EVENTO_FAIL,
        payload: error
      });
    }
  };

export const eventoFinalizar = eventoId => async dispatch => {
  try {
    dispatch({ type: types.EVENTO_REQUEST });

    await axios.put(
      process.env.REACT_APP_SERVER + '/evento/finalizar/' + eventoId
    );

    toast.success(
      <ToastContent
        title="Evento finalizado"
        content="Se ha finalizado el evento correctamente"
      />
    );

    dispatch({
      type: types.EVENTO_FINALIZAR
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.EVENTO_FAIL,
      payload: error
    });
  }
};
