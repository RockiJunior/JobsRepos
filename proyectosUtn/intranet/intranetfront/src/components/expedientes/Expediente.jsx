import CustomTab from 'components/common/CustomTab';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Nav, Row, Spinner, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  expedienteGetById,
  expedienteGetRelations
} from 'redux/actions/expediente';
/* import { AlertInfo } from './AlertInfo'; */
import Notes from './components/notes/Notes';
import { DesasignarExpedienteModal } from './DesasignarExpedienteModal';
import { ExpedienteContentBody } from './ExpedienteContentBody';
import { ExpedienteActions } from './components/actions/ExpedienteActions';
import CustomBreadcrumb from 'components/varios/messages/CustomBreadcrumb';
import areas from 'data/areas';
import { AlertInfo } from './AlertInfo';

const Expediente = () => {
  const [key, setKey] = useState(
    localStorage.getItem('te') ? atob(localStorage.getItem('te')) : 'denuncia'
  );

  useEffect(() => {
    localStorage.setItem('te', btoa(key));
  }, [key]);

  const { id } = useParams();
  const dispatch = useDispatch();
  const { expediente, error, relations } = useSelector(
    state => state.expedienteReducer
  );
  const { user } = useSelector(state => state.authReducer);

  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    dispatch(expedienteGetById(id));
  }, []);

  useEffect(() => {
    expediente?.id && dispatch(expedienteGetRelations(expediente.id));

    if (expediente) {
      const le = localStorage.getItem('le');

      if (le && atob(le) != expediente.id) {
        setKey('informacion');
      }

      localStorage.setItem('le', btoa(expediente.id));
    }
  }, [expediente]);

  const [actualSection, setActualSection] = useState(null);
  const goToSection = section => {
    setActualSection(section);
  };

  return expediente ? (
    <Card style={{ boxShadow: 'none' }}>
      <Card.Body className="py-0">
        <CustomBreadcrumb
          links={[
            { name: 'Expedientes en el area', path: '/expedientes_area' },
            {
              name: 'Expediente Nº ' + expediente.numero,
              path: `/expedientes/${expediente.id}`,
              active: true
            }
          ]}
        />

        <div className="mb-2 mt-3 d-flex justify-content-between align-items-end">
          <div>
            <Row>
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
              </Col>
            </Row>

            <Row>
              <Col className="d-flex justify-content-start">
                {expediente.empleadosAsignados.some(
                  e => e.usuarioId === user.id
                ) &&
                  expediente.estado !== 'finalizado' &&
                  expediente.estado !== 'archivado' && (
                    <Button
                      bg="warning"
                      variant="outline-primary"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: 'auto',
                        whiteSpace: 'nowrap'
                      }}
                      className="fs--1 p-0 px-1"
                      onClick={() => setOpenModal(true)}
                    >
                      Desasignarme el expediente
                    </Button>
                  )}
              </Col>
            </Row>
          </div>

          {expediente.estado !== 'finalizado' &&
            expediente.estado !== 'archivado' &&
            expediente.areas.find(area => !area.deleted)?.areaId ===
              user.empleado.areaId && (
              <ExpedienteActions
                userAreaId={user.empleado.areaId}
                expediente={expediente}
                setKey={setKey}
              />
            )}
        </div>
        <Row className="g-3">
          <Col xs={12} xl={9}>
            <AlertInfo expediente={expediente} />

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
                        eventKey="acciones"
                        title="Generar Documentos"
                        isVisible={
                          expediente.estado !== 'finalizado' &&
                          expediente.estado !== 'archivado'
                        }
                      />

                      <CustomTab
                        eventKey="informacion"
                        title="Documentos"
                        isVisible
                      />

                      <CustomTab
                        eventKey="fiscalizaciones"
                        title="Fiscalizaciones"
                        isVisible={!!expediente.fiscalizaciones.length}
                        isBadge={
                          expediente.fiscalizaciones.some(
                            fiscalizacion =>
                              fiscalizacion.estado !== 'finalizada' &&
                              fiscalizacion.estado !== 'cancelada'
                          ) && user.empleado.areaId === areas.fiscalizacion
                        }
                      />

                      <CustomTab
                        eventKey="procesosLegales"
                        title="Procesos Legales"
                        isVisible={!!expediente.procesosLegales.length}
                        isBadge={
                          expediente.procesosLegales.some(
                            fiscalizacion =>
                              fiscalizacion.estado !== 'finalizado' &&
                              fiscalizacion.estado !== 'cancelado'
                          ) && user.empleado.areaId === areas.legales
                        }
                      />

                      <CustomTab
                        eventKey="matriculado"
                        title="Matriculado"
                        isVisible={expediente.carpetaId && !expediente.denuncia}
                      />

                      <CustomTab
                        eventKey="relaciones"
                        title="Trámites Relacionados"
                        isVisible={
                          !!relations?.tramitesHijos?.length ||
                          !!relations?.expedientesHijos?.length ||
                          !!relations?.cedulas?.length
                        }
                      />

                      <CustomTab
                        eventKey="denuncia"
                        title="Denuncia"
                        isVisible={expediente.denuncia}
                      />

                      <CustomTab
                        eventKey="historial"
                        title="Historial"
                        isVisible
                      />
                    </Nav>
                  </Tab.Container>
                </div>
              </Card.Header>
              <Card.Body className="pt-0">
                <ExpedienteContentBody
                  relations={relations}
                  actualKey={key}
                  actualSection={actualSection}
                  expediente={expediente}
                  goToSection={goToSection}
                  setKey={setKey}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} xl={3}>
            <Row>
              <Col xs={6} xl={12}>
                <Notes
                  notes={expediente.notas || []}
                  expedienteId={expediente.id}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card.Body>

      <DesasignarExpedienteModal
        open={openModal}
        setOpen={setOpenModal}
        expedienteId={expediente.id}
      />
    </Card>
  ) : !error ? (
    <Spinner animation="border" />
  ) : (
    <h1 className="mt-3 text-center">{error.response.data.message}</h1>
  );
};

export default Expediente;
