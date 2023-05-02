import React from 'react';
import ProptTypes from 'prop-types';
import { Card, Col, InputGroup } from 'react-bootstrap';
import dayjs from 'dayjs';
import RenderPreview from 'components/common/RenderPreview';
import { useDispatch, useSelector } from 'react-redux';
import { tramiteEliminarArchivo, tramiteGetById } from 'redux/actions/tramite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Archivo.css';

const Archivo = ({ archivo, pasoActual }) => {
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
              await dispatch(tramiteEliminarArchivo(archivo.id));
              await dispatch(tramiteGetById(archivo.tramiteId));
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
  pasoActual: ProptTypes.number
};

export default Archivo;
