import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomTab from 'components/common/CustomTab';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Button, Card, Nav, Tab } from 'react-bootstrap';
import { checkPermissions } from 'utils/checkPermissionsArea';
import CreateEventModal from './EventModal';
import { EventsTable } from './EventsTable';
import { ListaEspera } from './ListaEspera';
import permisosData from 'data/permisos';
import { useSelector } from 'react-redux';
import { CustomCard } from 'components/common/CustomCard';

const Events = () => {
  const { user } = useSelector(state => state.authReducer);

  const [show, setShow] = useState(false);
  const [key, setKey] = useState(null);

  const getContentBody = key => {
    switch (key) {
      case 'eventos':
        return checkPermissions(
          [permisosData.eventos.ver_eventos],
          user.empleado
        ) ? (
          <EventsTable />
        ) : null;
      case 'waitlist':
        return checkPermissions(
          [permisosData.eventos.ver_lista_espera],
          user.empleado
        ) ? (
          <ListaEspera />
        ) : null;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (checkPermissions([permisosData.eventos.ver_eventos], user.empleado)) {
      setKey('eventos');
    } else if (
      checkPermissions([permisosData.eventos.ver_lista_espera], user.empleado)
    ) {
      setKey('waitlist');
    }
  }, [user]);

  return (
    <>
      <CustomCard
        icon="calendar-check"
        title="Eventos"
        subtitle="Administre eventos"
      >
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Tab.Container
            activeKey={key}
            onSelect={k => setKey(k)}
            className="mb-1"
          >
            <Nav className="mb-1">
              <CustomTab
                eventKey="eventos"
                title="Eventos pendientes"
                isVisible={checkPermissions(
                  [permisosData.eventos.ver_eventos],
                  user.empleado
                )}
              />

              <CustomTab
                eventKey="waitlist"
                title="Lista de espera"
                isVisible={checkPermissions(
                  [permisosData.eventos.ver_lista_espera],
                  user.empleado
                )}
              />
            </Nav>
          </Tab.Container>
          {checkPermissions(
            [permisosData.eventos.crear_eventos],
            user.empleado
          ) && (
            <Button
              className="float-end"
              size="sm"
              onClick={() => setShow(true)}
            >
              Crear evento <FontAwesomeIcon icon="plus" />
            </Button>
          )}
        </Card.Header>

        <Card.Body className="pt-0">{getContentBody(key)}</Card.Body>
      </CustomCard>

      {checkPermissions(
        [permisosData.eventos.crear_eventos],
        user.empleado
      ) && <CreateEventModal show={show} setShow={setShow} />}
    </>
  );
};

export default Events;
