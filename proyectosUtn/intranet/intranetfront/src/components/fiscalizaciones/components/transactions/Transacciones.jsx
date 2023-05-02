import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Spinner } from 'react-bootstrap';
import Transaccion from './Transaccion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CobroFiscalizacion from './CobroFiscalizacion';
import { useDispatch } from 'react-redux';
import {
  fiscalizacionCrearCobro,
  fiscalizacionEliminarTransaccion
} from 'redux/actions/fiscalizacion';
import { expedienteGetById } from 'redux/actions/expediente';
import ConfirmacionModal from 'components/expedientes/components/actions/buttons/ConfirmacionModal';

function Transacciones({
  transaccion,
  cobro,
  fiscalizacionId,
  expedienteId,
  isMatriculado,
  isDisabled,
  expedienteCreatedAt
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [openDelteModal, setOpenDeleteModal] = useState(false);

  return !transaccion ? (
    <div>
      {cobro ? (
        <CobroFiscalizacion
          cobro={cobro}
          expedienteId={expedienteId}
          fiscalizacionId={fiscalizacionId}
          isMatriculado={isMatriculado}
          isDisabled={isDisabled}
          expedienteCreatedAt={expedienteCreatedAt}
        />
      ) : !isDisabled ? (
        <div className="d-flex justify-content-center">
          <Button
            onClick={async () => {
              if (!loading) {
                setLoading(true);
                await dispatch(fiscalizacionCrearCobro(fiscalizacionId));
                await dispatch(expedienteGetById(expedienteId));
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                Generar nuevo cobro <FontAwesomeIcon icon="plus" />
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="text-center">No se ha generado un cobro</div>
      )}
    </div>
  ) : (
    <div>
      <Row>
        <Transaccion key={transaccion.id} transaccion={transaccion} />
      </Row>

      {!isDisabled && transaccion.estado !== 'approved' && (
        <>
          <Button
            size="sm"
            variant="danger"
            className="mt-3"
            onClick={() => {
              if (!loading) {
                setOpenDeleteModal(true);
              }
            }}
          >
            Cancelar transacción
          </Button>

          <ConfirmacionModal
            loading={loading}
            setLoading={setLoading}
            openModal={openDelteModal}
            setOpenModal={setOpenDeleteModal}
            title="cancelar la transacción"
            handleAccept={async () => {
              await dispatch(fiscalizacionEliminarTransaccion(transaccion.id));
              await dispatch(expedienteGetById(expedienteId));
            }}
          />
        </>
      )}
    </div>
  );
}

Transacciones.propTypes = {
  transaccion: PropTypes.object,
  cobro: PropTypes.object,
  fiscalizacionId: PropTypes.number.isRequired,
  expedienteId: PropTypes.number.isRequired,
  isMatriculado: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  expedienteCreatedAt: PropTypes.string.isRequired
};

export default Transacciones;
