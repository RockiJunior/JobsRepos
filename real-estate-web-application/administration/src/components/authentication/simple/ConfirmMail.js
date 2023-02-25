import React from 'react';
import { useParams } from 'react-router-dom';
import ConfirmMailContent from 'components/authentication/ConfirmMailContent';

const ConfirmMail = () => {
  const { email } = useParams();

  return (
    <div className="text-center">
      <ConfirmMailContent email={email} />
    </div>
  );
};

export default ConfirmMail;
