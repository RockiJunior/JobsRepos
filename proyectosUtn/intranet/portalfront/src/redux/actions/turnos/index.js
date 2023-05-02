import axios from 'axios';
import React from 'react';
import * as types from './types';
import handleError from 'utils/errorHandler';
import { toast } from 'react-toastify';
import { ToastContent } from 'components/common/Toast';

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

export const reservarTurnoFiscalizacion =
  (
    {
      motivo,
      fecha,
      nombreTitular,
      apellidoTitular,
      dniTitular,
      mailTitular,
      telefono,
      empresa,
      direccion,
      numero,
      piso,
      depto,
      localidad,
      concurre,
      nombreConcurre,
      apellidoConcurre,
      matricula,
      numeroMatricula,
      acta,
      visita,
      inspeccion,
      nombreInspector,
      formaPago
    },
    setTurnoPedido,
    usuarioId
  ) =>
  async dispatch => {
    try {
      dispatch({ type: types.TURNOS_REQUEST });
      await axios.post(
        process.env.REACT_APP_SERVER + '/turnos/turno_fiscalizacion',
        {
          motivo,
          fecha,
          nombreTitular,
          apellidoTitular,
          dniTitular,
          mailTitular,
          telefono,
          empresa,
          direccion,
          numero,
          piso,
          depto,
          localidad,
          concurre,
          nombreConcurre,
          apellidoConcurre,
          matricula,
          numeroMatricula,
          acta,
          visita,
          inspeccion,
          nombreInspector,
          formaPago,
          usuarioId
        }
      );
      dispatch({ type: types.TUNROS_RESERVAR_FISCALIZACION });
      toast.success(
        <ToastContent
          title="Turno reservado"
          description="El turno se reservó correctamente"
          body="El turno se reservó correctamente. Via mail se le enviará la confirmación de la reserva."
        />
      );

      setTurnoPedido({ inicio: fecha });
    } catch (err) {
      handleError(err, dispatch);
    }
  };
