import React, { useEffect } from 'react';
import ActionsWrapper from 'components/common/ActionsWrapper';
import { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Nav,
  Row,
  Spinner,
  Tab
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CustomTab from 'components/common/CustomTab';
import {
  cedulaGetById,
  actualizarFechaRecepcion,
  cedulaGetRelations
} from 'redux/actions/cedula';
import GotoNextStep from './components/actions/GotoNextStep';
import Informes from './components/informe/Informes';
import Notes from './components/notes/Notes';
import Inicio from './components/inicio/Inicio';
import axios from 'axios';
import Relations from './components/relations/Relations';

const Cedula = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cedula, error, relations } = useSelector(
    state => state.cedulaReducer
  );

  const { user } = useSelector(state => state.authReducer);

  const [key, setKey] = useState('inicio');
  const [openModal, setOpenModal] = useState(false);

  const canGoNextStep = () => {
    const action = cedula.pasos[cedula.pasoActual]?.actions?.find(action =>
      action.includes('canGoNextStep')
    );

    if (action) {
      const [, area] = action.split('/');

      return Number(area) === user.empleado.areaId;
    }
    return false;
  };

  const canAddInforme = () => {
    const pasoActual = cedula.pasos[cedula.pasoActual];
    if (
      pasoActual.actions?.length &&
      pasoActual.actions.includes(`canAddInformes/${user?.empleado?.areaId}`)
    ) {
      return true;
    }
    return false;
  };

  const handleContentCardBody = () => {
    switch (key) {
      case 'inicio':
        return <Inicio cedula={cedula} />;

      case 'informes':
        return <Informes canAddInforme={canAddInforme} />;

      case 'relaciones':
        return <Relations cedula={cedula} relations={relations} />;
    }
  };

  useEffect(() => {
    dispatch(cedulaGetById(id));
  }, [id]);

  useEffect(() => {
    cedula?.id && dispatch(cedulaGetRelations(cedula.id));
  }, [cedula]);

  return cedula ? (
    <Card style={{ boxShadow: 'none' }}>
      <Card.Body className="py-0">
        <div className="mb-2 mt-3 d-flex justify-content-between">
          <div>
            <h4>Cedula Nº {cedula.numero}</h4>
            {cedula.empleadoId === user.id && (
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
                Desasignarme la cédula
              </Button>
            )}
          </div>

          <ActionsWrapper>
            {[
              canGoNextStep() && (
                <GotoNextStep
                  key={'kljdgbboaskdlgfbaskdlgfjblikuygvealkjfhyavsfdlukyjf'}
                  cedulaId={cedula.id}
                  pasos={cedula.pasos}
                  pasoActual={cedula.pasoActual}
                />
              )
            ]}
          </ActionsWrapper>
        </div>

        <Row className="g-3">
          <Col xs={12} xl={9}>
            <Card className="bg-white">
              <Card.Header className="d-flex justify-content-between">
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
                      <CustomTab eventKey="inicio" title="Inicio" isVisible />

                      <CustomTab
                        eventKey="informes"
                        title="Informes"
                        isVisible={cedula.informes.length || canAddInforme()}
                        isBadge={canAddInforme()}
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
                    </Nav>
                  </Tab.Container>
                </div>
                <Form.Group
                  className="d-flex flex-column align-items-center"
                  style={{ width: 'fit-content' }}
                >
                  <Form.Check
                    type="switch"
                    className="m-0"
                    label="Entregada"
                    checked={!!cedula.fechaRecepcion}
                    onChange={async () => {
                      if (!cedula.fechaRecepcion) {
                        await dispatch(actualizarFechaRecepcion(cedula.id));
                        await dispatch(cedulaGetById(id));
                      }
                    }}
                  />
                </Form.Group>
              </Card.Header>
              <Card.Body className="pt-0">{handleContentCardBody()}</Card.Body>
            </Card>
          </Col>
          <Col xs={6} xl={3} className="d-flex">
            <Notes notes={cedula.notas || []} cedulaId={cedula.id} />
          </Col>
        </Row>
      </Card.Body>

      <Modal
        show={openModal}
        onHide={() => setOpenModal(false)}
        contentClassName="border"
        centered
      >
        <Modal.Header
          closeButton
          className="bg-light px-card border-bottom-0 d-flex align-items-start"
        >
          <Modal.Title as="h5">
            ¿Estás seguro que deseas desasignarte esta cédula?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <Button
              size="sm"
              variant="success"
              className="me-1"
              onClick={async () => {
                try {
                  setOpenModal(false);
                  await axios.put(
                    process.env.REACT_APP_SERVER +
                      '/cedula/desasignar_empleado/' +
                      cedula.id
                  );
                  navigate('/cedulas');
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              <span>Si</span>
            </Button>
            <Button
              className="ms-1"
              size="sm"
              variant="danger"
              onClick={() => setOpenModal(false)}
            >
              <span>No</span>
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Card>
  ) : !error ? (
    <Spinner animation="border" />
  ) : (
    <h1 className="mt-3 text-center">{error.response.data.message}</h1>
  );
};

export default Cedula;
