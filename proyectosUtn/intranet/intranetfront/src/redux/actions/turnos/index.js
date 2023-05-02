import axios from 'axios';
import React from 'react';
import { ToastContent } from 'components/common/Toast';
import { toast } from 'react-toastify';
import handleError from 'utils/errorHandler';
import * as types from './types';

export const turnosGetAllByAreaID = areaId => async dispatch => {
  try {
    dispatch({ type: types.TURNOS_REQUEST });

    const { data } = await axios.post(
      process.env.REACT_APP_SERVER + '/turnos/turnos_reservados',
      {
        areaId
      }
    );

    dispatch({
      type: types.TURNOS_GET_ALL_BY_AREA_ID,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.TURNOS_FAIL,
      payload: error
    });
  }
};

export const turnosGetAllAreas = () => async dispatch => {
  try {
    dispatch({ type: types.TURNOS_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/turnos/all'
    );

    dispatch({
      type: types.TURNOS_GET_ALL_AREAS,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.TURNOS_FAIL,
      payload: error
    });
  }
};

export const turnosUpdateStatus = (estado, turnoId) => async dispatch => {
  try {
    dispatch({ type: types.TURNOS_REQUEST });

    const { data } = await axios.put(
      process.env.REACT_APP_SERVER + '/turnos/actualizar_estado_turno',
      {
        estado,
        turnoId
      }
    );

    dispatch({
      type: types.TURNOS_UPDATE_STATUS,
      payload: data
    });

    if (estado === 'approved') {
      toast.success(
        <ToastContent title="Turno finalizado" time="Justo ahora" />
      );
    } else {
      toast.warning(
        <ToastContent
          title="Documentación rechazada"
          body="Se solicitará al usuario volver a sacar un nuevo turno"
          time="Justo ahora"
        />
      );
    }
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.TURNOS_FAIL,
      payload: error
    });
  }
};

export const getTurnosByMonth = (month, year, areaId) => async dispatch => {
  try {
    dispatch({ type: types.TURNOS_REQUEST });
    const res = await axios.post(
      process.env.REACT_APP_SERVER + '/turnos/turnos_disponibles',
      {
        anio: year,
        mes: month,
        areaId: areaId
      }
    );
    dispatch({ type: types.TURNOS_GET_BY_MONTH, payload: res.data });
  } catch (err) {
    handleError(err, dispatch);
  }
};

export const reservarTurno =
  (inicio, fin, areaId, tramiteId) => async dispatch => {
    try {
      dispatch({ type: types.TURNOS_REQUEST });
      await axios.post(
        process.env.REACT_APP_SERVER + '/turnos/reservar_turno',

        {
          inicio,
          fin,
          areaId,
          tramiteId
        }
      );
      dispatch({ type: types.TURNOS_RESERVAR });
      toast.success(
        <ToastContent
          title="Turno reservado"
          description="El turno se reservó correctamente"
          body="El turno se reservó correctamente. Via mail se le enviará la confirmación de la reserva."
        />
      );
    } catch (err) {
      handleError(err, dispatch);
    }
  };
