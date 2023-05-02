import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const Validate = ({ admin }) => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [response, setResponse] = useState(null);
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    if (admin) {
      axios
        .post(`${process.env.REACT_APP_SERVER}/admin/verifyAdmin`, {
          email: atob(email)
        })
        .then(res => setResponse(res.data))
        .catch(err => setResponse(err.response.data));
    } else {
      axios
        .post(`${process.env.REACT_APP_SERVER}/user/verifyUser`, {
          email
        })
        .then(res => setResponse(res.data))
        .catch(err => setResponse(err.response.data));
    }
  }, [email]);

  useEffect(() => {
    if (admin) {
      let interval;
      if (response === 'success') {
        interval = setInterval(() => {
          setSeconds(seconds => seconds - 1);
        }, 1000);
        setTimeout(() => navigate('/admin'), 10000);
      }
      return () => {
        clearInterval(interval);
      };
    }
  }, [response]);

  return (
    <div>
      {response === 'rejected' ? (
        'Ha ocurrido un error, por favor inténtelo de nuevo'
      ) : response === 'success' ? (
        admin ? (
          <div>
            <p className="text-center">
              Será redirigido automáticamente <br /> en {seconds} segundos...{' '}
            </p>
            <p className="text-center m-0">
              o haga click <Link to="/admin">aquí</Link>
            </p>
          </div>
        ) : (
          'Su email ha sido verificado'
        )
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
