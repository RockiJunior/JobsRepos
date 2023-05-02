import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Button, Card, Col, InputGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import RenderPreview from 'components/common/RenderPreview';
import { useDispatch, useSelector } from 'react-redux';
import {
  tramiteGetById,
  tramitesDeleteDictamen,
  tramitesDeleteInforme,
  tramitesDeleteIntimacion,
  tramitesDeleteResolucion
} from 'redux/actions/tramite';
import SoftBadge from 'components/common/SoftBadge';
import DocumentModal from './DocumentModal';
import draftToHtml from 'draftjs-to-html';

const getDispatchDelete = (type, id) => {
  switch (type) {
    case 'informe':
      return tramitesDeleteInforme(id);
    case 'dictamen':
      return tramitesDeleteDictamen(id);
    case 'intimacion':
      return tramitesDeleteIntimacion(id);
    case 'resolucion':
      return tramitesDeleteResolucion(id);
    default:
      return null;
  }
};

const DocumentComponent = ({
  document,
  canAddDocument,
  tramite,
  noPadding,
  type
}) => {
  const { user } = useSelector(state => state.authReducer);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  return (
    <Col
      xs={12}
      key={document.id}
      className={'position-relative' + noPadding ? '' : ' p-2'}
    >
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
            justifyContent:
              canAddDocument &&
              user.empleado.areaId === document.empleado.areaId &&
              document.paso === tramite.pasoActual
                ? 'space-between'
                : 'end'
          }}
        >
          {canAddDocument &&
            user.empleado.areaId === document.empleado.areaId &&
            document.paso === tramite.pasoActual && (
              <div className="d-flex justify-content-end mt-3">
                <Button
                  size="sm"
                  variant="danger"
                  className="me-2"
                  onClick={async () => {
                    await dispatch(getDispatchDelete(type, document.id));
                    await dispatch(tramiteGetById(document.tramiteId));
                  }}
                >
                  Eliminar
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShow(true)}
                >
                  Editar
                </Button>

                <DocumentModal
                  document={document}
                  setShow={setShow}
                  show={show}
                  tramite={tramite}
                  type={type}
                  handleClose={() => setShow(false)}
                />
              </div>
            )}
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

DocumentComponent.propTypes = {
  document: PropTypes.object,
  canAddDocument: PropTypes.bool,
  tramite: PropTypes.object,
  noPadding: PropTypes.bool,
  type: PropTypes.oneOf(['informe', 'dictamen', 'intimacion', 'resolucion'])
};

export default DocumentComponent;
