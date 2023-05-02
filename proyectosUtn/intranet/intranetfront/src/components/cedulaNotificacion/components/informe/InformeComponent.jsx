import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Button, Card, Col, InputGroup, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import RenderPreview from 'components/common/RenderPreview';
import InformeModal from './InformeModal';
import { useDispatch, useSelector } from 'react-redux';
import SoftBadge from 'components/common/SoftBadge';
import { cedulaDeleteInforme, cedulaGetById } from 'redux/actions/cedula';
import draftToHtml from 'draftjs-to-html';

const InformeComponent = ({ informe, canAddInforme, cedula }) => {
  const { user } = useSelector(state => state.authReducer);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  return (
    <Col xs={12} key={informe.id} className="p-2 position-relative">
      <div className="border p-2">
        <InputGroup size="sm" className="d-flex justify-content-between">
          <InputGroup.Text
            style={{ flexGrow: 1 }}
            className="bg-primary text-light"
          >
            {informe.titulo}
          </InputGroup.Text>
          <InputGroup.Text className="bg-secondary text-light">
            <strong>{dayjs(informe.createdAt).format('DD/MM/YYYY')}</strong>
          </InputGroup.Text>
        </InputGroup>

        <div className="p-2 m-0">
          <span
            dangerouslySetInnerHTML={{
              __html: draftToHtml(JSON.parse(informe.comentario))
            }}
          />
        </div>

        <Row className="g-2">
          {informe.documento.map(documento => (
            <Col
              xs={1}
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

        <div
          className="d-flex align-items-end w-100"
          style={{
            justifyContent:
              canAddInforme &&
              user.empleado.areaId === informe.empleado.areaId &&
              informe.paso === cedula.pasoActual
                ? 'space-between'
                : 'end'
          }}
        >
          {canAddInforme &&
            user.empleado.areaId === informe.empleado.areaId &&
            informe.paso === cedula.pasoActual && (
              <div className="d-flex justify-content-end mt-3">
                <Button
                  size="sm"
                  variant="danger"
                  className="me-2"
                  onClick={async () => {
                    await dispatch(cedulaDeleteInforme(informe.id));
                    await dispatch(cedulaGetById(informe.cedulaId));
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

                <InformeModal
                  informe={informe}
                  show={show}
                  handleClose={() => setShow(false)}
                  cedula={cedula}
                />
              </div>
            )}

          <div className="d-flex justify-content-end mt-3">
            <SoftBadge bg="primary" className="text-dark">
              {informe.empleado.area.nombre}
            </SoftBadge>
          </div>
        </div>
      </div>
    </Col>
  );
};

InformeComponent.propTypes = {
  informe: PropTypes.object.isRequired,
  canAddInforme: PropTypes.bool.isRequired,
  cedula: PropTypes.object.isRequired
};

export default InformeComponent;
