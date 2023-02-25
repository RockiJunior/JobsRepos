import React from 'react';
import bgImg from 'assets/img/generic/14.jpg';
import AuthSplitLayout from 'layouts/AuthSplitLayout';
import ForgetPasswordForm from '../ForgetPasswordForm';

const ForgetPassword = () => {
  return (
    <AuthSplitLayout
      bgProps={{ image: bgImg, position: '50% 76%', overlay: true }}
    >
      <div className="text-center">
        <h4 className="mb-0"> Olvidaste tu contraseña?</h4>
        <small>
          Ingresá tu mail y te enviaremos un link para que la restablezcas
        </small>
        <ForgetPasswordForm layout="split" />
      </div>
    </AuthSplitLayout>
  );
};

export default ForgetPassword;
