import React from 'react';
import AuthSplitLayout from 'layouts/AuthSplitLayout';
import bgImg from 'assets/img/generic/14.jpg';
import Flex from 'components/common/Flex';
import LoginFormCollab from 'components/authentication/LoginFormCollab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const LoginInmobiliario = () => {
  return (
    <AuthSplitLayout bgProps={{ image: bgImg, position: '50% 20%' }}>
      <Flex alignItems="center" justifyContent="start" className='mb-4'>
        <FontAwesomeIcon icon={faLock} className='me-2'/>
        <h4 className='m-0'>Ingresar al panel</h4>
      </Flex>
      <LoginFormCollab layout="split" hasLabel />
    </AuthSplitLayout>
  );
};

export default LoginInmobiliario;
