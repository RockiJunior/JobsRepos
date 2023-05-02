import { TableTurnos } from 'components/appointments/TableTurnos';
import areas from 'data/areas';
import React, { useEffect } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { turnosGetAllAreas } from 'redux/actions/turnos';
import { IoCalendarClearOutline } from 'react-icons/io5';
import CustomMessage from 'components/varios/messages/CustomMessage';
/* import CustomBreadcrumb from 'components/messages/CustomBreadcrumb'; */
import SectionTitle from 'components/common/SectionTitle';

const TurnosSA = () => {
  const dispatch = useDispatch();
  const { turnosAreas } = useSelector(state => state.turnosReducer);

  useEffect(() => {
    dispatch(turnosGetAllAreas());
  }, []);

  const areasNames = Object.keys(areas).reduce(
    (acc, key) => ({
      ...acc,
      [areas[key]]: key
    }),
    {}
  );

  /* const breadcrumb = [
    { name: 'Home', path: '/home', active: false },
    { name: 'Turnos', path: '/turnos', active: true }
  ]; */

  return (
    <>
      {/* <CustomBreadcrumb links={breadcrumb} /> */}
      <SectionTitle
        title="Gestión de Turnos"
        subtitle="Visualice los turnos asignados."
        icon="calendar"
        className="pb-2"
      />
      {Object.keys(turnosAreas).length ? (
        <Row className="g-3">
          {Object.keys(turnosAreas).map(key => {
            const area = turnosAreas[key];
            return (
              <Col xs={12} key={key} className="mt-2">
                <TableTurnos turnos={area} areaName={areasNames[key]} />
              </Col>
            );
          })}
        </Row>
      ) : (
        <Card className="bg-white">
          <CustomMessage
            ReactIcon={IoCalendarClearOutline}
            title="Atención!"
            message="En este momento no hay turnos asignados a ningún área."
          />
        </Card>
      )}
    </>
  );
};

export default TurnosSA;
