import CustomTab from 'components/common/CustomTab';
import CustomBreadcrumb from 'components/varios/messages/CustomBreadcrumb';
import React, { useEffect, useState } from 'react';
import { Card, Col, Nav, Row, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { expedienteGetById } from 'redux/actions/expediente';
import CustomContentBodyFiscalizacion from './components/CustomContentBodyFiscalizacion';
import Notes from './components/notes/Notes';
import { AlertInfo } from './AlertInfo';
import { FiscalizacionActions } from './components/actions/FiscalizacionActions';

const Fiscalizacion = () => {
  const { expedienteId, fiscalizacionId } = useParams();
  const dispatch = useDispatch();

  const { expediente } = useSelector(state => state.expedienteReducer);
  const [fiscalizacion, setFiscalizacion] = useState(null);

  const [key, setKey] = useState(
    localStorage.getItem('tf') ? atob(localStorage.getItem('tf')) : 'formulario'
  );

  useEffect(() => {
    localStorage.setItem('tf', btoa(key));
  }, [key]);

  useEffect(() => {
    dispatch(expedienteGetById(expedienteId));
  }, []);

  useEffect(() => {
    expediente?.id &&
      setFiscalizacion(
        expediente.fiscalizaciones.find(
          fiscalizacion => fiscalizacion.id === Number(fiscalizacionId)
        )
      );
  }, [expediente]);

  useEffect(() => {
    if (fiscalizacion) {
      const lf = localStorage.getItem('lf');

      if (lf && atob(lf) != fiscalizacion.id) {
        setKey('formulario');
      }

      localStorage.setItem('lf', btoa(fiscalizacion.id));
    }
  }, [fiscalizacion]);

  return expediente && fiscalizacion ? (
    <Card style={{ boxShadow: 'none' }}>
      <Card.Body className="py-0">
        <CustomBreadcrumb
          links={[
            { name: 'Expedientes en el area', path: '/expedientes_area' },
            {
              name: 'Expediente Nº ' + expediente.numero, //cambiar a numero
              path: `/expedientes/${expedienteId}`
            },
            {
              name: 'Fiscalización: ' + fiscalizacion.titulo,
              path: `/expedientes/${expedienteId}/fiscalizaciones/${fiscalizacionId}`,
              active: true
            }
          ]}
        />
        <div className="mb-2 mt-3 d-flex justify-content-between align-items-end">
          <Row className="mt-3">
            <Col xs={12} style={{ width: 'fit-content' }}>
              <h4
                style={{
                  fontWeight: 700,
                  width: 'fit-content'
                }}
              >
                Expediente Nº {expediente.numero}
              </h4>
              <h5
                style={{
                  fontWeight: 500,
                  width: 'fit-content'
                }}
                className="fs-0 mb-2"
              >
                {expediente?.caratula?.titulo}
              </h5>
              <h5
                style={{
                  fontWeight: 600,
                  width: 'fit-content'
                }}
                className="mb-0"
              >
                Fiscalización: {fiscalizacion.titulo}
              </h5>
            </Col>
          </Row>

          <FiscalizacionActions
            fiscalizacion={fiscalizacion}
            expedienteId={expediente.id}
            setKey={setKey}
            expedienteUserId={expediente.carpeta?.usuarioId || 'cucicba'}
            expediente={expediente}
          />
        </div>

        {fiscalizacion.estado !== 'pendiente' && (
          <Row>
            <Col xs={12}>
              <AlertInfo fiscalizacion={fiscalizacion} />
            </Col>
          </Row>
        )}

        <Row className="g-3">
          <Col xs={12} xl={9}>
            <Card className="bg-white">
              <Card.Header>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <Tab.Container
                    activeKey={key}
                    onSelect={k => setKey(k)}
                    className="mb-1"
                  >
                    <Nav className="mb-1">
                      <CustomTab
                        eventKey="informe"
                        title="Informe"
                        isVisible={!!fiscalizacion.informeFiscalizacion}
                      />

                      <CustomTab
                        eventKey="denuncia"
                        title="Denuncia"
                        isVisible={!!expediente.denuncia}
                      />

                      <CustomTab
                        eventKey="formulario"
                        title="Formulario"
                        isVisible
                      />

                      <CustomTab
                        eventKey="constataciones"
                        title="Constataciones"
                        isVisible
                      />

                      <CustomTab
                        eventKey="transacciones"
                        title="Cobros"
                        isVisible
                      />
                    </Nav>
                  </Tab.Container>
                </div>
              </Card.Header>
              <Card.Body className="pt-0">
                <CustomContentBodyFiscalizacion
                  expediente={expediente}
                  fiscalizacion={fiscalizacion}
                  actualKey={key}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} xl={3}>
            <Row>
              <Col xs={6} xl={12}>
                <Notes
                  notes={fiscalizacion.notas || []}
                  fiscalizacionId={fiscalizacion.id}
                  expedienteId={expediente.id}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  ) : null;
};

export default Fiscalizacion;
