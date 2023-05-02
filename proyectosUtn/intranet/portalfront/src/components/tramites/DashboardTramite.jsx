import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Card, Nav, Spinner, Tab } from 'react-bootstrap';
import Transacciones from './common/Transacciones';
import ProcedureAccordion from 'components/tramites/inputComponents/ProcedureAccordion';
import Turnos from 'components/appointments/Turnos';
import {
  tramiteCancelar,
  tramiteGetById,
  tramiteGetByUserId
} from 'redux/actions/tramite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InputsInternos from './inputComponents/InputsInternos';
import './DashboardTramite.css';
import CustomTab from './common/CustomTab';

const getDocumentation = (tramite, tipoTramite, cantAddData) => {
  const pasoActual = tramite.pasoActual;
  const paso = tipoTramite.pasos[pasoActual];

  if (
    paso.actions &&
    paso.actions.some(action => action.includes('interno/'))
  ) {
    const interno = paso.actions.find(action => action.includes('interno/'));
    const [, tipo] = interno.split('/');

    const seccion = tipoTramite.secciones.find(
      seccion => seccion.tipo === 'interno'
    );
    const inputs = seccion.inputs.filter(input => input.nombre === tipo);

    return <InputsInternos inputs={inputs} tramiteId={tramite.id} />;
  } else {
    return (
      <ProcedureAccordion
        secciones={tipoTramite.secciones}
        tramiteId={tramite.id}
        cantAddData={cantAddData}
      />
    );
  }
};

const DashboardTramite = () => {
  const { tramite, error } = useSelector(state => state.tramiteReducer);
  const { user } = useSelector(state => state.authReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [key, setKey] = useState('documentacion');

  const puedePedirTurno = tramite => {
    const actions = tramite.tipo.pasos[tramite.pasoActual].actions;

    if (actions) {
      for (const item of actions) {
        const [action, type] = item.split('/');
        if (action === 'appointment') {
          return [true, Number(type)];
        }
      }
    }

    return [false, null];
  };

  const cantAddData = tramite => {
    const actions = tramite.tipo.pasos[tramite.pasoActual].actions;

    return actions?.includes('cantAddDataUser');
  };

  const handleContentCardBody = tipoTramite => {
    switch (key) {
      case 'documentacion':
        return getDocumentation(tramite, tipoTramite, cantAddData(tramite));
      case 'pago':
        return <Transacciones />;
      // case 'historial':
      //   return <HistorialContent historial={tramite.historial} />;
      case 'turno':
        return <Turnos puedePedirTurno={puedePedirTurno} />;
    }
  };

  useEffect(() => {
    dispatch(tramiteGetById(id));
  }, [id]);

  const canCancel = tramite => {
    const pasoActual = tramite.pasoActual;
    const paso = tramite.tipo.pasos[pasoActual];
    return (
      paso.actions &&
      paso.actions.some(action => action.includes('canCancel')) &&
      (tramite.tipo.puedeIniciar === 'usuario' ||
        tramite.tipo.puedeIniciar === 'ambos')
    );
  };

  return tramite ? (
    <div className="container">
      <h4
        style={{
          fontWeight: 700,
          marginTop: '20px'
        }}
      >
        {tramite.tipo.titulo}
      </h4>

      <h5 className="mb-2">Trámite Nº {tramite.numero}</h5>
      {tramite && tramite?.estado === 'cancelado' ? (
        <Alert variant="danger" className="mb-2">
          <Alert.Heading>Trámite cancelado</Alert.Heading>
        </Alert>
      ) : tramite.tipo.secciones.some(
          seccion => seccion.estado === 'request'
        ) ? (
        <Alert variant="warning" className="mb-2">
          <Alert.Heading>
            Solicitud de modificaciones en la documentación
          </Alert.Heading>
          <p>
            Se han solicitado modificaciones en la documentación presentada. Por
            favor, revise la documentación y vuelva a enviarla.
          </p>
        </Alert>
      ) : (
        <Alert
          variant={tramite.tipo.pasos[tramite.pasoActual].variant}
          className="mb-2"
        >
          <Alert.Heading>
            {tramite.tipo.pasos[tramite.pasoActual].title}
          </Alert.Heading>
          {tramite.tipo.pasos[tramite.pasoActual].description
            .split('#')
            .map((text, index) => {
              switch (text) {
                case 'asterisco':
                  return (
                    <FontAwesomeIcon
                      key={index}
                      className="text-danger fs--2"
                      icon="asterisk"
                    />
                  );

                case 'nroMatricula':
                  return <strong>{user.matricula[0]?.id}</strong>;

                default:
                  return (
                    <span
                      key={index}
                      dangerouslySetInnerHTML={{ __html: text }}
                    />
                  );
              }
            })}
        </Alert>
      )}

      <Card className="bg-white">
        <Card.Header className="pb-0">
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
                  eventKey="documentacion"
                  title="Documentación"
                  isVisible
                />

                <CustomTab
                  eventKey="pago"
                  title="Pagos"
                  isVisible={!!tramite?.transacciones.length}
                  isBadge={tramite?.transacciones.some(
                    transaction =>
                      transaction.estado === 'pending' ||
                      transaction.estado === 'request'
                  )}
                />

                {/* <CustomTab eventKey="historial" title="Historial" isVisible /> */}

                <CustomTab
                  eventKey="turno"
                  title="Turno"
                  isVisible={
                    !!tramite.turno?.length || puedePedirTurno(tramite)[0]
                  }
                  isBadge={puedePedirTurno(tramite)[0]}
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
                  await dispatch(tramiteGetByUserId(user.id));
                  navigate('/tramites');
                }}
              >
                Cancelar Tramite
              </Button>
            )}
          </div>
        </Card.Header>
        <Card.Body className="pt-0">
          {handleContentCardBody(tramite.tipo)}
        </Card.Body>
      </Card>
    </div>
  ) : !error ? (
    <Spinner animation="border" />
  ) : (
    <h1 className="mt-3 text-center">{error.response.data.message}</h1>
  );
};

export default DashboardTramite;
