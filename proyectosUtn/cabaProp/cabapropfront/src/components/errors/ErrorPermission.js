import React from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const ErrorPermission = () => {
  return (
    <Card className="text-center">
      <Card.Body className="p-5">
        <div className="display-1 text-300 fs-error">401</div>
        <p className="lead mt-4 text-800 font-sans-serif fw-semi-bold">
          No tenés acceso para ingresar a la página.
        </p>
        <hr />
        <p>
          Asegurate de tener un rol asignado con los permisos necesarios para esta dirección.
          Si creés que esto es un error, por favor 
          <a href="mailto:info@exmaple.com" className="ms-1">
            contactate con nosotros
          </a>
          .
        </p>
        <Link className="btn btn-primary btn-sm mt-3" to="/perfil">
          <FontAwesomeIcon icon={faHome} className="me-2" />
          Volver a mi perfil
        </Link>
      </Card.Body>
    </Card>
  );
};

export default ErrorPermission;
