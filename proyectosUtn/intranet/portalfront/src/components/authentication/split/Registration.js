import React from 'react';
import { Link } from 'react-router-dom';
import Flex from 'components/common/Flex';
import RegistrationForm from 'components/authentication/RegistrationForm';

const Registration = () => {
  return (
    <>
      <Flex alignItems="center" justifyContent="between">
        <h3>Registrarse</h3>
        <p className="mb-0 fs--1">
          Ya tenés una cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </Flex>
      <RegistrationForm layout="split" hasLabel />
    </>
  );
};

export default Registration;
