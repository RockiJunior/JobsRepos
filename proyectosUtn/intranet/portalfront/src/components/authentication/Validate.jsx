import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const Validate = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [response, setResponse] = useState(null);
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    const decrypteEmail = CryptoJS.AES.decrypt(
      email
        .replaceAll('xMl3Jk', '+')
        .replaceAll('Por21Ld', '/')
        .replaceAll('Ml32', '='),
      process.env.REACT_APP_CRYPTO_SECRET
    ).toString(CryptoJS.enc.Utf8);

    axios
      .put(process.env.REACT_APP_SERVER + `/users/verify_by_email`, {
        email: decrypteEmail
      })
      .then(res => {
        setResponse(res.data);
      })
      .catch(err => {
        console.log(err);
        setResponse(err.response.data);
      });
  }, [email]);

  useEffect(() => {
    let interval;
    if (response === 'Success') {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
      setTimeout(() => navigate('/login'), 10000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [response]);

  return (
    <div>
      {response === 'Rejected' ? (
        'Ha ocurrido un error, por favor inténtelo de nuevo'
      ) : response === 'Success' ? (
        <div>
          <p className="text-center">
            Será redirigido automáticamente <br /> en {seconds} segundos...{' '}
          </p>
          <p className="text-center m-0">
            o haga click <Link to="/login">aquí</Link>
          </p>
        </div>
      ) : (
        'Verificando email'
      )}
    </div>
  );
};

Validate.propTypes = {
  admin: PropTypes.bool
};

export default Validate;
