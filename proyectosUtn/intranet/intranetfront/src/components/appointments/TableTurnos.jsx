import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import esLocale from '@fullcalendar/core/locales/es';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CustomCard } from 'components/common/CustomCard';
import SoftBadge from 'components/common/SoftBadge';
import CustomMessage from 'components/varios/messages/CustomMessage';
import dayjs from 'dayjs';
import { months, weekdays } from 'dayjs/locale/es';
import updateLocale from 'dayjs/plugin/updateLocale';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip
} from 'react-bootstrap';
import { IoCalendarClearOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { capitalize } from 'utils/capitalize';
import AppointmentActions from './AppointmentActions';
import classNames from 'classnames';
dayjs.extend(updateLocale);

dayjs.updateLocale('es', {
  months: months.map(m => m.charAt(0).toUpperCase() + m.slice(1)),
  weekdays: weekdays.map(w => w.charAt(0).toUpperCase() + w.slice(1))
});

const estados = {
  pending: 'Pendiente',
  approved: 'Finalizado',
  rejected: 'Reprogramado'
};

const motivos = {
  abonar_arancel: 'Abonar Arancel',
  acta_requerimiento: 'Acta de Requerimiento',
  calco_carteleria_ocasional: 'Calco para Cartelería Ocasional',
  carta_documento: 'Carta Documento',
  cedula_notificacion: 'Cédula de Notificación',
  declaracion_jurada_abstencion: 'Declaración Jurada Abstención',
  inspecciones: 'Inspecciones',
  licencia_pasividad_2023: 'Licencia por Pasividad 2023',
  notificacion_citacion_aviso_visita:
    'Notificación / Citación / Aviso de visita',
  retiro_certificado_habilitacion_profesional:
    'Retiro de Certificado de Habilitacion Profesional',
  retiro_listado_infractor: 'Retiro del listado de infractor',
  vista_expediente: 'Vista de Expediente'
};

export const TableTurnos = ({ turnos, areaName, areaId }) => {
  const calendarRef = useRef();

  const [calendarApi, setCalendarApi] = useState({});
  const [title, setTitle] = useState(' ');
  const [day, setDay] = useState(dayjs());
  const [dayEvents, setDayEvents] = useState([]);

  useEffect(() => {
    setCalendarApi(calendarRef.current?.getApi());
  }, []);

  useEffect(() => {
    setDayEvents(
      turnos.filter(
        turno =>
          dayjs(turno.inicio).format('DD/MM/YYYY') === day.format('DD/MM/YYYY')
      )
    );
  }, [turnos]);

  useEffect(() => {
    calendarApi.getCurrentData &&
      setTitle(calendarApi.getCurrentData().viewTitle);
  }, [calendarApi]);

  return (
    <CustomCard
      icon="table-cells"
      title={areaName ? `Área de ${capitalize(areaName)}` : 'Turnos del área'}
      style={{ minHeight: 'calc(100vh - 126px)' }}
    >
      <Row className="g-3">
        <Col lg={7}>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <Card.Title>{title[0].toUpperCase() + title.slice(1)}</Card.Title>

            <div className="order-md-1">
              <OverlayTrigger
                overlay={<Tooltip id="nextTooltip">Anterior</Tooltip>}
              >
                <Button
                  variant="falcon-default"
                  size="sm"
                  className="me-1"
                  onClick={() => {
                    calendarApi.prev();
                    setTitle(calendarApi.getCurrentData().viewTitle);
                  }}
                >
                  <FontAwesomeIcon icon="chevron-left" />
                </Button>
              </OverlayTrigger>
              <Button
                size="sm"
                variant="falcon-default"
                onClick={() => {
                  calendarApi.today();
                  setTitle(calendarApi.getCurrentData().viewTitle);
                }}
                className="px-sm-4"
              >
                Hoy
              </Button>
              <OverlayTrigger
                overlay={<Tooltip id="nextTooltip">Siguiente</Tooltip>}
              >
                <Button
                  variant="falcon-default"
                  size="sm"
                  className="ms-1"
                  onClick={() => {
                    calendarApi.next();
                    setTitle(calendarApi.getCurrentData().viewTitle);
                  }}
                >
                  <FontAwesomeIcon icon="chevron-right" />
                </Button>
              </OverlayTrigger>
            </div>
          </Card.Header>

          <Card.Body>
            <FullCalendar
              ref={calendarRef}
              headerToolbar={false}
              plugins={[dayGridPlugin, interactionPlugin]}
              themeSystem="bootstrap"
              locale={esLocale}
              height="auto"
              dayCellClassNames="cursor-pointer"
              dayHeaderContent={day => {
                return day.text[0].toUpperCase() + day.text.slice(1);
              }}
              selectable={true}
              select={day => {
                setDayEvents(
                  turnos.filter(
                    turno =>
                      dayjs(turno.inicio).format('DD/MM/YYYY') ===
                      dayjs(day.start).format('DD/MM/YYYY')
                  )
                );
                setDay(dayjs(day.start));
              }}
              fixedWeekCount={false}
              dayMaxEventRows={3}
              dayCellContent={day => {
                const dayEvents = turnos.filter(
                  turno =>
                    dayjs(turno.inicio).format('DD/MM/YYYY') ===
                    dayjs(day.date).format('DD/MM/YYYY')
                );

                return (
                  <>
                    <div className="fc-daygrid-day-number">
                      {day.dayNumberText}
                    </div>
                    {dayEvents.length ? (
                      <div className="fc-daygrid-day-events">
                        <SoftBadge bg="primary" className="mb-1 fs--2">
                          {dayEvents.length}
                        </SoftBadge>
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                );
              }}
            />
          </Card.Body>
        </Col>

        <Col lg={5} className="pt-3">
          <div className="px-3">
            <h4 className="mb-0 fs-0 fs-sm-1 fs-lg-2 text-center">
              {day.format('dddd DD [de] MMMM [de] YYYY')}
            </h4>

            <ul
              className="list-unstyled mt-3 scrollbar management-calendar-events ask-analytics"
              id="management-calendar-events"
              style={{
                maxHeight: 'calc(100vh - 202px)',
                overflow: 'scroll'
              }}
            >
              {dayEvents.length ? (
                dayEvents.map((event, index) => (
                  <li
                    className={
                      'border-top py-3 cursor-pointer ask-analytics-item d-flex align-items-center' +
                      (index === dayEvents.length - 1 ? ' border-bottom' : '')
                    }
                    key={event.id}
                  >
                    <div
                      className={`border-start border-3 ps-3 mt-1 border-${event.color}`}
                      style={{ flexGrow: 1 }}
                    >
                      <p className="fs--1 mb-0">
                        <strong>
                          {dayjs(event.inicio).format('HH:mm') || ''}{' '}
                          {event.fin ? '- ' : ''}
                          {dayjs(event.fin).format('HH:mm') || ''}
                        </strong>
                      </p>

                      <h5 className="mb-1 fw-semi-bold text-800">
                        {event.usuario
                          ? event.usuario.nombre + ' ' + event.usuario.apellido
                          : event.info.nombreTitular +
                            ' ' +
                            event.info.apellidoTitular}
                      </h5>

                      <h6 className="mb-1 fw-semi-bold text-700">
                        {event.tramite?.tipo.titulo || event.info.motivo
                          ? motivos[event.info.motivo]
                          : ''}
                      </h6>

                      <SoftBadge
                        bg={classNames({
                          primary: event.estado === 'pending',
                          success: event.estado === 'approved',
                          danger: event.estado === 'rejected'
                        })}
                        className="mb-1 fs--2"
                      >
                        {estados[event.estado]}
                      </SoftBadge>

                      {event.tramite && (
                        <Link to={`/tramites/${event.tramite.id}`}>
                          Ir al tramite <FontAwesomeIcon icon="arrow-right" />
                        </Link>
                      )}
                    </div>

                    {!event.tramite && event.estado === 'pending' && (
                      <AppointmentActions turnoId={event.id} areaId={areaId} />
                    )}
                  </li>
                ))
              ) : (
                <CustomMessage
                  ReactIcon={IoCalendarClearOutline}
                  title="Atención!"
                  message="En este momento no hay turnos asignados para este día."
                />
              )}
            </ul>
          </div>
        </Col>
      </Row>
    </CustomCard>
  );
};
TableTurnos.propTypes = {
  turnos: PropTypes.array,
  areaName: PropTypes.string,
  areaId: PropTypes.number
};
