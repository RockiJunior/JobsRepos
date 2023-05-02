import axios from 'axios';
import handleError from 'utils/errorHandler';
import * as types from './types';
import { getQueries } from 'utils/getQueries';
import { toast } from 'react-toastify';
import { ToastContent } from 'components/common/Toast';
import React from 'react';

export const transaccionGetById = id => async dispatch => {
  try {
    dispatch({ type: types.TRANSACCION_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/transaccion/by_id/' + id
    );

    dispatch({
      type: types.TRANSACCION_GET_BY_ID,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.TRANSACCION_FAIL,
      payload: error
    });
  }
};

export const transaccionGetAllByAdminId = (id, queries) => async dispatch => {
  try {
    dispatch({ type: types.TRANSACCION_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER +
        '/transaccion/by_empledado/' +
        id +
        getQueries(queries)
    );

    dispatch({
      type: types.TRANSACCION_GET_ALL_BY_ADMIN_ID,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.TRANSACCION_FAIL,
      payload: error
    });
  }
};

export const transaccionGetAll = queries => async dispatch => {
  try {
    dispatch({ type: types.TRANSACCION_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER +
        '/transaccion/get_all' +
        getQueries(queries)
    );

    dispatch({
      type: types.TRANSACCION_GET_ALL,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.TRANSACCION_FAIL,
      payload: error
    });
  }
};

export const aprobarRechazarTransaccion =
  (id, estado, comentario) => async dispatch => {
    try {
      dispatch({ type: types.TRANSACCION_REQUEST });

      const { data } = await axios.put(
        process.env.REACT_APP_SERVER + '/transaccion/aprobar_rechazar/' + id,
        { estado, comentario }
      );

      dispatch({
        type: types.TRANSACCION_APROBAR_RECHAZAR,
        payload: data
      });
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.TRANSACCION_FAIL,
        payload: error
      });
    }
  };

export const transaccionUploadPayment =
  (files, transaccionId, userId) => async dispatch => {
    try {
      dispatch({ type: types.TRANSACCION_REQUEST });

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

      dispatch(aprobarRechazarTransaccion(transaccionId, 'approved'));

      toast.success(
        <ToastContent
          title="Pago subido"
          body="El pago se ha subido correctamente"
        />
      );
    } catch (error) {
      dispatch({ type: types.TRANSACCION_FAIL, payload: error });
      handleError(error, dispatch);
    }
  };
