import axios from 'axios';
import { ToastContent } from 'components/common/Toast';
import { toast } from 'react-toastify';
import handleError from 'utils/errorHandler';
import { getQueries } from 'utils/getQueries';
import * as types from './types';
import React from 'react';

export const cedulaGetById = id => async dispatch => {
  try {
    dispatch({ type: types.CEDULA_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/cedula/by_id/' + id
    );

    dispatch({
      type: types.CEDULA_GET_BY_ID,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: types.CEDULA_FAIL,
      payload: error
    });
  }
};

export const cedulaSinAsignar = queries => async dispatch => {
  try {
    dispatch({ type: types.CEDULA_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/cedula/sin_asignar' + getQueries(queries)
    );

    dispatch({
      type: types.CEDULA_SIN_ASIGNAR,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.CEDULA_FAIL,
      payload: error
    });
  }
};

export const cedulaAsignarEmpleado =
  (cedulaId, empleadoId) => async dispatch => {
    try {
      dispatch({ type: types.CEDULA_REQUEST });

      const { data } = await axios.put(
        process.env.REACT_APP_SERVER + '/cedula/asignar_empleado/' + cedulaId,
        { empleadoId }
      );

      dispatch({
        type: types.CEDULA_ASIGNAR_EMPLEADO,
        payload: data
      });

      toast(
        <ToastContent
          title="Asignación de cédula"
          message="Cédula asignada correctamente"
          type="success"
        />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.CEDULA_FAIL,
        payload: error
      });
    }
  };

export const actualizarFechaRecepcion = cedulaId => async dispatch => {
  try {
    dispatch({ type: types.CEDULA_REQUEST });

    const { data } = await axios.put(
      process.env.REACT_APP_SERVER +
        '/cedula/actualizar_fecha_recepcion/' +
        cedulaId
    );

    dispatch({
      type: types.ACTUALIZAR_FECHA_RECEPCION,
      payload: data
    });

    toast(
      <ToastContent
        title="Actualización de fecha de recepción"
        message="Fecha de recepción actualizada correctamente"
        type="success"
      />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.CEDULA_FAIL,
      payload: error
    });
  }
};

export const cedulaPasoSiguiente = cedulaId => async dispatch => {
  try {
    dispatch({ type: types.CEDULA_REQUEST });

    const { data } = await axios.put(
      process.env.REACT_APP_SERVER + '/cedula/paso_siguiente/' + cedulaId
    );

    dispatch({
      type: types.CEDULA_PASO_SIGUIENTE,
      payload: data
    });

    toast(
      <ToastContent
        title="Paso siguiente"
        message="Paso siguiente realizado correctamente"
        type="success"
      />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.CEDULA_FAIL,
      payload: error
    });
  }
};

export const cedulaGetByEmpleadoId = (userId, queries) => async dispatch => {
  try {
    dispatch({ type: types.CEDULA_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER +
        '/cedula/by_empleado_id/' +
        userId +
        getQueries(queries)
    );

    dispatch({
      type: types.CEDULA_GET_BY_EMPLEADO_ID,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: types.CEDULA_FAIL,
      payload: error
    });
  }
};

export const cedulaCrearNota = (cedulaId, descripcion) => async dispatch => {
  try {
    dispatch({ type: types.CEDULA_REQUEST });

    const { data } = await axios.post(
      process.env.REACT_APP_SERVER + '/nota_interna/create',
      {
        cedulaId,
        descripcion
      }
    );

    dispatch({
      type: types.CEDULA_CREAR_NOTA,
      payload: data
    });

    toast.success(
      <ToastContent title="Nota creada correctamente" time="Justo ahora" />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.CEDULA_FAIL,
      payload: error
    });
  }
};

export const cedulaEliminarNota = notaId => async dispatch => {
  try {
    dispatch({ type: types.CEDULA_REQUEST });

    await axios.delete(
      process.env.REACT_APP_SERVER + '/nota_interna/delete/' + notaId
    );

    dispatch({
      type: types.CEDULA_ELIMINAR_NOTA,
      payload: notaId
    });

    toast.success(
      <ToastContent title="Nota eliminada correctamente" time="Justo ahora" />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.CEDULA_FAIL,
      payload: error
    });
  }
};

export const cedulaCrearInforme =
  (cedulaId, cedulaUserId, paso, titulo, comentario, files) =>
  async dispatch => {
    try {
      dispatch({ type: types.CEDULA_REQUEST });

      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/informe/crear_informe',
        {
          cedulaId,
          titulo,
          comentario,
          paso
        }
      );

      for (const file of files) {
        const formData = new FormData();
        formData.append('informeId', data.id);
        formData.append('cedulaId', cedulaId);
        formData.append('userId', cedulaUserId);
        formData.append('file', file);

        await axios.post(
          process.env.REACT_APP_SERVER + '/informe/upload_file',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      dispatch({
        type: types.CEDULA_CREAR_INFORME,
        payload: data
      });

      toast.success(
        <ToastContent title="Informe creado correctamente" time="Justo ahora" />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.CEDULA_FAIL,
        payload: error
      });
    }
  };

export const cedulaEditarInforme =
  (cedulaId, cedulaUserId, informeId, titulo, comentario, files) =>
  async dispatch => {
    try {
      dispatch({ type: types.CEDULA_REQUEST });

      const { data } = await axios.put(
        process.env.REACT_APP_SERVER + '/informe/editar_informe',
        {
          informeId,
          titulo,
          comentario
        }
      );

      for (const file of files) {
        const formData = new FormData();
        formData.append('informeId', data.id);
        formData.append('expedienteId', cedulaId);
        formData.append('userId', cedulaUserId);
        formData.append('file', file);

        await axios.post(
          process.env.REACT_APP_SERVER + '/informe/upload_file',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      dispatch({
        type: types.CEDULA_EDITAR_INFORME,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Informe actualizado correctamente"
          time="Justo ahora"
        />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.CEDULA_FAIL,
        payload: error
      });
    }
  };

export const cedulaDeleteInforme = cedulaId => async dispatch => {
  try {
    dispatch({ type: types.CEDULA_REQUEST });

    await axios.delete(
      process.env.REACT_APP_SERVER + '/informe/eliminar_informe/' + cedulaId
    );

    dispatch({
      type: types.CEDULA_ELIMINAR_INFORME,
      payload: cedulaId
    });

    toast.success(
      <ToastContent
        title="Informe eliminado correctamente"
        time="Justo ahora"
      />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.CEDULA_FAIL,
      payload: error
    });
  }
};

export const cedulaGetRelations = cedulaId => async dispatch => {
  try {
    dispatch({ type: types.CEDULA_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/cedula/buscar_familia/' + cedulaId
    );

    dispatch({
      type: types.CEDULA_GET_RELATIONS,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.CEDULA_FAIL,
      payload: error
    });
  }
};

export const cedulaGetAllByArea = queries => async dispatch => {
  try {
    dispatch({ type: types.CEDULA_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/cedula/by_area' + getQueries(queries)
    );

    dispatch({
      type: types.CEDULA_GET_ALL_BY_AREA,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.CEDULA_FAIL,
      payload: error
    });
  }
};
