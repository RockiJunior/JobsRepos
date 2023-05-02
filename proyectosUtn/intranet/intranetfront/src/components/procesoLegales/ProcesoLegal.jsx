import CustomTab from 'components/common/CustomTab';
import CustomBreadcrumb from 'components/varios/messages/CustomBreadcrumb';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Nav, Row, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { expedienteGetById } from 'redux/actions/expediente';
import { procesoLegalCancelar } from 'redux/actions/procesoLegales';
import { AlertInfo } from './AlertInfo';
import ProcesoLegalActions from './components/actions/ProcesoLegalActions';
import Notes from './components/notes/Notes';
import {
  canAddArchivo,
  canAddImputaciones,
  canAddDictamen,
  canAddFallos,
  canAddInforme,
  canAddResolucion,
  canCancel,
  canGenerateCedula,
  canGoNextStep,
  canGoPrevStep,
  canOnlyApproveOrReject,
  canOnlyApprove
} from './ProcesoLegalCheckers';
import { ProcesoLegalContentBody } from './ProcesoLegalContentBody';
import areas from 'data/areas';

const ProcesoLegal = () => {
  const { expedienteId, procesoLegalId } = useParams();
  const dispatch = useDispatch();

  const { expediente } = useSelector(state => state.expedienteReducer);
  const { user } = useSelector(state => state.authReducer);

  const [procesoLegal, setProcesoLegal] = useState(null);

  const [canGenerateDocument, setCanGenerateDocument] = useState(false);

  const [key, setKey] = useState(
    localStorage.getItem('tpl')
      ? atob(localStorage.getItem('tpl'))
      : 'informacion'
  );
  const [actualSection, setActualSection] = useState(null);
  const goToSection = section => {
    setActualSection(section);
  };

  useEffect(() => {
    localStorage.setItem('tpl', btoa(key));
  }, [key]);

  useEffect(() => {
    dispatch(expedienteGetById(expedienteId));
  }, []);

  useEffect(() => {
    expediente?.id &&
      setProcesoLegal(
        expediente.procesosLegales.find(
          procesoLegal => procesoLegal.id === Number(procesoLegalId)
        )
      );
  }, [expediente]);

  useEffect(() => {
    if (procesoLegal) {
      const lpl = localStorage.getItem('lpl');

      if (lpl && atob(lpl) != procesoLegal.id) {
        setKey('informacion');
      }

      localStorage.setItem('lpl', btoa(procesoLegal.id));

      const canGenerateDocument =
        canAddArchivo(procesoLegal, user)[0] ||
        canAddFallos(procesoLegal, user) ||
        canAddDictamen(procesoLegal, user) ||
        canAddResolucion(procesoLegal, user) ||
        canAddImputaciones(procesoLegal, user) ||
        canGenerateCedula(procesoLegal, user)[0] ||
        canAddInforme(procesoLegal, user);

      setCanGenerateDocument(canGenerateDocument);
    }
  }, [procesoLegal]);

  return expediente && procesoLegal ? (
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
              name: 'Proceso Legal Nº ' + procesoLegal.id,
              path: `/expedientes/${expedienteId}/procesos_legales/${procesoLegalId}`,
              active: true
            }
          ]}
        />

        <Row className="mb-2 mt-3">
          <Col>
            <div className="mb-2 mt-3 d-flex justify-content-between">
              <div>
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
                >
                  Proceso Legal Nº {procesoLegal.id}
                </h5>
              </div>

              {procesoLegal.estado !== 'cancelado' &&
                procesoLegal.estado !== 'finalizado' &&
                procesoLegal.estado !== 'no_ratificado' &&
                procesoLegal.estado !== 'desestimado' && (
                  <ProcesoLegalActions
                    canGoNextStep={canGoNextStep(procesoLegal, user)}
                    canGoPrevStep={canGoPrevStep(procesoLegal, user)}
                    canOnlyApproveOrReject={
                      canOnlyApproveOrReject(procesoLegal, user, expediente)[0]
                    }
                    approveRejectTitle={
                      canOnlyApproveOrReject(procesoLegal, user, expediente)[1]
                    }
                    expediente={expediente}
                    goToSection={goToSection}
                    procesoLegal={procesoLegal}
                    canOnlyApprove={
                      canOnlyApprove(procesoLegal, user, expediente)[0]
                    }
                    onlyApproveTitle={
                      canOnlyApprove(procesoLegal, user, expediente)[1]
                    }
                  />
                )}
            </div>
          </Col>
        </Row>

        <Row className="g-3">
          <Col xs={12} xl={9}>
            <AlertInfo procesoLegal={procesoLegal} />

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
                        eventKey="denuncia"
                        title="Denuncia"
                        isVisible={!!expediente.denuncia}
                      />

                      <CustomTab
                        eventKey="acciones"
                        title="Generar Documentos"
                        isVisible={
                          canGenerateDocument &&
                          procesoLegal.estado !== 'finalizado' &&
                          procesoLegal.estado !== 'cancelado' &&
                          procesoLegal.estado !== 'no_ratificado' &&
                          procesoLegal.estado !== 'desestimado'
                        }
                        isBadge={canGenerateDocument}
                      />

                      <CustomTab
                        eventKey="informacion"
                        title="Documentos"
                        isVisible
                      />
                    </Nav>
                  </Tab.Container>

                  {canCancel(procesoLegal) &&
                    procesoLegal.estado !== 'cancelado' &&
                    user.empleado.areaId === areas.legales && (
                      <Button
                        size="sm"
                        variant="danger"
                        className="mb-3"
                        onClick={async () => {
                          await dispatch(procesoLegalCancelar(procesoLegal.id));
                          await dispatch(expedienteGetById(expedienteId));
                        }}
                      >
                        Cancelar Proceso Legal
                      </Button>
                    )}
                </div>
              </Card.Header>
              <Card.Body className="pt-0">
                <ProcesoLegalContentBody
                  actualKey={key}
                  actualSection={actualSection}
                  expediente={expediente}
                  goToSection={goToSection}
                  setKey={setKey}
                  procesoLegal={procesoLegal}
                  user={user}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} xl={3}>
            <Notes
              notes={procesoLegal.notas || []}
              procesoLegalId={procesoLegal.id}
              expedienteId={expediente.id}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  ) : null;
};

export default ProcesoLegal;
