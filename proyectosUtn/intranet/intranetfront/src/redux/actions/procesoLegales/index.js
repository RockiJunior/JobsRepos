import axios from 'axios';
import { ToastContent } from 'components/common/Toast';
import React from 'react';
import { toast } from 'react-toastify';
import handleError from 'utils/errorHandler';
import * as types from './types';

export const procesoLegalesCrear = expedienteId => async dispatch => {
  try {
    dispatch({ type: types.PROCESO_LEGALES_REQUEST });

    const { data } = await axios.post(
      process.env.REACT_APP_SERVER + '/proceso_legales/create',
      {
        expedienteId
      }
    );

    dispatch({
      type: types.PROCESO_LEGALES_CREAR,
      payload: data
    });

    toast.success(
      <ToastContent
        title="Proceso legal creado correctamente"
        time="Justo ahora"
      />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.PROCESO_LEGALES_FAIL,
      payload: error
    });
  }
};

export const procesoLegalesCrearFallo =
  (
    procesoLegalesId,
    expedienteId,
    expedienteUserId,
    titulo,
    comentario,
    tipo,
    files
  ) =>
  async dispatch => {
    try {
      dispatch({ type: types.PROCESO_LEGALES_REQUEST });

      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/fallo/crear_fallo',
        {
          procesoLegalesId,
          titulo,
          comentario,
          tipo,
          paso: 0
        }
      );

      for (const file of files) {
        const formData = new FormData();
        formData.append('falloId', data.id);
        formData.append('expedienteId', expedienteId);
        formData.append('procesoLegalesId', procesoLegalesId);
        formData.append('userId', expedienteUserId);
        formData.append('file', file);

        await axios.post(
          process.env.REACT_APP_SERVER + '/fallo/upload_file',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      dispatch({
        type: types.PROCESO_LEGALES_CREAR_FALLO,
        payload: data
      });

      toast.success(
        <ToastContent title="Fallo creado correctamente" time="Justo ahora" />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.PROCESO_LEGALES_FAIL,
        payload: error
      });
    }
  };

export const procesoLegalesUpdateFallo =
  (
    procesoLegalesId,
    expedienteId,
    expedienteUserId,
    falloId,
    titulo,
    comentario,
    tipo,
    files
  ) =>
  async dispatch => {
    try {
      dispatch({ type: types.PROCESO_LEGALES_REQUEST });

      const { data } = await axios.put(
        process.env.REACT_APP_SERVER + '/fallo/editar_fallo',
        {
          falloId,
          titulo,
          comentario,
          tipo
        }
      );

      for (const file of files) {
        const formData = new FormData();
        formData.append('falloId', data.id);
        formData.append('expedienteId', expedienteId);
        formData.append('procesoLegalesId', procesoLegalesId);
        formData.append('userId', expedienteUserId);
        formData.append('file', file);

        await axios.post(
          process.env.REACT_APP_SERVER + '/fallo/upload_file',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      dispatch({
        type: types.PROCESO_LEGALES_UPDATE_FALLO,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Fallo actualizado correctamente"
          time="Justo ahora"
        />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.PROCESO_LEGALES_FAIL,
        payload: error
      });
    }
  };

export const procesoLegalesDeleteFallo = falloId => async dispatch => {
  try {
    dispatch({ type: types.PROCESO_LEGALES_REQUEST });

    await axios.delete(
      process.env.REACT_APP_SERVER + '/fallo/eliminar_fallo/' + falloId
    );

    dispatch({
      type: types.PROCESO_LEGALES_DELETE_FALLO,
      payload: falloId
    });

    toast.success(
      <ToastContent title="Fallo eliminado correctamente" time="Justo ahora" />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.PROCESO_LEGALES_FAIL,
      payload: error
    });
  }
};

export const procesoLegalesCrearDictamen =
  (
    procesoLegalesId,
    expedienteId,
    expedienteUserId,
    titulo,
    comentario,
    files
  ) =>
  async dispatch => {
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/dictamen/create',
        {
          procesoLegalesId,
          titulo,
          comentario
        }
      );

      for (const file of files) {
        const formData = new FormData();
        formData.append('dictamenId', data.id);
        formData.append('expedienteId', expedienteId);
        formData.append('procesoLegalesId', procesoLegalesId);
        formData.append('userId', expedienteUserId);
        formData.append('file', file);

        await axios.post(
          process.env.REACT_APP_SERVER + '/dictamen/upload_file',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      dispatch({
        type: types.PROCESO_LEGALES_CREAR_DICTAMEN,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Dictamen creado correctamente"
          time="Justo ahora"
        />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.PROCESO_LEGALES_FAIL,
        payload: error
      });
    }
  };

export const procesoLegalesUpdateDictamen =
  (
    procesoLegalesId,
    expedienteId,
    expedienteUserId,
    dictamenId,
    titulo,
    comentario,
    files
  ) =>
  async dispatch => {
    try {
      const { data } = await axios.put(
        process.env.REACT_APP_SERVER + '/dictamen/update/' + dictamenId,
        {
          titulo,
          comentario
        }
      );

      for (const file of files) {
        const formData = new FormData();
        formData.append('dictamenId', data.id);
        formData.append('expedienteId', expedienteId);
        formData.append('procesoLegalesId', procesoLegalesId);
        formData.append('userId', expedienteUserId);
        formData.append('file', file);

        await axios.post(
          process.env.REACT_APP_SERVER + '/dictamen/upload_file',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      dispatch({
        type: types.PROCESO_LEGALES_UPDATE_DICTAMEN,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Dictamen actualizado correctamente"
          time="Justo ahora"
        />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.PROCESO_LEGALES_FAIL,
        payload: error
      });
    }
  };

export const procesoLegalesDeleteDictamen = dictamenId => async dispatch => {
  try {
    await axios.delete(
      process.env.REACT_APP_SERVER + '/dictamen/delete/' + dictamenId
    );

    dispatch({
      type: types.PROCESO_LEGALES_DELETE_DICTAMEN,
      payload: dictamenId
    });

    toast.success(
      <ToastContent
        title="Resolución eliminada correctamente"
        time="Justo ahora"
      />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.PROCESO_LEGALES_FAIL,
      payload: error
    });
  }
};

export const procesoLegalesCrearResolucion =
  (
    procesoLegalesId,
    expedienteId,
    expedienteUserId,
    titulo,
    comentario,
    files
  ) =>
  async dispatch => {
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/resolucion/crear_resolucion',
        {
          procesoLegalesId,
          titulo,
          comentario,
          paso: 0
        }
      );

      for (const file of files) {
        const formData = new FormData();
        formData.append('resolucionId', data.id);
        formData.append('expedienteId', expedienteId);
        formData.append('procesoLegalesId', procesoLegalesId);
        formData.append('userId', expedienteUserId);
        formData.append('file', file);

        await axios.post(
          process.env.REACT_APP_SERVER + '/resolucion/upload_file',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      dispatch({
        type: types.PROCESO_LEGALES_CREAR_RESOLUCION,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Resolución creada correctamente"
          time="Justo ahora"
        />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.PROCESO_LEGALES_FAIL,
        payload: error
      });
    }
  };

export const procesoLegalesUpdateResolucion =
  (
    procesoLegalesId,
    expedienteId,
    expedienteUserId,
    resolucionId,
    titulo,
    comentario,
    files
  ) =>
  async dispatch => {
    try {
      const { data } = await axios.put(
        process.env.REACT_APP_SERVER + '/resolucion/editar_resolucion',
        {
          resolucionId,
          titulo,
          comentario
        }
      );

      for (const file of files) {
        const formData = new FormData();
        formData.append('resolucionId', data.id);
        formData.append('expedienteId', expedienteId);
        formData.append('procesoLegalesId', procesoLegalesId);
        formData.append('userId', expedienteUserId);
        formData.append('file', file);

        await axios.post(
          process.env.REACT_APP_SERVER + '/resolucion/upload_file',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      dispatch({
        type: types.PROCESO_LEGALES_UPDATE_RESOLUCION,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Resolución actualizada correctamente"
          time="Justo ahora"
        />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.PROCESO_LEGALES_FAIL,
        payload: error
      });
    }
  };

export const procesoLegalesDeleteResolucion =
  resolucionId => async dispatch => {
    try {
      await axios.delete(
        process.env.REACT_APP_SERVER +
          '/resolucion/eliminar_resolucion/' +
          resolucionId
      );

      dispatch({
        type: types.PROCESO_LEGALES_DELETE_RESOLUCION,
        payload: resolucionId
      });

      toast.success(
        <ToastContent
          title="Resolución eliminada correctamente"
          time="Justo ahora"
        />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.PROCESO_LEGALES_FAIL,
        payload: error
      });
    }
  };

export const procesoLegalesCrearCedula =
  (titulo, motivo, expedienteUsuarioId, procesoLegalesId, tipo, files) =>
  async dispatch => {
    try {
      dispatch({ type: types.PROCESO_LEGALES_REQUEST });

      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/cedula/create',
        {
          titulo,
          motivo,
          usuarioId: expedienteUsuarioId,
          procesoLegalesId,
          pasoCreacion: 0,
          tipo
        }
      );

      for (const file of files) {
        const formData = new FormData();
        formData.append('cedulaId', data.id);
        formData.append('userId', expedienteUsuarioId);
        formData.append('file', file);

        await axios.post(
          process.env.REACT_APP_SERVER + '/cedula/upload_file',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      dispatch({
        type: types.PROCESO_LEGALES_CREAR_CEDULA,
        payload: data
      });

      toast.success(
        <ToastContent title="Cédula creada correctamente" time="Justo ahora" />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.PROCESO_LEGALES_FAIL,
        payload: error
      });
    }
  };

export const procesoLegalesCrearNota =
  (procesoLegalesId, descripcion) => async dispatch => {
    try {
      dispatch({ type: types.PROCESO_LEGALES_REQUEST });

      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/nota_interna/create',
        {
          procesoLegalesId,
          descripcion
        }
      );

      dispatch({
        type: types.PROCESO_LEGALES_CREAR_NOTA,
        payload: data
      });

      toast.success(
        <ToastContent title="Nota creada correctamente" time="Justo ahora" />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.PROCESO_LEGALES_FAIL,
        payload: error
      });
    }
  };

export const procesoLegalesEliminarNota = notaId => async dispatch => {
  try {
    dispatch({ type: types.PROCESO_LEGALES_REQUEST });

    await axios.delete(
      process.env.REACT_APP_SERVER + '/nota_interna/delete/' + notaId
    );

    dispatch({
      type: types.PROCESO_LEGALES_DELETE_NOTA,
      payload: notaId
    });

    toast.success(
      <ToastContent title="Nota eliminada correctamente" time="Justo ahora" />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.PROCESO_LEGALES_FAIL,
      payload: error
    });
  }
};

export const procesoLegalesCrearInforme =
  (procesoLegalesId, expedienteId, tramiteUserId, titulo, comentario, files) =>
  async dispatch => {
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/informe/crear_informe',
        {
          procesoLegalesId,
          expedienteId,
          titulo,
          comentario
        }
      );

      for (const file of files) {
        const formData = new FormData();
        formData.append('informeId', data.id);
        formData.append('procesoLegalesId', procesoLegalesId);
        formData.append('expedienteId', expedienteId);
        formData.append('userId', tramiteUserId);
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
        type: types.PROCESO_LEGALES_CREAR_INFORME,
        payload: data
      });

      toast.success(
        <ToastContent title="Informe creado correctamente" time="Justo ahora" />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.PROCESO_LEGALES_FAIL,
        payload: error
      });
    }
  };

export const procesoLegalesUpdateInforme =
  (
    procesoLegalesId,
    expedienteId,
    tramiteUserId,
    informeId,
    titulo,
    comentario,
    files
  ) =>
  async dispatch => {
    try {
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
        formData.append('procesoLegalesId', procesoLegalesId);
        formData.append('expedienteId', expedienteId);
        formData.append('userId', tramiteUserId);
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
        type: types.PROCESO_LEGALES_UPDATE_INFORME,
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
        type: types.PROCESO_LEGALES_FAIL,
        payload: error
      });
    }
  };

export const procesoLegalesDeleteInforme = informeId => async dispatch => {
  try {
    await axios.delete(
      process.env.REACT_APP_SERVER + '/informe/eliminar_informe/' + informeId
    );

    dispatch({
      type: types.PROCESO_LEGALES_DELETE_INFORME,
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
      type: types.PROCESO_LEGALES_FAIL,
      payload: error
    });
  }
};

export const procesoLegalesCrearArchivo =
  (titulo, file, procesoLegalesId, expedienteId, expedienteUserId) =>
  async dispatch => {
    try {
      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('expedienteId', expedienteId);
      formData.append('procesoLegalesId', procesoLegalesId);
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
        type: types.PROCESO_LEGALES_CREAR_ARCHIVO,
        payload: data
      });
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.PROCESO_LEGALES_FAIL,
        payload: error
      });
    }
  };

export const procesoLegalesEliminarArchivo = archivoId => async dispatch => {
  try {
    await axios.delete(
      process.env.REACT_APP_SERVER + '/archivo/delete/' + archivoId
    );

    dispatch({
      type: types.PROCESO_LEGALES_DELETE_ARCHIVO,
      payload: archivoId
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.PROCESO_LEGALES_FAIL,
      payload: error
    });
  }
};

export const procesoLegalCancelar = procesoLegalesId => async dispatch => {
  try {
    dispatch({ type: types.PROCESO_LEGALES_REQUEST });

    await axios.put(
      process.env.REACT_APP_SERVER + '/proceso_legales/cancelar',
      {
        procesoLegalesId
      }
    );

    dispatch({
      type: types.PROCESO_LEGALES_CANCELAR
    });

    toast.success(
      <ToastContent
        title="Proceso cancelado correctamente"
        time="Justo ahora"
      />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.PROCESO_LEGALES_FAIL,
      payload: error
    });
  }
};

export const procesoLegalPasoAnterior = procesoLegalId => async dispatch => {
  try {
    const { data } = await axios.put(
      process.env.REACT_APP_SERVER + '/proceso_legales/paso_anterior',
      {
        procesoLegalId
      }
    );

    dispatch({
      type: types.PROCESO_LEGALES_PASO_ANTERIOR,
      payload: data
    });

    toast.success(
      <ToastContent
        title="Se ha regresado al paso anterior"
        time="Justo ahora"
      />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.PROCESO_LEGALES_FAIL,
      payload: error
    });
  }
};

export const procesoLegalPasoSiguiente = procesoLegalId => async dispatch => {
  try {
    const { data } = await axios.put(
      process.env.REACT_APP_SERVER + '/proceso_legales/paso_siguiente',
      {
        procesoLegalId
      }
    );

    dispatch({
      type: types.PROCESO_LEGALES_PASO_SIGUIENTE,
      payload: data
    });

    toast.success(
      <ToastContent
        title="Se ha continuado con el tramite"
        time="Justo ahora"
      />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.PROCESO_LEGALES_FAIL,
      payload: error
    });
  }
};

export const procesoLegalAprobarPorArea = procesoLegalId => async dispatch => {
  try {
    const { data } = await axios.put(
      process.env.REACT_APP_SERVER + '/proceso_legales/aprobar_por_area',
      {
        procesoLegalId
      }
    );

    dispatch({
      type: types.PROCESO_LEGALES_APROBAR_POR_AREA,
      payload: data
    });

    toast.success(
      <ToastContent title="Proceso aprobado correctamente" time="Justo ahora" />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.PROCESO_LEGALES_FAIL,
      payload: error
    });
  }
};

export const procesoLegalRechazarPorArea = procesoLegalId => async dispatch => {
  try {
    const { data } = await axios.put(
      process.env.REACT_APP_SERVER + '/proceso_legales/rechazar_por_area',
      {
        procesoLegalId
      }
    );

    dispatch({
      type: types.PROCESO_LEGALES_RECHAZAR_POR_AREA,
      payload: data
    });

    toast.success(
      <ToastContent
        title="Proceso rechazado correctamente"
        time="Justo ahora"
      />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.PROCESO_LEGALES_FAIL,
      payload: error
    });
  }
};

export const getImputaciones = () => async dispatch => {
  try {
    dispatch({ type: types.PROCESO_LEGALES_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/imputacion/get_imputaciones'
    );

    dispatch({
      type: types.PROCESO_LEGALES_GET_IMPUTACIONES,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.PROCESO_LEGALES_FAIL,
      payload: error
    });
  }
};

export const procesoLegalCrearDespachoImputacion =
  (
    procesoLegalesId,
    imputaciones,
    titulo,
    motivo,
    handleClose,
    reset,
    goToSection,
    setKey
  ) =>
  async dispatch => {
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/imputacion/create',
        {
          procesoLegalesId,
          imputaciones,
          titulo,
          motivo
        }
      );

      dispatch({
        type: types.PROCESO_LEGALES_CREAR_DESPACHO_IMPUTACION,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Despacho de imputación creado correctamente"
          time="Justo ahora"
        />
      );

      handleClose && handleClose();
      reset && reset();
      goToSection && goToSection('imputaciones');
      setKey && setKey('informacion');
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.PROCESO_LEGALES_FAIL,
        payload: error
      });
    }
  };

export const procesoLegalUpdateDespachoImputacion =
  (despachoImputacionId, imputaciones, titulo, motivo, handleClose, reset) =>
  async dispatch => {
    try {
      const { data } = await axios.put(
        process.env.REACT_APP_SERVER +
          '/imputacion/update/' +
          despachoImputacionId,
        {
          imputaciones,
          titulo,
          motivo
        }
      );

      dispatch({
        type: types.PROCESO_LEGALES_UPDATE_DESPACHO_IMPUTACION,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Despacho de imputación actualizado correctamente"
          time="Justo ahora"
        />
      );

      handleClose && handleClose();
      reset && reset();
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.PROCESO_LEGALES_FAIL,
        payload: error
      });
    }
  };

export const procesoLegalDeleteDespachoImputacion =
  despachoImputacionId => async dispatch => {
    try {
      const { data } = await axios.delete(
        process.env.REACT_APP_SERVER +
          '/imputacion/delete/' +
          despachoImputacionId
      );

      dispatch({
        type: types.PROCESO_LEGALES_DELETE_DESPACHO_IMPUTACION,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Despacho de imputación eliminado correctamente"
          time="Justo ahora"
        />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.PROCESO_LEGALES_FAIL,
        payload: error
      });
    }
  };
