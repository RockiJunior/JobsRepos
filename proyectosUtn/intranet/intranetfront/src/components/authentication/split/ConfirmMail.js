import React from 'react';
import ConfirmMailContent from 'components/authentication/ConfirmMailContent';
import { useParams } from 'react-router-dom';
import bgImg from 'assets/img/cucicba/bg.jpg';
import AuthSplitLayout from 'layouts/AuthSplitLayout';

const ConfirmMail = () => {
  const { email } = useParams();

  return (
    <AuthSplitLayout bgProps={{ image: bgImg, position: '50% 30%' }}>
      <div className="text-center">
        <ConfirmMailContent email={email} />
      </div>
    </AuthSplitLayout>
  );
};

export default ConfirmMail;
