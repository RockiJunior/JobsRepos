import dayjs from 'dayjs';
import React from 'react';
import useQuery from 'utils/useQuery';
import CryptoJS from 'crypto-js';

const QR = () => {
  const query = useQuery();
  const matriculaId = query.get('m');
  const userId = query.get('u');

  const decrypteUserId = CryptoJS.AES.decrypt(
    userId
      .replaceAll('xMl3Jk', '+')
      .replaceAll('Por21Ld', '/')
      .replaceAll('Ml32', '='),
    process.env.REACT_APP_CRYPTO_SECRET
  ).toString(CryptoJS.enc.Utf8);

  const decrypteMatriculaId = CryptoJS.AES.decrypt(
    matriculaId
      .replaceAll('xMl3Jk', '+')
      .replaceAll('Por21Ld', '/')
      .replaceAll('Ml32', '='),
    process.env.REACT_APP_CRYPTO_SECRET
  ).toString(CryptoJS.enc.Utf8);

  return (
    <div className="d-flex justify-content-center">
      <img
        style={{ maxHeight: '80vh' }}
        src={
          process.env.REACT_APP_SERVER.replace('/api', '') +
          '/public/archivos/' +
          decrypteUserId +
          '/oblea/' +
          decrypteMatriculaId +
          '/' +
          'oblea-' +
          dayjs().format('YYYY') +
          '.png'
        }
        alt="qr"
      />
    </div>
  );
};

export default QR;
