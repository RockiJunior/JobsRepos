import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, InputGroup, Row } from 'react-bootstrap';
import dayjs from 'dayjs';
import RenderPreview from 'components/common/RenderPreview';

const VirtualTab = ({ type, tramite }) => {
  switch (type) {
    case 'apelacion':
      const apelaciones = tramite.archivos.filter(
        archivo => archivo.titulo === 'Apelación'
      );

      return apelaciones.length ? (
        <Row>
          {apelaciones.map((apelacion, index) => (
            <Col xs={6} key={apelacion.id} className="p-2 position-relative">
              <div className="border p-2">
                <InputGroup
                  size="sm"
                  className="d-flex justify-content-between"
                >
                  <InputGroup.Text
                    style={{ flexGrow: 1 }}
                    className="bg-primary text-light"
                  >
                    {apelacion.titulo + ' ' + (index + 1)}
                  </InputGroup.Text>
                  <InputGroup.Text className="bg-secondary text-light">
                    <strong>
                      {dayjs(apelacion.createdAt).format('DD/MM/YYYY')}
                    </strong>
                  </InputGroup.Text>
                </InputGroup>
                <Card>
                  <RenderPreview
                    preview={apelacion.archivoUbicacion}
                    alt="preview"
                    isSmall
                  />
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        <h3>No hay apelaciones</h3>
      );

    default:
      return null;
  }
};

VirtualTab.propTypes = {
  type: PropTypes.string.isRequired,
  tramite: PropTypes.object.isRequired
};

export default VirtualTab;
