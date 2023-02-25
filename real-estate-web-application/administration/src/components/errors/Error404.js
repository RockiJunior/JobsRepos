import React from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const Error404 = () => {
  return (
    <Card className="text-center">
      <Card.Body className="p-5">
        <div className="display-1 text-300 fs-error">404</div>
        <p className="lead mt-4 text-800 font-sans-serif fw-semi-bold">
          La página que estás buscando no se encuentra.
        </p>
        <hr />
        <p>
          Asegúrate de que la dirección sea correcta y que la página no se haya
          movido. Si crees que esto es un error
          <a href="mailto:info@exmaple.com" className="ms-1">
            contactate con nosotros
          </a>
          .
        </p>
        <Link className="btn btn-primary btn-sm mt-3" to="/">
          <FontAwesomeIcon icon={faHome} className="me-2" />
          Home
        </Link>
      </Card.Body>
    </Card>
  );
};

export default Error404;
