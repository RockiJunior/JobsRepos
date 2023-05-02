import axios from 'axios';
import { ToastContent } from 'components/common/Toast';
import React from 'react';
import { toast } from 'react-toastify';
import handleError from 'utils/errorHandler';
import { expedienteGetById } from '../expediente';
import * as types from './types';

export const fiscalizacionCreate = (expedienteId, titulo) => async dispatch => {
  try {
    const { data } = await axios.post(
      process.env.REACT_APP_SERVER + '/fiscalizacion/crear_fiscalizacion',
      {
        expedienteId,
        titulo
      }
    );

    dispatch({
      type: types.FISCALIZACION_CREATE,
      payload: data
    });

    toast.success(
      <ToastContent
        title="Fiscalización creada correctamente"
        time="Justo ahora"
      />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.FISCALIZACION_FAIL,
      payload: error
    });
  }
};

export const fiscalizacionUpsertInputsValues =
  (dataNoFile, expedienteId, dataFile, userTramiteId, fiscalizacionId) =>
  async dispatch => {
    try {
      for (const { files, inputNombre } of dataFile) {
        for (const [i, fileItem] of files.entries()) {
          const formData = new FormData();

          formData.append('expedienteId', expedienteId);
          formData.append('fiscalizacionId', fiscalizacionId);
          formData.append('userId', userTramiteId);
          formData.append('inputNombre', inputNombre);
          formData.append('estado', 'approved');
          formData.append('file', fileItem);
          i === 0 && formData.append('borrarAnteriores', true);

          await axios.post(
            process.env.REACT_APP_SERVER +
              '/input_values_fiscalizacion/upload_file',
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
          '/input_values_fiscalizacion/upsert_many',
        {
          inputs: dataNoFile,
          fiscalizacionId
        }
      );

      dispatch({
        type: types.FISCALIZACION_UPSERT_INPUTS_VALUES,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Informacion guardada"
          body="La información se ha guardado correctamente"
        />
      );

      dispatch(expedienteGetById(expedienteId));
    } catch (error) {
      dispatch({ type: types.FISCALIZACION_FAIL, payload: error });
      handleError(error, dispatch);
    }
  };

export const fiscalizacionCrearCedula =
  (titulo, motivo, expedienteUsuarioId, expedienteId, tipo, files) =>
  async dispatch => {
    try {
      dispatch({ type: types.FISCALIZACION_REQUEST });

      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/cedula/create',
        {
          titulo,
          motivo,
          usuarioId: expedienteUsuarioId,
          expedienteId,
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
        type: types.FISCALIZACION_CREAR_CEDULA,
        payload: data
      });

      toast.success(
        <ToastContent title="Cédula creada correctamente" time="Justo ahora" />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.FISCALIZACION_FAIL,
        payload: error
      });
    }
  };

export const fiscalizacionCrearNota =
  (fiscalizacionId, descripcion) => async dispatch => {
    try {
      dispatch({ type: types.FISCALIZACION_REQUEST });

      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/nota_interna/create',
        {
          fiscalizacionId,
          descripcion
        }
      );

      dispatch({
        type: types.FISCALIZACION_CREAR_NOTA,
        payload: data
      });

      toast.success(
        <ToastContent title="Nota creada correctamente" time="Justo ahora" />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.FISCALIZACION_FAIL,
        payload: error
      });
    }
  };

export const fiscalizacionEliminarNota = notaId => async dispatch => {
  try {
    dispatch({ type: types.FISCALIZACION_REQUEST });

    await axios.delete(
      process.env.REACT_APP_SERVER + '/nota_interna/delete/' + notaId
    );

    dispatch({
      type: types.FISCALIZACION_DELETE_NOTA,
      payload: notaId
    });

    toast.success(
      <ToastContent title="Nota eliminada correctamente" time="Justo ahora" />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.FISCALIZACION_FAIL,
      payload: error
    });
  }
};

export const fiscalizacionCrearConstatacion =
  (
    fiscalizacionId,
    titulo,
    comentario,
    estado,
    fecha,
    archivos,
    expedienteUserId,
    expedienteId
  ) =>
  async dispatch => {
    try {
      dispatch({ type: types.FISCALIZACION_REQUEST });

      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/constatacion/crear_constatacion',
        {
          fiscalizacionId,
          titulo,
          comentario,
          estado,
          fecha
        }
      );

      for (const archivo of archivos) {
        const formData = new FormData();
        formData.append('constatacionId', data.id);
        formData.append('fiscalizacionId', fiscalizacionId);
        formData.append('expedienteId', expedienteId);
        formData.append('userId', expedienteUserId);
        formData.append('file', archivo);

        await axios.post(
          process.env.REACT_APP_SERVER + '/constatacion/upload_file',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      dispatch({
        type: types.FISCALIZACION_CREAR_CONSTATACION,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Constatación creada correctamente"
          time="Justo ahora"
        />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.FISCALIZACION_FAIL,
        payload: error
      });
    }
  };

export const fiscalizacionUpdateConstatacion =
  (
    fiscalizacionId,
    constatacionId,
    titulo,
    comentario,
    estado,
    archivos,
    expedienteUserId,
    expedienteId
  ) =>
  async dispatch => {
    try {
      dispatch({ type: types.FISCALIZACION_REQUEST });

      const { data } = await axios.put(
        process.env.REACT_APP_SERVER + '/constatacion/editar_constatacion',
        {
          constatacionId,
          titulo,
          comentario,
          estado
        }
      );

      for (const archivo of archivos) {
        const formData = new FormData();
        formData.append('constatacionId', constatacionId);
        formData.append('fiscalizacionId', fiscalizacionId);
        formData.append('userId', expedienteUserId);
        formData.append('expedienteId', expedienteId);
        formData.append('file', archivo);

        await axios.post(
          process.env.REACT_APP_SERVER + '/constatacion/upload_file',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      dispatch({
        type: types.FISCALIZACION_UPDATE_CONSTATACION,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Constatación actualizada correctamente"
          time="Justo ahora"
        />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.FISCALIZACION_FAIL,
        payload: error
      });
    }
  };

export const fiscalizacionEliminarConstatacion =
  constatacionId => async dispatch => {
    try {
      dispatch({ type: types.FISCALIZACION_REQUEST });

      await axios.delete(
        process.env.REACT_APP_SERVER +
          '/constatacion/eliminar_constatacion/' +
          constatacionId
      );

      dispatch({
        type: types.FISCALIZACION_DELETE_CONSTATACION,
        payload: constatacionId
      });

      toast.success(
        <ToastContent
          title="Constatación eliminada correctamente"
          time="Justo ahora"
        />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.FISCALIZACION_FAIL,
        payload: error
      });
    }
  };

export const fiscalizacionCrearCobro = fiscalizacionId => async dispatch => {
  try {
    dispatch({ type: types.FISCALIZACION_REQUEST });

    const { data } = await axios.post(
      process.env.REACT_APP_SERVER + '/cobro_fiscalizacion/create',
      {
        fiscalizacionId
      }
    );

    dispatch({
      type: types.FISCALIZACION_CREAR_COBRO,
      payload: data
    });

    toast.success(<ToastContent title="Cobro creado" time="Justo ahora" />);
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.FISCALIZACION_FAIL,
      payload: error
    });
  }
};

export const fiscalizacionUpdateCobro =
  (cobroId, conceptos) => async dispatch => {
    try {
      dispatch({ type: types.FISCALIZACION_REQUEST });

      const { data } = await axios.put(
        process.env.REACT_APP_SERVER + '/cobro_fiscalizacion/update/' + cobroId,
        {
          conceptos
        }
      );

      dispatch({
        type: types.FISCALIZACION_UPDATE_COBRO,
        payload: data
      });

      toast.success(
        <ToastContent title="Cobro actualizado" time="Justo ahora" />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.FISCALIZACION_FAIL,
        payload: error
      });
    }
  };

export const fiscalizacionEliminarCobro = cobroId => async dispatch => {
  try {
    dispatch({ type: types.FISCALIZACION_REQUEST });

    await axios.delete(
      process.env.REACT_APP_SERVER + '/cobro_fiscalizacion/delete/' + cobroId
    );

    dispatch({
      type: types.FISCALIZACION_DELETE_COBRO,
      payload: cobroId
    });

    toast.success(<ToastContent title="Cobro eliminado" time="Justo ahora" />);
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.FISCALIZACION_FAIL,
      payload: error
    });
  }
};

export const fiscalizacionGetConceptos = () => async dispatch => {
  try {
    dispatch({ type: types.FISCALIZACION_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/transaccion/get_conceptos_fiscalizacion'
    );

    dispatch({
      type: types.FISCALIZACION_GET_CONCEPTOS,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.FISCALIZACION_FAIL,
      payload: error
    });
  }
};

export const fiscalizacionGenerarTransaccion =
  (fiscalizacionId, conceptosId, conceptoInfraccionNoMatriculadoId) =>
  async dispatch => {
    try {
      dispatch({ type: types.FISCALIZACION_REQUEST });

      const { data } = await axios.post(
        process.env.REACT_APP_SERVER +
          '/transaccion/crear_transaccion_fiscalizacion',
        {
          fiscalizacionId,
          conceptosId,
          conceptoInfraccionNoMatriculadoId
        }
      );

      dispatch({
        type: types.FISCALIZACION_CREAR_TRANSACCION,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Transacción generada correctamente"
          time="Justo ahora"
        />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.FISCALIZACION_FAIL,
        payload: error
      });
    }
  };

export const fiscalizacionEliminarTransaccion = id => async dispatch => {
  try {
    dispatch({ type: types.FISCALIZACION_REQUEST });

    await axios.delete(
      process.env.REACT_APP_SERVER + '/transaccion/delete/' + id
    );

    dispatch({
      type: types.FISCALIZACION_DELETE_TRANSACCION,
      payload: id
    });

    toast.success(
      <ToastContent title="Transacción cencelada" time="Justo ahora" />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.FISCALIZACION_FAIL,
      payload: error
    });
  }
};

export const fiscalizacionCancelar = id => async dispatch => {
  try {
    dispatch({ type: types.FISCALIZACION_REQUEST });

    await axios.put(
      process.env.REACT_APP_SERVER + '/fiscalizacion/cancelar/' + id
    );

    dispatch({
      type: types.FISCALIZACION_CANCELAR,
      payload: id
    });

    toast.success(
      <ToastContent title="Fiscalización cancelada" time="Justo ahora" />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.FISCALIZACION_FAIL,
      payload: error
    });
  }
};

export const fiscalizacionFinalizar = (id, tipo) => async dispatch => {
  try {
    dispatch({ type: types.FISCALIZACION_REQUEST });

    await axios.put(
      process.env.REACT_APP_SERVER + '/fiscalizacion/finalizar/' + id,
      { tipo }
    );

    dispatch({
      type: types.FISCALIZACION_FINALIZAR,
      payload: id
    });

    toast.success(
      <ToastContent title="Fiscalización finalizada" time="Justo ahora" />
    );
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.FISCALIZACION_FAIL,
      payload: error
    });
  }
};

export const fiscalizacionCrearInforme =
  (
    fiscalizacionId,
    expedienteUserId,
    expedienteId,
    titulo,
    comentario,
    files
  ) =>
  async dispatch => {
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER +
          '/informe_fiscalizacion/crear_informe_fiscalizacion',
        {
          fiscalizacionId,
          titulo,
          comentario
        }
      );

      for (const file of files) {
        const formData = new FormData();
        formData.append('informeFiscalizacionId', data.id);
        formData.append('expedienteId', expedienteId);
        formData.append('fiscalizacionId', fiscalizacionId);
        formData.append('userId', expedienteUserId);
        formData.append('file', file);

        await axios.post(
          process.env.REACT_APP_SERVER + '/informe_fiscalizacion/upload_file',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      dispatch({
        type: types.FISCALIZACION_CREAR_INFORME,
        payload: data
      });

      toast.success(
        <ToastContent title="Informe creado correctamente" time="Justo ahora" />
      );
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.FISCALIZACION_FAIL,
        payload: error
      });
    }
  };
