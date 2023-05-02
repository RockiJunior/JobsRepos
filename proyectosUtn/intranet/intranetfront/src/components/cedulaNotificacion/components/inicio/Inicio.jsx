import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import RenderPreview from 'components/common/RenderPreview';
import draftToHtml from 'draftjs-to-html';

const camelCaseToSpaces = str => {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
    return str.toUpperCase();
  });
};

const Inicio = ({ cedula }) => {
  return (
    <Row>
      <Col xs={12} lg={5}>
        <p
          style={{
            fontWeight: 700,
            width: 'fit-content'
          }}
        >
          Datos del matriculado:
        </p>
        <p>
          {Object.keys(cedula.usuario.datos)
            .filter(
              dato =>
                dato === 'nombre' ||
                dato === 'apellido' ||
                dato === 'domicilioLegal' ||
                dato === 'mailParticular' ||
                dato === 'domicilioReal' ||
                dato === 'dni' ||
                dato === 'telefonoParticular' ||
                dato === 'celularParticular'
            )
            .map(dato => (
              <span key={dato}>
                {dato === 'dni' ? dato.toUpperCase() : camelCaseToSpaces(dato)}:{' '}
                <strong>{cedula.usuario.datos[dato].value}</strong>
                <br />
              </span>
            ))}
        </p>

        {!!cedula.documentos?.length && (
          <>
            <p
              style={{
                fontWeight: 700,
                width: 'fit-content'
              }}
            >
              Archivos:
            </p>
            <Row className="g-2">
              {cedula.documentos.map(documento => (
                <Col
                  xs={2}
                  lg={4}
                  key={documento.id}
                  className="position-relative d-flex flex-column justify-content-between"
                >
                  <Card>
                    <RenderPreview
                      preview={documento.archivoUbicacion}
                      alt="preview"
                      isSmall
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Col>
      <Col xs={12} lg={7}>
        <h4
          style={{
            fontWeight: 700,
            width: 'fit-content'
          }}
        >
          {cedula.titulo}
        </h4>

        <div>
          <span
            dangerouslySetInnerHTML={{
              __html: draftToHtml(JSON.parse(cedula.motivo))
            }}
          />
        </div>
      </Col>
    </Row>
  );
};

Inicio.propTypes = {
  cedula: PropTypes.object.isRequired
};

export default Inicio;
