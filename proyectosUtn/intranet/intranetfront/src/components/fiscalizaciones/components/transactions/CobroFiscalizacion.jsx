import ConfirmacionModal from 'components/expedientes/components/actions/buttons/ConfirmacionModal';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { expedienteGetById } from 'redux/actions/expediente';
import {
  fiscalizacionEliminarCobro,
  fiscalizacionGenerarTransaccion,
  fiscalizacionGetConceptos,
  fiscalizacionUpdateCobro
} from 'redux/actions/fiscalizacion';
import SeleccionarConceptos from './components/SeleccionarConceptos';

const CobroFiscalizacion = ({
  cobro,
  expedienteId,
  fiscalizacionId,
  isMatriculado,
  isDisabled,
  expedienteCreatedAt
}) => {
  const [loading, setLoading] = useState(false);
  const [openCreateTransaccionModal, setOpenCreateTransaccionModal] =
    useState(false);
  const [openSaveConceptosModal, setOpenSaveConceptosModal] = useState(false);

  const dispatch = useDispatch();

  const { conceptos } = useSelector(state => state.expedienteReducer);

  const [selectedConceptos, setSelectedConceptos] = useState([]);
  const [oldConceptos, setOldConceptos] = useState([]);

  const [conceptoInfraccionNoMatriculado, setConceptoInfraccionNoMatriculado] =
    useState(null);

  useEffect(() => {
    dispatch(fiscalizacionGetConceptos());
  }, []);

  useEffect(() => {
    const arrayConceptos = cobro.CobroConcepto;
    const newConceptos = [];

    for (const concepto of arrayConceptos) {
      for (let i = 0; i < concepto.cantidad; i++) {
        newConceptos.push(concepto.conceptoId);
      }
    }

    setOldConceptos(newConceptos);
    setSelectedConceptos(newConceptos || []);
  }, [cobro]);

  return (
    <div>
      <div className="mb-3">
        <SeleccionarConceptos
          conceptos={conceptos}
          selectedConceptos={selectedConceptos}
          setSelectedConceptos={setSelectedConceptos}
          isMatriculado={isMatriculado}
          isDisabled={isDisabled}
          expedienteCreatedAt={expedienteCreatedAt}
          conceptoInfraccionNoMatriculado={conceptoInfraccionNoMatriculado}
          setConceptoInfraccionNoMatriculado={
            setConceptoInfraccionNoMatriculado
          }
        />
      </div>

      {!isDisabled && (
        <>
          <div className="d-flex justify-content-between">
            <OverlayTrigger
              placement="top"
              overlay={props =>
                JSON.stringify(oldConceptos) !==
                JSON.stringify(selectedConceptos) ? (
                  <Tooltip {...props}>
                    Tenés que guardar los conceptos para generar la transacción
                  </Tooltip>
                ) : (
                  <div />
                )
              }
            >
              <div>
                <Button
                  onClick={() => {
                    setOpenCreateTransaccionModal(true);
                  }}
                  size="sm"
                  className="ml-3"
                  variant="primary"
                  style={{ width: '180px' }}
                  disabled={
                    loading ||
                    JSON.stringify(oldConceptos) !==
                      JSON.stringify(selectedConceptos)
                  }
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    'Generar transacción'
                  )}
                </Button>
              </div>
            </OverlayTrigger>

            <Button
              onClick={() => {
                setOpenSaveConceptosModal(true);
              }}
              size="sm"
              className="ml-3"
              disabled={loading}
              variant="success"
              style={{ width: '180px' }}
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                'Guardar conceptos'
              )}
            </Button>
          </div>

          <ConfirmacionModal
            openModal={openCreateTransaccionModal}
            setOpenModal={setOpenCreateTransaccionModal}
            loading={loading}
            setLoading={setLoading}
            title="generar la transacción"
            handleAccept={async () => {
              await dispatch(
                fiscalizacionGenerarTransaccion(
                  fiscalizacionId,
                  selectedConceptos,
                  conceptoInfraccionNoMatriculado?.id
                )
              );
              await dispatch(expedienteGetById(expedienteId));
            }}
          />

          <ConfirmacionModal
            openModal={openSaveConceptosModal}
            setOpenModal={setOpenSaveConceptosModal}
            loading={loading}
            setLoading={setLoading}
            title="guardar los conceptos"
            handleAccept={async () => {
              if (selectedConceptos.length) {
                await dispatch(
                  fiscalizacionUpdateCobro(cobro.id, selectedConceptos)
                );
              } else {
                await dispatch(
                  fiscalizacionUpdateCobro(cobro.id, selectedConceptos)
                );
                await dispatch(fiscalizacionEliminarCobro(cobro.id));
              }

              await dispatch(expedienteGetById(expedienteId));
            }}
          />
        </>
      )}
    </div>
  );
};

CobroFiscalizacion.propTypes = {
  cobro: PropTypes.object.isRequired,
  expedienteId: PropTypes.number.isRequired,
  fiscalizacionId: PropTypes.number.isRequired,
  isMatriculado: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  expedienteCreatedAt: PropTypes.string.isRequired
};

export default CobroFiscalizacion;
