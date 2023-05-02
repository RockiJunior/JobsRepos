import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Button, Card, Col, InputGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import RenderPreview from 'components/common/RenderPreview';
import { useDispatch, useSelector } from 'react-redux';
import SoftBadge from 'components/common/SoftBadge';
import DocumentModal, { TipoFallosOptions } from './DocumentModal';
import draftToHtml from 'draftjs-to-html';
import { expedienteGetById } from 'redux/actions/expediente';
import {
  procesoLegalesDeleteDictamen,
  procesoLegalesDeleteFallo,
  procesoLegalesDeleteInforme,
  procesoLegalesDeleteResolucion
} from 'redux/actions/procesoLegales';

const getDispatchDelete = (type, id) => {
  switch (type) {
    case 'dictamen':
      return procesoLegalesDeleteDictamen(id);
    case 'fallo':
      return procesoLegalesDeleteFallo(id);
    case 'resolucion':
      return procesoLegalesDeleteResolucion(id);

    case 'informe':
      return procesoLegalesDeleteInforme(id);

    default:
      return null;
  }
};

const DocumentComponent = ({
  document,
  expediente,
  noPadding,
  type,
  procesoLegalId,
  pasoActual
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

        {type === 'fallo' && (
          <div className="d-flex justify-content-between">
            <SoftBadge variant="primary" className="mt-2 fs-0">
              {
                TipoFallosOptions.find(
                  tipoFallo => tipoFallo.value === document.tipo
                )?.label
              }
            </SoftBadge>
          </div>
        )}

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
              user.id === document.empleado.usuarioId &&
              document.paso === pasoActual
                ? 'space-between'
                : 'end'
          }}
        >
          {user.id === document.empleado.usuarioId &&
            document.paso === pasoActual && (
              <div className="d-flex justify-content-end mt-3">
                <Button
                  size="sm"
                  variant="danger"
                  className="me-2"
                  onClick={async () => {
                    await dispatch(getDispatchDelete(type, document.id));
                    await dispatch(expedienteGetById(expediente.id));
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
                  expediente={expediente}
                  procesoLegalId={procesoLegalId}
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
  expediente: PropTypes.object.isRequired,
  noPadding: PropTypes.bool,
  type: PropTypes.oneOf(['dictamen', 'fallo', 'resolucion', 'informe']),
  procesoLegalId: PropTypes.number.isRequired,
  pasoActual: PropTypes.number.isRequired
};

export default DocumentComponent;
