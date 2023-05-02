import axios from 'axios';
import { ToastContent } from 'components/common/Toast';
import { toast } from 'react-toastify';
import React from 'react';
import handleError from 'utils/errorHandler';
import * as types from './types';
import { getQueries } from 'utils/getQueries';

export const saGetAreas = () => async dispatch => {
  try {
    dispatch({ type: types.SA_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/area/get_all'
    );

    dispatch({
      type: types.SA_GET_AREAS,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.SA_FAIL,
      payload: error
    });
  }
};

export const saGetRoles = () => async dispatch => {
  try {
    dispatch({ type: types.SA_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/rol_permiso/get_all_roles'
    );

    dispatch({
      type: types.SA_GET_ROLES,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.SA_FAIL,
      payload: error
    });
  }
};

export const saCreateRol = (nombre, permisos) => async dispatch => {
  try {
    dispatch({ type: types.SA_REQUEST });

    await axios.post(process.env.REACT_APP_SERVER + '/rol_permiso/create_rol', {
      nombre,
      permisos
    });

    toast.success(
      <ToastContent
        title="Rol creado"
        content="Se ha creado el rol correctamente"
      />
    );

    dispatch({
      type: types.SA_CREATE_ROL
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.SA_FAIL,
      payload: error
    });
  }
};

export const saUpdateRol = (id, nombre, permisos) => async dispatch => {
  try {
    dispatch({ type: types.SA_REQUEST });

    await axios.put(
      process.env.REACT_APP_SERVER + '/rol_permiso/update_rol/' + id,
      {
        nombre,
        permisos
      }
    );

    toast.success(
      <ToastContent
        title="Rol actualizado"
        content="Se ha actualizado el rol correctamente"
      />
    );

    dispatch({
      type: types.SA_UPDATE_ROL
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.SA_FAIL,
      payload: error
    });
  }
};

export const saDeleteRol = id => async dispatch => {
  try {
    dispatch({ type: types.SA_REQUEST });

    await axios.delete(
      process.env.REACT_APP_SERVER + '/rol_permiso/delete_rol/' + id
    );

    toast.success(
      <ToastContent
        title="Rol eliminado"
        content="Se ha eliminado el rol correctamente"
      />
    );

    dispatch({
      type: types.SA_DELETE_ROL
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.SA_FAIL,
      payload: error
    });
  }
};

export const saGetPermissions = () => async dispatch => {
  try {
    dispatch({ type: types.SA_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/rol_permiso/get_all_permisos'
    );

    dispatch({
      type: types.SA_GET_PERMISSIONS,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.SA_FAIL,
      payload: error
    });
  }
};

export const saGetEmpleados = queries => async dispatch => {
  try {
    dispatch({ type: types.SA_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/empleado/get_all' + getQueries(queries)
    );

    dispatch({
      type: types.SA_GET_EMPLEADOS,
      payload: data
    });

    dispatch({
      type: types.SA_GET_EMPLEADOS,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.SA_FAIL,
      payload: error
    });
  }
};

export const saCreateEmpleado =
  (nombre, apellido, dni, email, constrasenia, rolId, areaId) =>
  async dispatch => {
    try {
      dispatch({ type: types.SA_REQUEST });

      await axios.post(process.env.REACT_APP_SERVER + '/empleado/create', {
        nombre,
        apellido,
        dni,
        email,
        constrasenia,
        rolId,
        areaId
      });

      toast.success(
        <ToastContent
          title="Empleado creado"
          content="Se ha creado el empleado correctamente"
        />
      );

      dispatch({
        type: types.SA_CREATE_EMPLEADO
      });
    } catch (error) {
      handleError(error, dispatch);
      dispatch({
        type: types.SA_FAIL,
        payload: error
      });
    }
  };

export const saDeleteEmpleado = id => async dispatch => {
  try {
    dispatch({ type: types.SA_REQUEST });

    await axios.delete(process.env.REACT_APP_SERVER + '/empleado/delete/' + id);

    toast.success(
      <ToastContent
        title="Empleado eliminado"
        content="Se ha eliminado el empleado correctamente"
      />
    );

    dispatch({
      type: types.SA_DELETE_EMPLEADO
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.SA_FAIL,
      payload: error
    });
  }
};

export const saGetAllTramites = queries => async dispatch => {
  try {
    dispatch({ type: types.SA_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER + '/tramite/get_all' + getQueries(queries)
    );

    dispatch({
      type: types.SA_GET_ALL_TRAMITES,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.SA_FAIL,
      payload: error
    });
  }
};

export const saGetTramitesByArea = (areaId, queries) => async dispatch => {
  try {
    dispatch({ type: types.SA_REQUEST });

    const { data } = await axios.get(
      process.env.REACT_APP_SERVER +
        '/tramite/by_area_sa/' +
        areaId +
        getQueries(queries)
    );

    dispatch({
      type: types.SA_GET_ALL_TRAMITES,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.SA_FAIL,
      payload: error
    });
  }
};

export const getConfig = () => async dispatch => {
  try {
    dispatch({ type: types.SA_REQUEST });

    const { data } = await axios.get(process.env.REACT_APP_SERVER + '/config/');

    dispatch({
      type: types.SA_GET_CONFIGURATION,
      payload: data
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.SA_FAIL,
      payload: error
    });
  }
};

export const updateConfig = config => async dispatch => {
  try {
    dispatch({ type: types.SA_REQUEST });

    await axios.put(process.env.REACT_APP_SERVER + '/config/update', {
      config
    });

    toast.success(
      <ToastContent
        title="Configuración actualizada"
        content="Se ha actualizado la configuración correctamente"
      />
    );

    dispatch({
      type: types.SA_UPDATE_CONFIGURATION
    });
  } catch (error) {
    handleError(error, dispatch);
    dispatch({
      type: types.SA_FAIL,
      payload: error
    });
  }
};
