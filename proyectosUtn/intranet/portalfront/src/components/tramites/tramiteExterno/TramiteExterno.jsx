import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Turnos from 'components/appointments/Turnos';
import React, { useEffect, useState } from 'react';
import { Alert, Card, Nav, Spinner, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getTramiteExterno } from 'redux/actions/tramite';
import CustomTab from '../common/CustomTab';
import InputsInternos from '../inputComponents/InputsInternos';
import ProcedureAccordion from '../inputComponents/ProcedureAccordion';

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

const TramiteExterno = () => {
  const { id } = useParams();

  const { tramiteExterno: tramite, error } = useSelector(
    state => state.tramiteReducer
  );
  const dispatch = useDispatch();

  useEffect(async () => {
    dispatch(getTramiteExterno(id));
  }, [id]);

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
      case 'turno':
        return <Turnos puedePedirTurno={puedePedirTurno} />;
    }
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

      <h5 className="mb-2">Tramite Nº {tramite.id}</h5>
      {tramite && tramite?.estado === 'cancelado' ? (
        <Alert variant="danger" className="mb-2">
          <Alert.Heading>Tramite cancelado</Alert.Heading>
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
                  eventKey="turno"
                  title="Turno"
                  isVisible={
                    !!tramite.turno?.length || puedePedirTurno(tramite)[0]
                  }
                  isBadge={puedePedirTurno(tramite)[0]}
                />
              </Nav>
            </Tab.Container>
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

export default TramiteExterno;
