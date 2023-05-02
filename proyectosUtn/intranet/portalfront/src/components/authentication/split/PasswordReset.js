import React from 'react';
import PasswordResetForm from 'components/authentication/PasswordResetForm';

const PasswordReset = () => {
  return (
    <>
      <div className="text-center">
        <h3>Restablecer contraseña</h3>
      </div>
      <PasswordResetForm layout="split" hasLabel />
    </>
  );
};

export default PasswordReset;
