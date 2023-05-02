import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { tramiteCreate, tramiteCreateNoUser } from 'redux/actions/tramite';
import { useNavigate } from 'react-router-dom';

const Success = ({ reset, tramite, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user: empleado } = useSelector(state => state.authReducer);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!loading && tramite && empleado) {
      setLoading(true);

      if (user) {
        await dispatch(
          tramiteCreate(
            {
              tipoId: tramite.id,
              userId: user.id,
              empleadoId: empleado.id
            },
            navigate
          )
        );
      } else {
        await dispatch(
          tramiteCreateNoUser(
            { tipoId: tramite.id, empleadoId: empleado.id },
            navigate
          )
        );
      }

      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h5>Trámite Elegido:</h5>
      <h4 className="fw-bold">{tramite.titulo}</h4>

      {user && (
        <>
          <h5 className="mt-4">Matriculado Elegido:</h5>
          <h4 className="fw-bold">
            {user.nombre} {user.apellido}
          </h4>
        </>
      )}

      <div className="mt-4">
        <Button variant="warning" className="me-1" onClick={reset}>
          Reiniciar
        </Button>

        <Button
          variant="success"
          className="ms-1 display-flex justify-content-center align-items-center"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <Spinner as="span" animation="border" size="sm" />
          ) : (
            'Iniciar Tramite'
          )}
        </Button>
      </div>
    </div>
  );
};

Success.propTypes = {
  reset: PropTypes.func.isRequired,
  tramite: PropTypes.object,
  user: PropTypes.object
};

export default Success;
