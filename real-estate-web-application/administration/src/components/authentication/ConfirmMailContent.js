import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import envelope from 'assets/img/icons/spot-illustrations/16.png';
import axios from 'axios';

const ConfirmMailContent = ({ email, titleTag: TitleTag }) => {
  const [status, setStatus] = useState(null);

  const handleClick = () => {
    axios
      .post(`${process.env.REACT_APP_SERVER}/admin/reSendEmail`, {
        email: atob(email)
      })
      .then(res => {
        if (res.data === 'success') {
          setStatus('success');
        } else {
          setStatus('rejected');
        }
      });
  };

  return (
    <>
      <img
        className="d-block mx-auto mb-4"
        src={envelope}
        alt="sent"
        width={100}
      />
      <TitleTag>Por favor verifique su email!</TitleTag>
      <p>
        Un email a sido enviado a <strong>{atob(email)}</strong>.
      </p>
      <center>
        {status ? (
          status === 'rejected' ? (
            <>
              <p>
                Se produjo un error al tratar de reenviar el email. <br />
                <br /> Por favor, intentelo de nuevo.
              </p>
              <Link className="fs--1 mb-0" to={``} onClick={handleClick}>
                Reenviar email
              </Link>
            </>
          ) : (
            <p>
              El email ha sido reenviado. <br /> Verifique su casilla
            </p>
          )
        ) : (
          <Link className="fs--1 mb-0" to={``} onClick={handleClick}>
            Reenviar email
          </Link>
        )}
      </center>
      <Button
        as={Link}
        color="primary"
        size="sm"
        className="mt-3"
        to={`/login`}
      >
        <FontAwesomeIcon
          icon="chevron-left"
          transform="shrink-4 down-1"
          className="me-1"
        />
        Iniciar sesión
      </Button>
    </>
  );
};

ConfirmMailContent.propTypes = {
  email: PropTypes.string.isRequired,
  layout: PropTypes.string,
  titleTag: PropTypes.string
};

ConfirmMailContent.defaultProps = { layout: 'simple', titleTag: 'h4' };

export default ConfirmMailContent;
