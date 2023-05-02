import axios from 'axios';
import React from 'react';
import * as types from './types';
import handleError from 'utils/errorHandler';
import { toast } from 'react-toastify';
import { ToastContent } from 'components/common/Toast';
import { getQueries } from 'utils/getQueries';

export const tramiteCreate =
  ({ tipoId, userId }, navigate) =>
  async dispatch => {
    try {
      dispatch({ type: types.TRAMITES_REQUEST });

      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/tramite/create',
        {
          tipoId,
          userId
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
      dispatch({ type: types.TRAMITES_FAIL, payload: error });
      handleError(error, dispatch);
    }
  };

export const tramiteGetById = id => async dispatch => {
  try {
    dispatch({ type: types.TRAMITES_REQUEST });
    dispatch({ type: types.TRAMITES_RESET });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/tramite/by_id/' + id
    );

    dispatch({
      type: types.TRAMITES_GET_BY_ID,
      payload: data
    });
  } catch (error) {
    dispatch({ type: types.TRAMITES_FAIL, payload: error });
    handleError(error, dispatch);
  }
};

export const tramiteGetByUserId = (id, queries) => async dispatch => {
  try {
    dispatch({ type: types.TRAMITES_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER +
        '/tramite/by_user_id/' +
        id +
        getQueries(queries)
    );

    dispatch({
      type: types.TRAMITES_GET_BY_USER_ID,
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
  (dataNoFile, tramiteId, dataFile, usuarioId, tituloSeccion) =>
  async dispatch => {
    try {
      dispatch({ type: types.TRAMITES_REQUEST });

      for (const {
        files,
        inputNombre,
        userId,
        tramiteId,
        inputName
      } of dataFile) {
        for (const [i, fileItem] of files.entries()) {
          const formData = new FormData();

          formData.append('inputNombre', inputNombre);
          formData.append('tramiteId', tramiteId);
          formData.append('userId', userId);
          formData.append('inputName', inputName);
          formData.append('estado', 'sent');
          i === 0 && formData.append('borrarAnteriores', true);
          formData.append('file', fileItem);

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
        process.env.REACT_APP_SERVER + '/input_values/upsert_many',
        {
          inputs: dataNoFile,
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
          title="Informacion guardada"
          body="La información se ha guardado correctamente"
        />
      );
    } catch (error) {
      dispatch({ type: types.TRAMITES_FAIL, payload: error });
      handleError(error, dispatch);
    }
  };

export const upsertInputsValuesExternal =
  (dataNoFile, tramiteId, dataFile, tituloSeccion) => async dispatch => {
    try {
      dispatch({ type: types.TRAMITES_REQUEST });

      for (const { files, inputNombre, tramiteId, inputName } of dataFile) {
        for (const [i, fileItem] of files.entries()) {
          const formData = new FormData();

          formData.append('inputNombre', inputNombre);
          formData.append('tramiteId', tramiteId);
          formData.append('userId', 'cucicba');
          formData.append('inputName', inputName);
          formData.append('estado', 'sent');
          i === 0 && formData.append('borrarAnteriores', true);
          formData.append('file', fileItem);

          await axios.post(
            process.env.REACT_APP_SERVER + '/input_values/upload_file_externo',
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
        process.env.REACT_APP_SERVER + '/input_values/upsert_many_externos',
        {
          inputs: dataNoFile,
          tramiteId,
          tituloSeccion
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

export const checkLastProcedureState =
  (userId, tipoTramiteId) => async dispatch => {
    try {
      dispatch({ type: types.TRAMITES_REQUEST });

      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/tramite/by_user_tipo',
        {
          userId,
          tipoTramiteId
        }
      );

      dispatch({
        type: types.TRAMITES_CHECK_LAST_PROCEDURE,
        payload: data
      });
    } catch (error) {
      dispatch({ type: types.TRAMITES_FAIL, payload: error });
      handleError(error, dispatch);
    }
  };

export const elegirCuotas =
  (transaccionId, opcionCuotasId) => async dispatch => {
    try {
      dispatch({ type: types.TRAMITES_REQUEST });

      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/transaccion/elegir_cuotas',
        {
          transaccionId,
          opcionCuotasId
        }
      );

      dispatch({
        type: types.TRAMITES_ELEGIR_CUOTAS,
        payload: data
      });
    } catch (error) {
      dispatch({ type: types.TRAMITES_FAIL, payload: error });
      handleError(error, dispatch);
    }
  };

export const uploadPayment =
  (files, transaccionId, userId) => async dispatch => {
    try {
      dispatch({ type: types.TRAMITES_REQUEST });

      for (const file of files) {
        const formData = new FormData();
        formData.append('transaccionId', transaccionId);
        formData.append('userId', userId);
        formData.append('file', file);

        await axios.post(
          process.env.REACT_APP_SERVER + '/transaccion/upload_file',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      toast.success(
        <ToastContent
          title="Pago subido"
          body="El pago se ha subido correctamente"
        />
      );
    } catch (error) {
      dispatch({ type: types.TRAMITES_FAIL, payload: error });
      handleError(error, dispatch);
    }
  };

export const deleteDocument = id => async dispatch => {
  try {
    dispatch({ type: types.TRAMITES_REQUEST });

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

export const tramiteGetTiposdeTramite = () => async dispatch => {
  try {
    dispatch({ type: types.TRAMITES_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/tipo_tramite/get_all_usuario'
    );

    dispatch({
      type: types.TRAMITES_GET_TIPOS_TRAMITE,
      payload: data
    });
  } catch (error) {
    dispatch({ type: types.TRAMITES_FAIL, payload: error });
    handleError(error, dispatch);
  }
};

export const tramiteCancelar = tramiteId => async dispatch => {
  try {
    dispatch({ type: types.TRAMITES_REQUEST });

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

export const tipoTramiteGetById = id => async dispatch => {
  try {
    dispatch({ type: types.TRAMITES_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/tipo_tramite/get_by_id_externo/' + id
    );

    dispatch({
      type: types.TIPOTRAMITE_GET_BY_ID_EXTERNO,
      payload: data
    });
  } catch (error) {
    dispatch({ type: types.TRAMITES_FAIL, payload: error });
    handleError(error, dispatch);
  }
};

export const tramiteCrearExterno =
  (tipoId, dataNofile, dataFile) => async dispatch => {
    try {
      dispatch({ type: types.TRAMITES_REQUEST });

      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + '/tramite/crear_externo',
        {
          tipoId,
          inputs: dataNofile
        }
      );

      for (const { files, inputNombre, inputName } of dataFile) {
        for (const [i, fileItem] of files.entries()) {
          const formData = new FormData();

          formData.append('inputNombre', inputNombre);
          formData.append('tramiteId', data.id);
          formData.append('userId', 'cucicba');
          formData.append('inputName', inputName);
          formData.append('estado', 'sent');
          i === 0 && formData.append('borrarAnteriores', true);
          formData.append('file', fileItem);

          await axios.post(
            process.env.REACT_APP_SERVER + '/input_values/upload_file_externo',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
        }
      }

      dispatch({
        type: types.TRAMITES_CREAR_EXTERNO,
        payload: data
      });

      toast.success(
        <ToastContent
          title="Tramite creado"
          body="El tramite se ha creado correctamente"
        />
      );
    } catch (error) {
      dispatch({ type: types.TRAMITES_FAIL, payload: error });
      handleError(error, dispatch);
    }
  };

export const getTramiteExterno = id => async dispatch => {
  try {
    dispatch({ type: types.TRAMITES_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/tramite/get_externo/' + id
    );

    dispatch({
      type: types.TRAMITES_GET_EXTERNO,
      payload: data
    });
  } catch (error) {
    dispatch({ type: types.TRAMITES_FAIL, payload: error });
    handleError(error, dispatch);
  }
};

export const getMatriculados = queries => async dispatch => {
  try {
    dispatch({ type: types.TRAMITES_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER +
        '/users/get_matriculados' +
        getQueries(queries)
    );

    dispatch({
      type: types.TRAMITE_GET_MATRICULADOS,
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
