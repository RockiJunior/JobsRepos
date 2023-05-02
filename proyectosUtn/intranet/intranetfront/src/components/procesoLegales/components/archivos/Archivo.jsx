import React from 'react';
import ProptTypes from 'prop-types';
import { Card, Col, InputGroup } from 'react-bootstrap';
import dayjs from 'dayjs';
import RenderPreview from 'components/common/RenderPreview';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Archivo.css';
import { expedienteGetById } from 'redux/actions/expediente';
import { procesoLegalesEliminarArchivo } from 'redux/actions/procesoLegales';

const Archivo = ({ archivo, pasoActual, expedienteId }) => {
  const { user } = useSelector(state => state.authReducer);
  const dispatch = useDispatch();

  return (
    <Col xs={12} lg={6} className="position-relative">
      <InputGroup size="sm" className="d-flex" style={{ flexWrap: 'nowrap' }}>
        <InputGroup.Text
          className="bg-primary text-light"
          style={{ overflow: 'hidden', textOverflow: 'ellipsis', flexGrow: 1 }}
        >
          {archivo.titulo}
        </InputGroup.Text>
        <InputGroup.Text className="bg-secondary text-light">
          <strong>{dayjs(archivo.fecha).format('DD/MM/YYYY')}</strong>
        </InputGroup.Text>
      </InputGroup>
      <Card>
        <RenderPreview preview={archivo.archivoUbicacion} alt="preview" />
        {user.id === archivo.empleadoId && pasoActual === archivo.paso && (
          <div
            className="d-flex align-items-center justify-content-center bg-danger trash-archivo"
            onClick={async () => {
              await dispatch(procesoLegalesEliminarArchivo(archivo.id));
              await dispatch(expedienteGetById(expedienteId));
            }}
          >
            <FontAwesomeIcon icon="trash" className="text-white" />
          </div>
        )}
      </Card>
    </Col>
  );
};

Archivo.propTypes = {
  archivo: ProptTypes.object.isRequired,
  pasoActual: ProptTypes.number,
  expedienteId: ProptTypes.number
};

export default Archivo;
