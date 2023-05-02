import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, Col, Row, Card } from 'react-bootstrap';
import { getStatusIcon } from '../../../../utils/getStatusIcon';
import RenderPreview from 'components/common/RenderPreview';
import dayjs from 'dayjs';

const Transaccion = ({ transaccion }) => {
  return (
    <Col xs={12} key={transaccion.id} className="border p-2">
      <InputGroup size="sm" className="d-flex justify-content-between">
        <InputGroup.Text
          style={{ flexGrow: 1 }}
          className="bg-primary text-light"
        >
          Transacción
        </InputGroup.Text>
        <InputGroup.Text className="bg-secondary text-light">
          <strong>{dayjs(transaccion.fecha).format('DD/MM/YY')}</strong>
        </InputGroup.Text>
        {getStatusIcon(transaccion.estado)}
      </InputGroup>

      <Row className="g-2">
        <Col className="px-4">
          <Card.Title className="text-dark mt-2">
            <strong>Detalle:</strong>
          </Card.Title>

          <ul className="mb-0 ps-0 text-dark w-100">
            {transaccion.info?.conceptos.map(concepto => (
              <li
                key={concepto.id}
                className="w-100 d-flex justify-content-between align-items-start"
              >
                <span>{concepto.nombre}</span>
                <span className="ms-3">${concepto.monto?.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </Col>
        {!!transaccion.monto && (
          <Col xs={12} className="mb-3 px-4">
            <div className="d-flex justify-content-between">
              <span>
                <Card.Title className="text-dark text-end m-0">
                  Total:
                </Card.Title>
              </span>
              <span>
                <Card.Title className="text-dark text-end m-0">
                  <strong>${transaccion.monto?.toFixed(2)}</strong>
                </Card.Title>
                {transaccion.tipoCuota.cantidad > 1 && (
                  <p className="m-0 text-center fs--1 fw-semi-bold">
                    Cuota {transaccion.cuotaNro}/
                    {transaccion.tipoCuota.cantidad}
                  </p>
                )}
              </span>
            </div>
          </Col>
        )}
      </Row>

      <Row className="g-2 d-flexx justify-content-center">
        {transaccion.comprobante.map(comprobante => (
          <Col
            xs={6}
            sm={4}
            md={3}
            lg={2}
            key={comprobante.id}
            className="position-relative d-flex flex-column justify-content-between"
          >
            <Card>
              <RenderPreview
                preview={comprobante.archivoUbicacion}
                alt="preview"
                isSmall
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Col>
  );
};

Transaccion.propTypes = {
  transaccion: PropTypes.object.isRequired
};

export default Transaccion;
