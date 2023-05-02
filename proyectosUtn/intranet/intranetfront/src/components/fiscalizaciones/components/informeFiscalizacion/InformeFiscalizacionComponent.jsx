import RenderPreview from 'components/common/RenderPreview';
import SoftBadge from 'components/common/SoftBadge';
import dayjs from 'dayjs';
import draftToHtml from 'draftjs-to-html';
import PropTypes from 'prop-types';
import React from 'react';
import { Card, Col, InputGroup } from 'react-bootstrap';

const InformeFiscalizacionComponent = ({ document }) => {
  return (
    <Col xs={12} key={document.id} className={'position-relative'}>
      <div className="border p-2">
        <InputGroup size="sm" className="d-flex justify-content-between">
          <InputGroup.Text
            style={{ flexGrow: 1 }}
            className="bg-primary text-light"
          >
            {document.titulo}
          </InputGroup.Text>
          <InputGroup.Text className="bg-secondary text-light">
            <strong>{dayjs(document.createdAt).format('DD/MM/YYYY')}</strong>
          </InputGroup.Text>
        </InputGroup>

        <div className="p-2 m-0">
          <span
            dangerouslySetInnerHTML={{
              __html: draftToHtml(JSON.parse(document.comentario))
            }}
          />
        </div>

        <div className="d-flex flex-wrap">
          {document.documento.map(documento => (
            <Card
              key={documento.id}
              style={{ width: 75, overflow: 'hidden' }}
              className="m-2 border"
            >
              <RenderPreview
                preview={documento.archivoUbicacion}
                alt="preview"
                isSmall
              />
            </Card>
          ))}
        </div>

        <div
          className="d-flex align-items-end w-100"
          style={{
            justifyContent: 'end'
          }}
        >
          <div className="d-flex justify-content-end mt-3">
            <SoftBadge bg="primary" className="text-dark">
              {document.empleado.area.nombre}
            </SoftBadge>
          </div>
        </div>
      </div>
    </Col>
  );
};

InformeFiscalizacionComponent.propTypes = {
  document: PropTypes.object
};

export default InformeFiscalizacionComponent;
