import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  getImputaciones,
  procesoLegalDeleteDespachoImputacion
} from 'redux/actions/procesoLegales';
import ImputacionesSeleccionadas from './wizard/components/seleccionar/ImputacionesSeleccionadas';
import { Button, Col, InputGroup } from 'react-bootstrap';
import dayjs from 'dayjs';
import SoftBadge from 'components/common/SoftBadge';
import { expedienteGetById } from 'redux/actions/expediente';
import ConfirmacionModal from 'components/expedientes/components/actions/buttons/ConfirmacionModal';
import DespachoImputacionModal from './DespachoImputacionModal';

const DespachoImputacion = ({
  despachoImputacion,
  expedienteId,
  noEdit,
  pasoActual
}) => {
  const dispatch = useDispatch();
  const { imputaciones } = useSelector(state => state.expedienteReducer);
  const { user } = useSelector(state => state.authReducer);

  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    dispatch(getImputaciones());
  }, []);
  return (
    <Col xs={12} className={'position-relative p-2'}>
      <div className="border p-2">
        <InputGroup size="sm" className="d-flex justify-content-between mb-2">
          <InputGroup.Text
            style={{ flexGrow: 1 }}
            className="bg-primary text-light"
          >
            {despachoImputacion.titulo}
          </InputGroup.Text>
          <InputGroup.Text className="bg-secondary text-light">
            <strong>
              {dayjs(despachoImputacion.createdAt).format('DD/MM/YYYY')}
            </strong>
          </InputGroup.Text>
        </InputGroup>

        <ImputacionesSeleccionadas
          imputaciones={imputaciones}
          esVistaPrevia
          selectedImputaciones={despachoImputacion.imputaciones.map(
            imputacion => imputacion.imputacionId
          )}
          isAccordion
        />

        <h6 className="px-2 mt-2">
          <strong>Descripcion:</strong>
        </h6>
        <p className="px-2 m-0">{despachoImputacion.motivo}</p>

        <div
          className="d-flex align-items-end w-100"
          style={{
            justifyContent:
              user.id === despachoImputacion.empleado.usuarioId && !noEdit
                ? 'space-between'
                : 'end'
          }}
        >
          {user.id === despachoImputacion.empleado.usuarioId &&
            !noEdit &&
            despachoImputacion.paso === pasoActual && (
              <div className="d-flex justify-content-end mt-3">
                <Button
                  size="sm"
                  variant="danger"
                  className="me-2"
                  onClick={() => setShowConfirmModal(true)}
                >
                  Eliminar
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowEditModal(true)}
                >
                  Editar
                </Button>

                <DespachoImputacionModal
                  show={showEditModal}
                  expedienteId={expedienteId}
                  handleClose={() => setShowEditModal(false)}
                  procesoLegalId={despachoImputacion.procesoLegalId}
                  despachoImputacion={despachoImputacion}
                />
              </div>
            )}

          <div className="d-flex justify-content-end mt-3">
            <SoftBadge bg="primary" className="text-dark">
              {despachoImputacion.empleado.area.nombre}
            </SoftBadge>
          </div>
        </div>
      </div>

      <ConfirmacionModal
        loading={loading}
        setLoading={setLoading}
        openModal={showConfirmModal}
        setOpenModal={setShowConfirmModal}
        title="eliminar la imputación"
        handleAccept={async () => {
          await dispatch(
            procesoLegalDeleteDespachoImputacion(despachoImputacion.id)
          );
          await dispatch(expedienteGetById(expedienteId));
        }}
      />
    </Col>
  );
};

DespachoImputacion.propTypes = {
  despachoImputacion: PropTypes.object.isRequired,
  expedienteId: PropTypes.string.isRequired,
  noEdit: PropTypes.bool,
  pasoActual: PropTypes.number.isRequired
};

export default DespachoImputacion;
