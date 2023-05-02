import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from 'components/common/IconButton';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

const ConceptosSeleccionados = ({
  selectedConceptos,
  setSelectedConceptos,
  conceptos,
  isDisabled,
  conceptoInfraccionNoMatriculado,
  config
}) => {
  const [monto, setMonto] = useState(0);
  const [conceptosFull, setConceptosFull] = useState([]);

  useEffect(() => {
    if (conceptos.length && config) {
      const conceptosFull = [...selectedConceptos].map(conceptoId => {
        let conceptoFull;

        conceptos.forEach(padre => {
          padre.conceptos.forEach(concepto => {
            if (concepto.id === conceptoId) {
              conceptoFull = {
                ...concepto,
                monto:
                  (config[concepto.nombreMontoPorcentaje] *
                    concepto.porcentaje) /
                  100
              };
            }
          });
        });
        return conceptoFull;
      });

      setConceptosFull(
        conceptosFull.sort((a, b) => (a.nombre > b.nombre ? 1 : -1))
      );
    }
  }, [selectedConceptos, conceptos, config]);

  useEffect(() => {
    let monto = 0;

    conceptosFull.forEach(concepto => {
      monto += concepto.monto;
    });

    if (conceptoInfraccionNoMatriculado) {
      monto += conceptoInfraccionNoMatriculado.monto;
    }

    setMonto(monto.toFixed(2));
  }, [conceptosFull, conceptoInfraccionNoMatriculado]);

  return (
    <div>
      {isDisabled ? (
        <h6 className="px-1">
          <strong>
            <FontAwesomeIcon icon="list-check" className="me-2" />
            Conceptos seleccionados:
          </strong>
        </h6>
      ) : (
        <h5 className="text-center mb-3">
          <FontAwesomeIcon icon="list-check" className="me-2" />
          Conceptos seleccionados
        </h5>
      )}
      <div>
        <Row className="g-2">
          <Col className="px-4">
            <Card.Title className="text-dark mt-2">
              <strong>Detalle:</strong>
            </Card.Title>

            <ul className="mb-0 ps-0 text-dark w-100">
              {conceptosFull.map((concepto, index) => (
                <li
                  key={`${concepto.id}-${index}`}
                  className="w-100 d-flex justify-content-between align-items-start fs--1 position-relative"
                >
                  {!isDisabled && (
                    <IconButton
                      icon="times"
                      className="text-danger position-absolute p-0"
                      style={{ top: -2, left: -15 }}
                      variant="link"
                      onClick={() => {
                        const deleteIndex = selectedConceptos.findIndex(
                          id => id === concepto.id
                        );
                        const copy = [...selectedConceptos];
                        if (deleteIndex === -1) return;

                        copy.splice(deleteIndex, 1);

                        setSelectedConceptos(copy);
                      }}
                    />
                  )}

                  <span>
                    {concepto.nombre} ({concepto.porcentaje}%)
                  </span>

                  <span className="ms-3">${concepto.monto.toFixed(2)}</span>
                </li>
              ))}
              {conceptoInfraccionNoMatriculado && (
                <li className="w-100 d-flex justify-content-between align-items-start fs--1 position-relative">
                  <span>
                    {conceptoInfraccionNoMatriculado.nombre} (
                    {conceptoInfraccionNoMatriculado.porcentaje}%)
                  </span>

                  <span className="ms-3">
                    ${conceptoInfraccionNoMatriculado.monto.toFixed(2)}
                  </span>
                </li>
              )}
            </ul>
          </Col>

          <Col xs={12} className="mb-3 px-4">
            <div className="d-flex justify-content-between">
              <span>
                <Card.Title className="text-dark text-end m-0">
                  Total:
                </Card.Title>
              </span>
              <span>
                <Card.Title className="text-dark text-end m-0">
                  <strong>${monto}</strong>
                </Card.Title>
              </span>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

ConceptosSeleccionados.propTypes = {
  selectedConceptos: PropTypes.array.isRequired,
  setSelectedConceptos: PropTypes.func.isRequired,
  conceptos: PropTypes.array.isRequired,
  isDisabled: PropTypes.bool,
  conceptoInfraccionNoMatriculado: PropTypes.object,
  config: PropTypes.object
};

export default ConceptosSeleccionados;
