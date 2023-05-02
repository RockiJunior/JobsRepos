import axios from 'axios';
import { ToastContent } from 'components/common/Toast';
import { toast } from 'react-toastify';
import handleError from 'utils/errorHandler';
import { getQueries } from 'utils/getQueries';
import * as types from './types';
import React from 'react';
import { areasNames } from 'data/areas';

export const expedienteCreate =
  ({ tipoId, userId, tramitePadreId, expedientePadreId }, navigate) =>
  async dispatch => {
    try {
      dispatch({ type: types.EXPEDIENTES_REQUEST });

      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/expediente/create',
        {
          tipoId,
          userId,
          tramitePadreId,
          expedientePadreId
        }
      );

      dispatch({
        type: types.EXPEDIENTES_CREATE,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Expediente creado"
          body="El expediente se ha creado correctamente"
        />
      );

      navigate && navigate('/expedientes/' + data.id);
    } catch (error) {
      console.log(error);
      dispatch({ type: types.EXPEDIENTES_FAIL, payload: error });
      handleError(error, dispatch);
    }
  };

export const expedienteGetById = id => async dispatch => {
  try {
    dispatch({ type: types.EXPEDIENTES_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/expediente/by_id/' + id
    );

    dispatch({
      type: types.EXPEDIENTES_GET_BY_ID,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: types.EXPEDIENTES_FAIL,
      payload: error
    });
  }
};

export const expedientesGetAllByAdminId = (id, queries) => async dispatch => {
  try {
    dispatch({ type: types.EXPEDIENTES_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER +
        '/expediente/by_admin_id/' +
        id +
        getQueries(queries)
    );

    dispatch({
      type: types.EXPEDIENTES_GET_ALL_BY_ADMIN_ID,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.EXPEDIENTES_FAIL,
      payload: error
    });
  }
};

export const expedientesGetAllByArea = queries => async dispatch => {
  try {
    dispatch({ type: types.EXPEDIENTES_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/expediente/by_area' + getQueries(queries)
    );

    dispatch({
      type: types.EXPEDIENTES_GET_ALL_BY_AREA,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.EXPEDIENTES_FAIL,
      payload: error
    });
  }
};

export const expedienteGetSinAsignarPorArea = queries => async dispatch => {
  try {
    dispatch({ type: types.EXPEDIENTES_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER +
        '/expediente/sin_asignar_por_area' +
        getQueries(queries)
    );

    dispatch({
      type: types.EXPEDIENTES_GET_SIN_ASIGNAR_POR_AREA,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.EXPEDIENTES_FAIL,
      payload: error
    });
  }
};

export const expedienteAsignarEmpleado =
  (expedienteId, encargadoId) => async dispatch => {
    try {
      dispatch({ type: types.EXPEDIENTES_REQUEST });

      const { data } = await axios.put(
        process.env.REACT_APP_SERVER + '/expediente/asignar_empleado',
        {
          expedienteId,
          encargadoId
        }
      );

      dispatch({
        type: types.EXPEDIENTES_ASIGNAR_EMPLEADO,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Expediente asignado correctamente"
          time="Justo ahora"
        />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.EXPEDIENTES_FAIL,
        payload: error
      });
    }
  };

export const expedienteCrearArchivo =
  (titulo, file, expedienteId, expedienteUserId) => async dispatch => {
    try {
      dispatch({ type: types.EXPEDIENTES_REQUEST });

      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('expedienteId', expedienteId);
      formData.append('userId', expedienteUserId);
      formData.append('file', file);

      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/archivo/create',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      dispatch({
        type: types.EXPEDIENTES_CREAR_ARCHIVO,
        payload: data
      });
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.EXPEDIENTES_FAIL,
        payload: error
      });
    }
  };

export const expedienteEliminarArchivo = archivoId => async dispatch => {
  try {
    dispatch({ type: types.EXPEDIENTES_REQUEST });

    await axios.delete(
      process.env.REACT_APP_SERVER + '/archivo/delete/' + archivoId
    );

    dispatch({
      type: types.EXPEDIENTES_DELETE_ARCHIVO,
      payload: archivoId
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.EXPEDIENTES_FAIL,
      payload: error
    });
  }
};

export const expedienteCrearNota =
  (expedienteId, descripcion) => async dispatch => {
    try {
      dispatch({ type: types.EXPEDIENTES_REQUEST });

      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/nota_interna/create',
        {
          expedienteId,
          descripcion
        }
      );

      dispatch({
        type: types.EXPEDIENTES_CREAR_NOTA,
        payload: data
      });

      toast.success(
        <ToastContent title="Nota creada correctamente" time="Justo ahora" />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.EXPEDIENTES_FAIL,
        payload: error
      });
    }
  };

export const expedienteEliminarNota = notaId => async dispatch => {
  try {
    dispatch({ type: types.EXPEDIENTES_REQUEST });

    await axios.delete(
      process.env.REACT_APP_SERVER + '/nota_interna/delete/' + notaId
    );

    dispatch({
      type: types.EXPEDIENTES_DELETE_NOTA,
      payload: notaId
    });

    toast.success(
      <ToastContent title="Nota eliminada correctamente" time="Justo ahora" />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.EXPEDIENTES_FAIL,
      payload: error
    });
  }
};

export const expedienteGetRelations = expedienteId => async dispatch => {
  try {
    dispatch({ type: types.EXPEDIENTES_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER +
        '/expediente/buscar_familia/' +
        expedienteId
    );

    dispatch({
      type: types.EXPEDIENTE_GET_RELATIONS,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.EXPEDIENTES_FAIL,
      payload: error
    });
  }
};

export const expedientesCrearInforme =
  (expedienteId, expedienteUserId, titulo, comentario, files) =>
  async dispatch => {
    try {
      dispatch({ type: types.EXPEDIENTES_REQUEST });

      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/informe/crear_informe',
        {
          expedienteId,
          titulo,
          comentario,
          paso: 0
        }
      );

      for (const file of files) {
        const formData = new FormData();
        formData.append('informeId', data.id);
        formData.append('expedienteId', expedienteId);
        formData.append('userId', expedienteUserId);
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
        type: types.EXPEDIENTES_CREAR_IFORME,
        payload: data
      });

      toast.success(
        <ToastContent title="Informe creado correctamente" time="Justo ahora" />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.EXPEDIENTES_FAIL,
        payload: error
      });
    }
  };

export const expedientesUpdateInforme =
  (expedienteId, expedienteUserId, informeId, titulo, comentario, files) =>
  async dispatch => {
    try {
      dispatch({ type: types.EXPEDIENTES_REQUEST });

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
        formData.append('expedienteId', expedienteId);
        formData.append('userId', expedienteUserId);
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
        type: types.EXPEDIENTES_UPDATE_IFORME,
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
        type: types.EXPEDIENTES_FAIL,
        payload: error
      });
    }
  };

export const expedientesDeleteInforme = informeId => async dispatch => {
  try {
    dispatch({ type: types.EXPEDIENTES_REQUEST });

    await axios.delete(
      process.env.REACT_APP_SERVER + '/informe/eliminar_informe/' + informeId
    );

    dispatch({
      type: types.EXPEDIENTES_DELETE_IFORME,
      payload: informeId
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
      type: types.EXPEDIENTES_FAIL,
      payload: error
    });
  }
};

export const expedienteCrearCaratula =
  (expedienteId, titulo, denunciante, denunciado) => async dispatch => {
    try {
      dispatch({ type: types.EXPEDIENTES_REQUEST });

      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/caratula/create',
        {
          expedienteId,
          titulo,
          denunciante,
          denunciado
        }
      );

      dispatch({
        type: types.EXPEDIENTE_CREAR_CARATULA,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Carátula creada correctamente"
          time="Justo ahora"
        />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.EXPEDIENTES_FAIL,
        payload: error
      });
    }
  };

export const expedienteCambiarArea =
  (areaId, expedienteId) => async dispatch => {
    try {
      const { data } = await axios.put(
        process.env.REACT_APP_SERVER + '/expediente/cambiar_area',
        {
          areaId,
          expedienteId
        }
      );

      dispatch({
        type: types.EXPEDIENTES_CAMBIAR_AREA,
        payload: data
      });

      toast.success(
        <ToastContent
          title={`Expediente enviado a ${areasNames[areaId]}`}
          time="Justo ahora"
        />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.EXPEDIENTES_FAIL,
        payload: error
      });
    }
  };

export const expedienteFinalizar = expedienteId => async dispatch => {
  try {
    const { data } = await axios.put(
      process.env.REACT_APP_SERVER + '/expediente/finalizar',
      {
        expedienteId
      }
    );

    dispatch({
      type: types.EXPEDIENTE_FINALIZAR,
      payload: data
    });

    toast.success(
      <ToastContent title={`Expediente finalizado`} time="Justo ahora" />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.EXPEDIENTES_FAIL,
      payload: error
    });
  }
};
