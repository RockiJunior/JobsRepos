import React from 'react';
import { Link } from 'react-router-dom';
import Flex from 'components/common/Flex';
import RegistrationForm from 'components/authentication/RegistrationForm';
import bgImg from 'assets/img/playmatch/bg.jpg';
import AuthSplitLayout from 'layouts/AuthSplitLayout';

const Registration = () => {
  return (
    <AuthSplitLayout bgProps={{ image: bgImg }}>
      <Flex alignItems="center" justifyContent="between">
        <h3>Registrase</h3>
        <p className="mb-0 fs--1">
          Ya tiene un cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </Flex>
      <RegistrationForm layout="split" hasLabel />
    </AuthSplitLayout>
  );
};

export default Registration;
