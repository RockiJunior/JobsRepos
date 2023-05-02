import axios from 'axios';
import { ToastContent } from 'components/common/Toast';
import { toast } from 'react-toastify';
import React from 'react';
import handleError from 'utils/errorHandler';
import * as types from './types';
import { getQueries } from 'utils/getQueries';

export const tramiteGetById = id => async dispatch => {
  try {
    dispatch({ type: types.TRAMITES_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/tramite/empleado/by_id/' + id
    );

    dispatch({
      type: types.TRAMITES_GET_BY_ID,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: types.TRAMITES_FAIL,
      payload: error
    });
  }
};

export const tramitesGetAllByAdminId = (id, queries) => async dispatch => {
  try {
    dispatch({ type: types.TRAMITES_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER +
        '/tramite/by_admin_id/' +
        id +
        getQueries(queries)
    );

    dispatch({
      type: types.TRAMITES_GET_ALL_BY_ADMIN_ID,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.TRAMITES_FAIL,
      payload: error
    });
  }
};

export const tramitesGetAllByArea = queries => async dispatch => {
  try {
    dispatch({ type: types.TRAMITES_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/tramite/by_area' + getQueries(queries)
    );

    dispatch({
      type: types.TRAMITES_GET_ALL_BY_AREA,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.TRAMITES_FAIL,
      payload: error
    });
  }
};

export const upsertInputsValues =
  (inputs, tramiteId, usuarioId, tituloSeccion) => async dispatch => {
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/input_values/upsert_many_empleados',
        {
          inputs,
          tramiteId,
          usuarioId,
          tituloSeccion
        }
      );

      dispatch({
        type: types.TRAMITES_UPSERT_INPUTS_VALUES,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Corrección envíada correctamente"
          time="Justo ahora"
        />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.TRAMITES_FAIL,
        payload: error
      });
    }
  };

export const upsertInputsValuesNoNotification =
  (inputs, tramiteId, isCancel) => async dispatch => {
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER +
          '/input_values/upsert_many_empleados_no_notification',
        {
          inputs,
          tramiteId
        }
      );

      dispatch({
        type: types.TRAMITES_UPSERT_INPUTS_VALUES,
        payload: data
      });

      if (isCancel) {
        toast.success(
          <ToastContent title="Solicitud cancelada" time="Justo ahora" />
        );
      }
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.TRAMITES_FAIL,
        payload: error
      });
    }
  };

export const upsertInputsValuesNoNotificationWithData =
  (dataNoFile, tramiteId, dataFile, userTramiteId) => async dispatch => {
    try {
      for (const { files, inputNombre, tramiteId } of dataFile) {
        for (const [i, fileItem] of files.entries()) {
          const formData = new FormData();

          formData.append('inputNombre', inputNombre);
          formData.append('tramiteId', tramiteId);
          formData.append('userId', userTramiteId);
          formData.append('estado', 'approved');
          formData.append('file', fileItem);
          i === 0 && formData.append('borrarAnteriores', true);

          await axios.post(
            process.env.REACT_APP_SERVER + '/input_values/upload_file',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
        }
      }

      const { data } = await axios.post(
        process.env.REACT_APP_SERVER +
          '/input_values/upsert_many_empleados_no_notification',
        {
          inputs: dataNoFile,
          tramiteId
        }
      );

      dispatch({
        type: types.TRAMITES_UPSERT_INPUTS_VALUES,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Informacion guardada"
          body="La información se ha guardado correctamente"
        />
      );
    } catch (error) {
      dispatch({ type: types.TRAMITES_FAIL, payload: error });
      handleError(error, dispatch);
    }
  };

export const getSinAsignarPorArea = queries => async dispatch => {
  try {
    dispatch({ type: types.TRAMITES_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER +
        '/tramite/sin_asignar_por_area' +
        getQueries(queries)
    );

    dispatch({
      type: types.TRAMITES_GET_SIN_ASIGNAR_POR_AREA,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.TRAMITES_FAIL,
      payload: error
    });
  }
};

export const asignarEmpleado = (tramiteId, encargadoId) => async dispatch => {
  try {
    const { data } = await axios.put(
      process.env.REACT_APP_SERVER + '/tramite/asignar_empleado',
      {
        tramiteId,
        encargadoId
      }
    );

    dispatch({
      type: types.TRAMITES_ASIGNAR_EMPLEADO,
      payload: data
    });

    toast.success(
      <ToastContent title="Trámite asignado correctamente" time="Justo ahora" />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.TRAMITES_FAIL,
      payload: error
    });
  }
};

export const pasoAnterior = tramiteId => async dispatch => {
  try {
    const { data } = await axios.put(
      process.env.REACT_APP_SERVER + '/tramite/paso_anterior',
      {
        tramiteId
      }
    );

    dispatch({
      type: types.TRAMITES_PASO_ANTERIOR,
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
      type: types.TRAMITES_FAIL,
      payload: error
    });
  }
};

export const pasoSiguiente = tramiteId => async dispatch => {
  try {
    const { data } = await axios.put(
      process.env.REACT_APP_SERVER + '/tramite/paso_siguiente',
      {
        tramiteId
      }
    );

    dispatch({
      type: types.TRAMITES_PASO_SIGUIENTE,
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
      type: types.TRAMITES_FAIL,
      payload: error
    });
  }
};

export const tramitesCrearInforme =
  (tramiteId, tramiteUserId, titulo, comentario, files) => async dispatch => {
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/informe/crear_informe',
        {
          tramiteId,
          titulo,
          comentario
        }
      );

      for (const file of files) {
        const formData = new FormData();
        formData.append('informeId', data.id);
        formData.append('tramiteId', tramiteId);
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
        type: types.TRAMITES_CREAR_INFORME,
        payload: data
      });

      toast.success(
        <ToastContent title="Informe creado correctamente" time="Justo ahora" />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.TRAMITES_FAIL,
        payload: error
      });
    }
  };

export const tramitesUpdateInforme =
  (tramiteId, tramiteUserId, informeId, titulo, comentario, files) =>
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
        formData.append('tramiteId', tramiteId);
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
        type: types.TRAMITES_UPDATE_INFORME,
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
        type: types.TRAMITES_FAIL,
        payload: error
      });
    }
  };

export const tramitesDeleteInforme = informeId => async dispatch => {
  try {
    await axios.delete(
      process.env.REACT_APP_SERVER + '/informe/eliminar_informe/' + informeId
    );

    dispatch({
      type: types.TRAMITES_DELETE_INFORME,
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
      type: types.TRAMITES_FAIL,
      payload: error
    });
  }
};

export const tramiteCrearResolucion =
  (tramiteId, tramiteUserId, titulo, comentario, files) => async dispatch => {
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/resolucion/crear_resolucion',
        {
          tramiteId,
          titulo,
          comentario
        }
      );

      for (const file of files) {
        const formData = new FormData();
        formData.append('resolucionId', data.id);
        formData.append('tramiteId', tramiteId);
        formData.append('userId', tramiteUserId);
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
        type: types.TRAMITES_CREAR_RESOLUCION,
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
        type: types.TRAMITES_FAIL,
        payload: error
      });
    }
  };

export const tramitesUpdateResolucion =
  (tramiteId, tramiteUserId, resolucionId, titulo, comentario, files) =>
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
        formData.append('tramiteId', tramiteId);
        formData.append('userId', tramiteUserId);
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
        type: types.TRAMITES_UPDATE_RESOLUCION,
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
        type: types.TRAMITES_FAIL,
        payload: error
      });
    }
  };

export const tramitesDeleteResolucion = resolucionId => async dispatch => {
  try {
    await axios.delete(
      process.env.REACT_APP_SERVER +
        '/resolucion/eliminar_resolucion/' +
        resolucionId
    );

    dispatch({
      type: types.TRAMITES_DELETE_INFORME,
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
      type: types.TRAMITES_FAIL,
      payload: error
    });
  }
};

export const tramitesCrearDictamen =
  (tramiteId, tramiteUserId, titulo, comentario, files) => async dispatch => {
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/dictamen/create',
        {
          titulo,
          comentario,
          tramiteId
        }
      );

      for (const file of files) {
        const formData = new FormData();
        formData.append('dictamenId', data.id);
        formData.append('tramiteId', tramiteId);
        formData.append('userId', tramiteUserId);
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
        type: types.TRAMITES_CREAR_DICTAMEN,
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
        type: types.TRAMITES_FAIL,
        payload: error
      });
    }
  };

export const tramitesUpdateDictamen =
  (tramiteId, tramiteUserId, dictamenId, titulo, descripcion, files) =>
  async dispatch => {
    try {
      const { data } = await axios.put(
        process.env.REACT_APP_SERVER + '/dictamen/update/' + dictamenId,
        {
          titulo,
          descripcion
        }
      );

      for (const file of files) {
        const formData = new FormData();
        formData.append('dictamenId', data.id);
        formData.append('tramiteId', tramiteId);
        formData.append('userId', tramiteUserId);
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
        type: types.TRAMITES_UPDATE_DICTAMEN,
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
        type: types.TRAMITES_FAIL,
        payload: error
      });
    }
  };

export const tramitesDeleteDictamen = dictamenId => async dispatch => {
  try {
    await axios.delete(
      process.env.REACT_APP_SERVER + '/dictamen/delete/' + dictamenId
    );

    dispatch({
      type: types.TRAMITES_DELETE_DICTAMEN,
      payload: dictamenId
    });

    toast.success(
      <ToastContent
        title="Dictamen eliminado correctamente"
        time="Justo ahora"
      />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.TRAMITES_FAIL,
      payload: error
    });
  }
};

export const tramitesAprobarPorArea = tramiteId => async dispatch => {
  try {
    const { data } = await axios.put(
      process.env.REACT_APP_SERVER + '/tramite/aprobar_por_area',
      {
        tramiteId
      }
    );

    dispatch({
      type: types.TRAMITES_APROBAR_POR_AREA,
      payload: data
    });

    toast.success(
      <ToastContent title="Trámite aprobado correctamente" time="Justo ahora" />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.TRAMITES_FAIL,
      payload: error
    });
  }
};

export const tramitesRechazarPorArea = tramiteId => async dispatch => {
  try {
    const { data } = await axios.put(
      process.env.REACT_APP_SERVER + '/tramite/rechazar_por_area',
      {
        tramiteId
      }
    );

    dispatch({
      type: types.TRAMITES_RECHAZAR_POR_AREA,
      payload: data
    });

    toast.success(
      <ToastContent
        title="Trámite rechazado correctamente"
        time="Justo ahora"
      />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.TRAMITES_FAIL,
      payload: error
    });
  }
};

export const tramiteSolicitarModificacionPorArea =
  tramiteId => async dispatch => {
    try {
      const { data } = await axios.put(
        process.env.REACT_APP_SERVER +
          '/tramite/solicitar_modificacion_por_area',
        {
          tramiteId
        }
      );

      dispatch({
        type: types.TRAMITES_SOLICITAR_MODIFICACION_POR_AREA,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Solicitud envíada correctamente"
          time="Justo ahora"
        />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.TRAMITES_FAIL,
        payload: error
      });
    }
  };

export const rechazarTramite = tramiteId => async dispatch => {
  try {
    const { data } = await axios.put(
      process.env.REACT_APP_SERVER + '/tramite/rechazar_tramite',
      {
        tramiteId
      }
    );

    dispatch({
      type: types.TRAMITES_RECHAZAR_TRAMITE,
      payload: data
    });

    toast.success(
      <ToastContent
        title="Trámite rechazado correctamente"
        time="Justo ahora"
      />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.TRAMITES_FAIL,
      payload: error
    });
  }
};

export const deleteDocument = id => async dispatch => {
  try {
    await axios.delete(
      process.env.REACT_APP_SERVER + '/documento/delete/' + id
    );

    toast.success(
      <ToastContent
        title="Documento eliminado"
        body="El documento se ha eliminado correctamente"
      />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({ type: types.TRAMITES_FAIL, payload: error });
  }
};

export const tramitesCrearNota = (tramiteId, descripcion) => async dispatch => {
  try {
    const { data } = await axios.post(
      process.env.REACT_APP_SERVER + '/nota_interna/create',
      {
        tramiteId,
        descripcion
      }
    );

    dispatch({
      type: types.TRAMITES_CREAR_NOTA,
      payload: data
    });

    toast.success(
      <ToastContent title="Nota creada correctamente" time="Justo ahora" />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.TRAMITES_FAIL,
      payload: error
    });
  }
};

export const tramitesEliminarNota = notaId => async dispatch => {
  try {
    await axios.delete(
      process.env.REACT_APP_SERVER + '/nota_interna/delete/' + notaId
    );

    dispatch({
      type: types.TRAMITES_DELETE_NOTA,
      payload: notaId
    });

    toast.success(
      <ToastContent title="Nota eliminada correctamente" time="Justo ahora" />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.TRAMITES_FAIL,
      payload: error
    });
  }
};

export const tramitesCrearIntimacion =
  (tramiteId, tramiteUserId, titulo, comentario, files) => async dispatch => {
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/intimacion/crear',
        {
          titulo,
          comentario,
          tramiteId
        }
      );

      for (const file of files) {
        const formData = new FormData();
        formData.append('intimacionId', data.id);
        formData.append('tramiteId', tramiteId);
        formData.append('userId', tramiteUserId);
        formData.append('file', file);

        await axios.post(
          process.env.REACT_APP_SERVER + '/intimacion/upload_file',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      dispatch({
        type: types.TRAMITES_CREAR_INTIMACION,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Intimacion creada correctamente"
          time="Justo ahora"
        />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.TRAMITES_FAIL,
        payload: error
      });
    }
  };

export const tramitesEditarIntimacion =
  (tramiteId, tramiteUserId, intimacionId, titulo, comentario, files) =>
  async dispatch => {
    try {
      const { data } = await axios.put(
        process.env.REACT_APP_SERVER + '/intimacion/editar',
        {
          titulo,
          comentario,
          intimacionId
        }
      );

      for (const file of files) {
        const formData = new FormData();
        formData.append('intimacionId', data.id);
        formData.append('tramiteId', tramiteId);
        formData.append('userId', tramiteUserId);
        formData.append('file', file);

        await axios.post(
          process.env.REACT_APP_SERVER + '/intimacion/upload_file',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      dispatch({
        type: types.TRAMITES_UPDATE_INTIMACION,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Intimacion actualizada correctamente"
          time="Justo ahora"
        />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.TRAMITES_FAIL,
        payload: error
      });
    }
  };

export const tramitesDeleteIntimacion = intimacionId => async dispatch => {
  try {
    await axios.delete(
      process.env.REACT_APP_SERVER + '/intimacion/eliminar/' + intimacionId
    );

    dispatch({
      type: types.TRAMITES_DELETE_INTIMACION,
      payload: intimacionId
    });

    toast.success(
      <ToastContent
        title="Intimación eliminada correctamente"
        time="Justo ahora"
      />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.TRAMITES_FAIL,
      payload: error
    });
  }
};

export const tramiteCrearArchivo =
  (titulo, file, tramiteId, tramiteUserId) => async dispatch => {
    try {
      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('tramiteId', tramiteId);
      formData.append('userId', tramiteUserId);
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
        type: types.TRAMITES_CREAR_ARCHIVO,
        payload: data
      });
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.TRAMITES_FAIL,
        payload: error
      });
    }
  };

export const tramiteEliminarArchivo = archivoId => async dispatch => {
  try {
    await axios.delete(
      process.env.REACT_APP_SERVER + '/archivo/delete/' + archivoId
    );

    dispatch({
      type: types.TRAMITES_DELETE_ARCHIVO,
      payload: archivoId
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.TRAMITES_FAIL,
      payload: error
    });
  }
};

export const tramiteGetRelations = tramiteId => async dispatch => {
  try {
    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/tramite/buscar_familia/' + tramiteId
    );

    dispatch({
      type: types.TRAMITE_GET_RELATIONS,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.TRAMITES_FAIL,
      payload: error
    });
  }
};

export const tramiteCrearCedula =
  (titulo, motivo, tramiteUsuarioId, tramiteId, pasoCreacion, tipo, files) =>
  async dispatch => {
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/cedula/create',
        {
          titulo,
          motivo,
          usuarioId: tramiteUsuarioId,
          tramiteId,
          pasoCreacion,
          tipo
        }
      );

      for (const file of files) {
        const formData = new FormData();
        formData.append('cedulaId', data.id);
        formData.append('userId', tramiteUsuarioId);
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
        type: types.TRAMITE_CREAR_CEDULA,
        payload: data
      });

      toast.success(
        <ToastContent title="Cédula creada correctamente" time="Justo ahora" />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.TRAMITES_FAIL,
        payload: error
      });
    }
  };

export const tramiteCreate =
  ({ tipoId, userId, empleadoId }, navigate) =>
  async dispatch => {
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/tramite/create',
        {
          tipoId,
          userId,
          empleadoId
        }
      );

      dispatch({
        type: types.TRAMITES_CREATE,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Trámite creado"
          body="El trámite se ha creado correctamente"
        />
      );

      navigate('/tramites/' + data.id);
    } catch (error) {
      console.log(error);
      dispatch({ type: types.TRAMITES_FAIL, payload: error });
      handleError(error, dispatch);
    }
  };

export const tramiteCreateNoUser =
  ({ tipoId, empleadoId }, navigate) =>
  async dispatch => {
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/tramite/create_sin_usuario',
        {
          tipoId,
          empleadoId
        }
      );

      dispatch({
        type: types.TRAMITES_CREATE,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Trámite creado"
          body="El trámite se ha creado correctamente"
        />
      );

      navigate('/tramites/' + data.id);
    } catch (error) {
      console.log(error);
      dispatch({ type: types.TRAMITES_FAIL, payload: error });
      handleError(error, dispatch);
    }
  };

export const tramiteCancelar = tramiteId => async dispatch => {
  try {
    const { data } = await axios.put(
      process.env.REACT_APP_SERVER + '/tramite/cancelar_tramite',
      {
        tramiteId
      }
    );

    dispatch({
      type: types.TRAMITES_CANCELAR,
      payload: data
    });

    toast.success(
      <ToastContent
        title="Tramite cancelado"
        body="El tramite se ha cancelado correctamente"
      />
    );
  } catch (error) {
    dispatch({ type: types.TRAMITES_FAIL, payload: error });
    handleError(error, dispatch);
  }
};

export const tramiteGotoPaso = (tramiteId, pasoId) => async dispatch => {
  try {
    const { data } = await axios.put(
      process.env.REACT_APP_SERVER + '/tramite/goto_paso',
      {
        tramiteId,
        pasoId
      }
    );

    dispatch({
      type: types.TRAMITES_GOTO_PASO,
      payload: data
    });

    toast.success(<ToastContent title="Trámite actualizado" />);
  } catch (error) {
    dispatch({ type: types.TRAMITES_FAIL, payload: error });
    handleError(error, dispatch);
  }
};
