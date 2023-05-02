import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Row } from 'react-bootstrap';
import dayjs from 'dayjs';
import SoftBadge from 'components/common/SoftBadge';
import { Link } from 'react-router-dom';

const getBadge = value => {
  switch (value) {
    case 'activo':
      return (
        <SoftBadge className="fs-2" bg="success">
          Activa
        </SoftBadge>
      );

    case 'inactivo':
      return (
        <SoftBadge className="fs-2" bg="danger">
          Inactiva
        </SoftBadge>
      );

    case 'pendiente':
      return (
        <SoftBadge className="fs-2" bg="secondary">
          Pendiente
        </SoftBadge>
      );

    case 'pasiva':
      return (
        <SoftBadge className="fs-2" bg="info">
          Pasiva
        </SoftBadge>
      );
  }
};

const MatriculadoContent = ({ usuario }) => {
  return (
    <Row>
      {usuario.matricula[0] && (
        <Col xs={12} md={6} className="p-3">
          <Card
            style={{
              boxShadow: 'none',
              border: '2px solid var(--falcon-primary)',
              maxWidth: '450px'
            }}
          >
            <Card.Header>
              <Card.Title className="fs-1">
                Matricula nroº {usuario.matricula[0].id}
              </Card.Title>
              <Card.Subtitle>
                {dayjs(usuario.matricula[0].fecha).format(
                  'D [de] MMMM [de] YYYY'
                )}
              </Card.Subtitle>
              <div
                style={{ flexWrap: 'wrap' }}
                className="d-flex justify-content-between align-items-center"
              >
                <div style={{ flexWrap: 'wrap' }} className="d-flex mt-2">
                  <p className="me-2 mb-0">
                    Libro: <strong>{usuario.matricula[0].libro}</strong>
                  </p>

                  <p className="me-2 mb-0">
                    Tomo: <strong>{usuario.matricula[0].tomo}</strong>
                  </p>

                  <p className="mb-0">
                    Folio: <strong>{usuario.matricula[0].folio}</strong>
                  </p>
                </div>

                <div className="mt-2 ps-2 w-100 d-flex justify-content-end">
                  {getBadge(usuario.matricula[0].estado)}
                </div>
              </div>
            </Card.Header>
          </Card>
        </Col>
      )}
      <Col
        xs={12}
        md={6}
        className="p-3 d-flex flex-column jusitfy-content-between"
      >
        <div>
          <p className="m-0 text-dark">
            Nombre: <strong>{usuario.nombre}</strong>
          </p>

          <p className="m-0 text-dark">
            Apellido: <strong>{usuario.apellido}</strong>
          </p>

          <p className="m-0 text-dark">
            DNI: <strong>{usuario.dni}</strong>
          </p>

          <p className="m-0 text-dark">
            Email: <strong>{usuario.email}</strong>
          </p>
        </div>

        <div
          style={{ flexGrow: 1 }}
          className="d-flex justify-content-end align-items-end"
        >
          <Button
            as={Link}
            variant="link"
            target="_blank"
            to={`/usuarios/${usuario.id}`}
          >
            Ver más
          </Button>
        </div>
      </Col>
    </Row>
  );
};

MatriculadoContent.propTypes = {
  usuario: PropTypes.object.isRequired
};

export default MatriculadoContent;
