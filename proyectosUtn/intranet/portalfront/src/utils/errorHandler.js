import { ToastContent } from 'components/common/Toast';
import React from 'react';
import { toast } from 'react-toastify';
import { logout } from 'redux/actions/auth';

const handleError = (error, dispatch) => {
  if (
    error?.response?.data?.error?.message === 'jwt expired' &&
    localStorage.getItem('token')
  ) {
    dispatch(logout());
    toast.error(
      <ToastContent title="Error" body="La sesión expiró" time="Justo ahora" />
    );
  } else if (localStorage.getItem('token')) {
    toast.error(
      <ToastContent
        title="Error"
        body={error?.response?.data?.message || 'Ocurrió un error desconocido'}
        time="Justo ahora"
      />
    );
  }
};

export default handleError;
