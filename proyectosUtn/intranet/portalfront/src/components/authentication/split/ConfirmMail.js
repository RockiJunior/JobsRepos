import React from 'react';
import ConfirmMailContent from 'components/authentication/ConfirmMailContent';
import { useParams } from 'react-router-dom';

const ConfirmMail = () => {
  const { email } = useParams();

  return (
    <div className="text-center">
      <ConfirmMailContent email={email} />
    </div>
  );
};

export default ConfirmMail;
