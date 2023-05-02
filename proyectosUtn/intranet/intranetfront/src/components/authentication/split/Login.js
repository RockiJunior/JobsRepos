import React from 'react';
import LoginForm from 'components/authentication/LoginForm';
import Flex from 'components/common/Flex';

const Login = () => {
  return (
    <>
      <Flex alignItems="center" justifyContent="between">
        <h3>Iniciar sesión</h3>
      </Flex>
      <LoginForm layout="split" hasLabel />
    </>
  );
};

export default Login;
