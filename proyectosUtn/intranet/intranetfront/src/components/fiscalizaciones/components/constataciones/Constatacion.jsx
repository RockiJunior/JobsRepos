import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Button, Card, Col, InputGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import RenderPreview from 'components/common/RenderPreview';
import { useDispatch, useSelector } from 'react-redux';
import SoftBadge from 'components/common/SoftBadge';
import { expedienteGetById } from 'redux/actions/expediente';
import NuevaConstatacion from './NuevaConstatacion';
import { fiscalizacionEliminarConstatacion } from 'redux/actions/fiscalizacion';
import { capitalize } from 'utils/capitalize';

const Constatacion = ({
  constatacion,
  fiscalizacionId,
  expedienteId,
  expedienteUserId,
  isDisabled
}) => {
  const { user } = useSelector(state => state.authReducer);

  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  return (
    <Col xs={12} key={constatacion.id} className={'position-relative p-2'}>
      <div className="border p-2">
        <InputGroup size="sm" className="d-flex justify-content-between">
          <InputGroup.Text
            style={{ flexGrow: 1 }}
            className="bg-primary text-light"
          >
            {constatacion.titulo}
          </InputGroup.Text>
          <InputGroup.Text className="bg-secondary text-light">
            <strong>
              {dayjs(constatacion.createdAt).format('DD/MM/YYYY')}
            </strong>
          </InputGroup.Text>
        </InputGroup>

        <div className="p-2 m-0">
          <p>Fecha: {dayjs(constatacion.fecha).format('DD/MM/YYYY')}</p>

          <p>{constatacion.comentario}</p>

          <p>Estado: {capitalize(constatacion.estado)}</p>
        </div>

        <div className="d-flex flex-wrap">
          {constatacion.documento.map(documento => (
            <Card
              key={documento.id}
              style={{ width: 75, overflow: 'hidden' }}
              className="m-2 border"
            >
              <RenderPreview
                preview={documento.archivoUbicacion}
                alt="preview"
                isSmall
              />
            </Card>
          ))}
        </div>

        <div
          className="d-flex align-items-end w-100"
          style={{
            justifyContent:
              user.id === constatacion.empleado.usuarioId && !isDisabled
                ? 'space-between'
                : 'end'
          }}
        >
          {user.id === constatacion.empleado.usuarioId && !isDisabled && (
            <div className="d-flex justify-content-end mt-3">
              <Button
                size="sm"
                variant="danger"
                className="me-2"
                onClick={async () => {
                  await dispatch(
                    fiscalizacionEliminarConstatacion(constatacion.id)
                  );
                  await dispatch(expedienteGetById(expedienteId));
                }}
              >
                Eliminar
              </Button>

              <Button variant="primary" size="sm" onClick={() => setShow(true)}>
                Editar
              </Button>

              <NuevaConstatacion
                show={show}
                constatacion={constatacion}
                setShow={setShow}
                expedienteId={expedienteId}
                expedienteUserId={expedienteUserId}
                fiscalizacionId={fiscalizacionId}
              />
            </div>
          )}

          <div className="d-flex justify-content-end mt-3">
            <SoftBadge bg="primary" className="text-dark">
              {constatacion.empleado.area.nombre}
            </SoftBadge>
          </div>
        </div>
      </div>
    </Col>
  );
};

Constatacion.propTypes = {
  constatacion: PropTypes.object,
  fiscalizacionId: PropTypes.number.isRequired,
  expedienteId: PropTypes.number.isRequired,
  expedienteUserId: PropTypes.number,
  isDisabled: PropTypes.bool
};

export default Constatacion;
