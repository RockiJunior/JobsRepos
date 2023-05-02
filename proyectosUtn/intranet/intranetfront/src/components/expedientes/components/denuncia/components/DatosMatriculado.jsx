import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const DatosMatriculado = ({ id }) => {
  const [usuario, setUsuario] = useState({});

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SERVER + '/users/by_id/' + id)
      .then(({ data }) => setUsuario(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      <div>
        <p className="m-0 text-dark">
          Es Matriculado: <strong>Si</strong>
        </p>

        <p className="m-0 text-dark">
          Nombre: <strong>{usuario.nombre}</strong>
        </p>

        <p className="m-0 text-dark">
          Apellido: <strong>{usuario.apellido}</strong>
        </p>

        <p className="m-0 text-dark">
          DNI: <strong>{usuario.dni}</strong>
        </p>

        <p className="m-0 text-dark">
          Email: <strong>{usuario.email}</strong>
        </p>
      </div>

      <div
        style={{ flexGrow: 1 }}
        className="d-flex justify-content-end align-items-end"
      >
        <Button
          as={Link}
          variant="link"
          target="_blank"
          to={`/usuarios/${usuario.id}`}
        >
          Más información...
        </Button>
      </div>
    </>
  );
};

DatosMatriculado.propTypes = {
  id: PropTypes.number.isRequired
};

export default DatosMatriculado;
