import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  tramiteCancelar,
  tramiteGetById,
  tramiteGetRelations
} from 'redux/actions/tramite';
import { turnosUpdateStatus } from 'redux/actions/turnos';
import { Button, Card, Col, Nav, Row, Spinner, Tab } from 'react-bootstrap';
import Notes from './components/notes/Notes';
import CustomTab from '../common/CustomTab';
import {
  puedePedirTurno,
  canGoPrevStep,
  canAddArchivo,
  canRejectTramite,
  canOnlyApproveOrReject,
  canOnlyApprove,
  useAppointmentStep,
  canRequestChanges,
  canGoNextStep,
  canAddInforme,
  canAddIntimacion,
  canAddDictamen,
  canGenerateCedula,
  canCancel,
  canApproveTramite,
  canAddResolucion
} from './TramiteCheckers';
import { ProcedureContentBody } from './ProcedureContentBody';
import { DesasignarTramiteModal } from './DesasignarTramiteModal';
import ProcedureActions from './components/actions/ProcedureActions';
import { AlertInfo } from './AlertInfo';

const Tramite = () => {
  const [key, setKey] = useState(
    localStorage.getItem('tt')
      ? atob(localStorage.getItem('tt'))
      : 'informacion'
  );

  useEffect(() => {
    localStorage.setItem('tt', btoa(key));
  }, [key]);

  const { id } = useParams();
  const dispatch = useDispatch();

  const { tramite, error, relations, loading } = useSelector(
    state => state.tramiteReducer
  );
  const { user } = useSelector(state => state.authReducer);

  useEffect(() => {
    const actions = tramite?.pasoActual?.acciones;

    if (actions) {
      const actionDefaultTab = actions.find(action =>
        action.includes('defaultTab')
      );

      const actualAreas = actions
        .filter(action => action.includes('sendTo'))
        .map(action => action.split('/')[1]);

      if (actionDefaultTab && actualAreas.includes(`${user.empleado.areaId}`)) {
        const tab = actionDefaultTab.split('/')[1];
        setKey(tab);
      }

      //____________________________________________________

      const actionCanRequestChanges = actions.find(action =>
        action.includes(`canRequestChanges/${user.empleado.areaId}`)
      );

      let someRequest = false;

      tramite.tipo.secciones.forEach(seccion =>
        seccion.inputs.forEach(input => {
          if (input.InputValues?.estado === 'request') someRequest = true;
        })
      );

      if (actionCanRequestChanges && someRequest) {
        setRequestModification(true);
      }
    }
  }, [tramite?.pasoActual]);

  const [openModal, setOpenModal] = useState(false);
  const [requestModification, setRequestModification] = useState(false);

  const [actualSection, setActualSection] = useState(null);
  const goToSection = section => {
    setActualSection(section);
  };

  const handleAppointmentState = async state => {
    const turno = tramite.turno.find(t => t.estado === 'pending');
    await dispatch(turnosUpdateStatus(state, turno.id));
    await dispatch(tramiteGetById(tramite.id));
  };

  useEffect(async () => {
    if (id) {
      dispatch(tramiteGetById(id));
    }
  }, [id]);

  useEffect(() => {
    tramite?.id && dispatch(tramiteGetRelations(tramite.id));

    if (tramite) {
      const lt = localStorage.getItem('lt');

      if (lt && atob(lt) != tramite.id) {
        setKey('informacion');
      }

      localStorage.setItem('lt', btoa(tramite.id));
    }
  }, [tramite]);

  const generateVirtualTab = () => {
    const pasoActual = tramite.tipo?.pasos[tramite.pasoActual];
    if (pasoActual.actions?.length) {
      const action = pasoActual.actions.find(action =>
        action.includes(`generateTab`)
      );
      if (action) {
        const [, title] = action.split('/');
        return [
          title,
          <CustomTab
            key="virtualTab"
            title={title}
            eventKey="virtualTab"
            isVisible
            isBadge
          />
        ];
      }
    }

    return [null, null];
  };

  return tramite && !loading ? (
    <div className="px-3">
      <div className="mb-2 mt-3 d-flex justify-content-between">
        <div>
          <h4
            style={{
              fontWeight: 700,
              width: 'fit-content'
            }}
          >
            {tramite.tipo.titulo}
          </h4>

          <h5>Tramite Nº {tramite.numero}</h5>

          {tramite.empleadoId === user.id && (
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
              Desasignarme el trámite
            </Button>
          )}
        </div>

        {tramite.estado === 'pendiente' && (
          <ProcedureActions
            tramite={tramite}
            canGoPrevStep={canGoPrevStep(tramite, user) && !requestModification}
            goToSection={goToSection}
            setKey={setKey}
            canRejectTramite={canRejectTramite(tramite, user)}
            canOnlyApproveOrReject={canOnlyApproveOrReject(tramite, user)[0]}
            approveRejectTitle={canOnlyApproveOrReject(tramite, user)[1]}
            canOnlyApprove={canOnlyApprove(tramite, user)[0]}
            onlyApproveTitle={canOnlyApprove(tramite, user)[1]}
            canUseAppointmentStep={useAppointmentStep(tramite, user)}
            setRequestModification={setRequestModification}
            handleAppointmentState={handleAppointmentState}
            requestModification={requestModification}
            canRequestChanges={canRequestChanges(tramite, user)}
            canGoNextStep={canGoNextStep(tramite, user) && !requestModification}
            canApproveTramite={canApproveTramite(tramite, user)[0]}
          />
        )}
      </div>

      <Row className="g-3">
        <Col xs={12} xl={9}>
          <AlertInfo tramite={tramite} />

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
                    {generateVirtualTab()[1]}

                    <CustomTab
                      eventKey="acciones"
                      title="Generar Documentos"
                      isVisible={
                        (canAddInforme(tramite, user) ||
                          canAddIntimacion(tramite, user) ||
                          canAddDictamen(tramite, user) ||
                          canGenerateCedula(tramite, user)[0] ||
                          canAddArchivo(tramite, user)[0] ||
                          canAddResolucion(tramite, user)) &&
                        tramite.estado === 'pendiente'
                      }
                      isBadge={
                        canAddInforme(tramite, user) ||
                        canAddIntimacion(tramite, user) ||
                        canAddDictamen(tramite, user) ||
                        canGenerateCedula(tramite, user)[0] ||
                        canAddArchivo(tramite, user)[0] ||
                        canAddResolucion(tramite, user)
                      }
                    />

                    <CustomTab
                      eventKey="informacion"
                      title="Información"
                      isVisible
                    />

                    <CustomTab
                      eventKey="turno"
                      title="Turno"
                      isVisible={
                        puedePedirTurno(tramite)[0] ||
                        !!tramite.turno?.some(t => t.estado === 'pending')
                      }
                      isBadge={puedePedirTurno(tramite)[0]}
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
                      eventKey="historial"
                      title="Historial"
                      isVisible
                    />

                    <CustomTab
                      title="Matriculado"
                      eventKey="matriculado"
                      isVisible={tramite.carpetaId}
                    />
                  </Nav>
                </Tab.Container>

                {canCancel(tramite) && tramite.estado !== 'cancelado' && (
                  <Button
                    size="sm"
                    variant="danger"
                    className="mb-3"
                    onClick={async () => {
                      await dispatch(tramiteCancelar(tramite.id));
                      await dispatch(tramiteGetById(tramite.id));
                    }}
                  >
                    Cancelar Tramite
                  </Button>
                )}
              </div>
            </Card.Header>

            <Card.Body className="pt-0">
              <ProcedureContentBody
                tramite={tramite}
                actualKey={key}
                actualSection={actualSection}
                goToSection={goToSection}
                requestModification={requestModification}
                virtualTabType={generateVirtualTab()[0]}
                relations={relations}
                user={user}
                setKey={setKey}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} xl={3}>
          <Row>
            <Col xs={6} xl={12}>
              <Notes notes={tramite.notaInterna || []} tramiteId={tramite.id} />
            </Col>
          </Row>
        </Col>
      </Row>

      <DesasignarTramiteModal
        tramiteId={tramite.id}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </div>
  ) : !error ? (
    <Spinner animation="border" />
  ) : (
    <h1 className="mt-3 text-center">{error.response.data.message}</h1>
  );
};

export default Tramite;
