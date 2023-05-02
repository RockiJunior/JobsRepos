import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Conceptos from './Conceptos';
import ConceptosSeleccionados from './ConceptosSeleccionados';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { getConfig } from 'redux/actions/superadmin';

/* [
    {
        "id": 37,
        "nombre": "Hasta máximo 1 año sin regularizar",
        "nombreMontoPorcentaje": "matriculaAnual",
        "porcentaje": 150,
        "monto": null
    },
    {
        "id": 38,
        "nombre": "Con más de 1 año y hasta un máximo de 2 años sin regularizar",
        "nombreMontoPorcentaje": "matriculaAnual",
        "porcentaje": 300,
        "monto": null
    },
    {
        "id": 39,
        "nombre": "Con más de 2 años y hasta un máximo de 3 años sin regularizar",
        "nombreMontoPorcentaje": "matriculaAnual",
        "porcentaje": 400,
        "monto": null
    },
    {
        "id": 40,
        "nombre": "Con más de 3 años y hasta un máximo de 4 años sin regularizar",
        "nombreMontoPorcentaje": "matriculaAnual",
        "porcentaje": 500,
        "monto": null
    },
    {
        "id": 41,
        "nombre": "Con más de 4 años y hasta un máximo de 5 años sin regularizar",
        "nombreMontoPorcentaje": "matriculaAnual",
        "porcentaje": 600,
        "monto": null
    },
    {
        "id": 42,
        "nombre": "Con más de 5 años y hasta un máximo de 7 años sin regularizar",
        "nombreMontoPorcentaje": "matriculaAnual",
        "porcentaje": 800,
        "monto": null
    },
    {
        "id": 43,
        "nombre": "Con más de 7 años y hasta un máximo de 8 años sin regularizar",
        "nombreMontoPorcentaje": "matriculaAnual",
        "porcentaje": 900,
        "monto": null
    },
    {
        "id": 44,
        "nombre": "Con más de 8 años y hasta un máximo de 9 años sin regularizar",
        "nombreMontoPorcentaje": "matriculaAnual",
        "porcentaje": 1000,
        "monto": null
    }
] */

const yearConceptos = {
  0: 150,
  1: 300,
  2: 400,
  3: 500,
  4: 600,
  5: 800,
  6: 800,
  7: 900,
  8: 1000
};

const SeleccionarConceptos = ({
  selectedConceptos,
  setSelectedConceptos,
  conceptos,
  isMatriculado,
  isDisabled,
  expedienteCreatedAt,
  conceptoInfraccionNoMatriculado,
  setConceptoInfraccionNoMatriculado
}) => {
  const { config } = useSelector(state => state.saReducer);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getConfig());
  }, []);

  const [filteredConceptos, setFilteredConceptos] = useState([...conceptos]);

  useEffect(() => {
    if (isMatriculado) {
      setFilteredConceptos(
        conceptos.filter(concepto => concepto.tipo === 'matriculado')
      );
    } else {
      setFilteredConceptos(
        conceptos.filter(concepto => concepto.tipo === 'noMatriculado')
      );

      const arancelesInfraccionNoMatriculado = conceptos.find(
        c => c.tipo === 'oculto'
      );

      const years = dayjs().diff(expedienteCreatedAt, 'year');
      let concepto;

      if (years <= 8) {
        concepto = arancelesInfraccionNoMatriculado?.conceptos.find(
          c => c.porcentaje === yearConceptos[years]
        );
      } else {
        concepto = arancelesInfraccionNoMatriculado?.conceptos.find(
          c => c.porcentaje === yearConceptos[8]
        );
      }

      if (concepto) {
        setConceptoInfraccionNoMatriculado({
          ...concepto,
          monto:
            (config[concepto.nombreMontoPorcentaje] * concepto.porcentaje) / 100
        });
      }
    }
  }, [conceptos, isMatriculado]);

  return (
    <Row>
      {!isDisabled && (
        <Col>
          <Conceptos
            selectedConceptos={selectedConceptos}
            setSelectedConceptos={setSelectedConceptos}
            conceptos={filteredConceptos}
          />
        </Col>
      )}
      <Col>
        <ConceptosSeleccionados
          selectedConceptos={selectedConceptos}
          setSelectedConceptos={setSelectedConceptos}
          conceptos={conceptos}
          isDisabled={isDisabled}
          conceptoInfraccionNoMatriculado={conceptoInfraccionNoMatriculado}
          config={config}
        />
      </Col>
    </Row>
  );
};

SeleccionarConceptos.propTypes = {
  selectedConceptos: PropTypes.array.isRequired,
  setSelectedConceptos: PropTypes.func.isRequired,
  conceptos: PropTypes.array.isRequired,
  isMatriculado: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  expedienteCreatedAt: PropTypes.string.isRequired,
  conceptoInfraccionNoMatriculado: PropTypes.object,
  setConceptoInfraccionNoMatriculado: PropTypes.func.isRequired
};

export default SeleccionarConceptos;
