import React from 'react';
import ForgetPasswordForm from 'components/authentication/ForgetPasswordForm';

const ForgetPassword = () => {
  return (
    <div className="text-center">
      <h4 className="mb-0"> Olvidaste tu contraseña?</h4>
      <small>
        Ingresá tu mail y te enviaremos un link para que la restablezcas
      </small>
      <ForgetPasswordForm layout="split" />
    </div>
  );
};

export default ForgetPassword;
