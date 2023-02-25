import React from 'react';
import AuthSplitLayout from 'layouts/AuthSplitLayout';
import bgImg from 'assets/img/generic/14.jpg';
import Flex from 'components/common/Flex';
import LoginFormAdmin from '../LoginFormAdmin';

const LoginAdmin = () => {
  return (
    <AuthSplitLayout bgProps={{ image: bgImg, position: '50% 20%' }}>
      <Flex alignItems="center" justifyContent="between">
        <h3>Ingresar como administrador</h3>
      </Flex>
      <LoginFormAdmin layout="split" hasLabel />
    </AuthSplitLayout>
  );
};

export default LoginAdmin;
