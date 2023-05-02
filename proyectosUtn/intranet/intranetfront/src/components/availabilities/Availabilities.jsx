import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  OverlayTrigger,
  Tooltip,
  Popover
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from 'components/common/IconButton';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import NewAvailabilityModal from './NewAvailabilityModal';
import { days, daysEs } from './days';
import {
  disponibilidadCreate,
  disponibilidadDelete,
  disponibilidadGetByArea,
  disponibilidadUpdate
} from 'redux/actions/disponibilidad';
import { checkPermissions } from 'utils/checkPermissionsArea';
import permisosData from 'data/permisos';
import { CustomCard } from 'components/common/CustomCard';

const Availabilities = ({ areaAvailabilities, areaId }) => {
  const dispatch = useDispatch();

  const { user } = useSelector(state => state.authReducer);

  const calendarAvailabilitiesRef = useRef();
  const trash = useRef();

  const [areaAvailabilitiesState, setAreaAvailabilitiesState] = useState(
    areaAvailabilities || []
  );
  const [title, setTitle] = useState('');
  const [calendarApi, setCalendarApi] = useState({});
  const [isOpenScheduleCard, setIsOpenScheduleCard] = useState(false);
  const [scheduleInfo, setScheduleInfo] = useState(null);
  const [scheduleStartDate, setScheduleStartDate] = useState();
  const [scheduleEndDate, setScheduleEndDate] = useState();
  const [events, setEvents] = useState([]);
  const [newAvailabilities, setNewAvailabilities] = useState([]);
  const [newEvents, setNewEvents] = useState([]);
  const [action, setAction] = useState(null);

  const eventTimeFormat = {
    hour: 'numeric',
    minute: '2-digit',
    omitZeroMinute: true,
    meridiem: true
  };

  const handleEventClick = info => {
    const schedule = areaAvailabilitiesState.find(
      availability => availability.id === Number(info.event.id)
    );

    const newAvailabilitie = newAvailabilities.find(
      availability => availability.id === Number(info.event.id)
    );

    setScheduleInfo(schedule || newAvailabilitie);
    setAction('edit');
    setIsOpenScheduleCard(true);
  };

  const handleClick = async event => {
    if (event.target.name === 'submit') {
      for (const na of newAvailabilities) {
        if (isNaN(na.id)) {
          await dispatch(
            disponibilidadCreate({
              nombre: na.title,
              areaId,
              inicio: na.start,
              fin: na.end,

              lun: {
                abierto: na.mon.open,
                intervalos: na.mon.interval.map(i => ({
                  inicio: i.from,
                  fin: i.to
                }))
              },
              mar: {
                abierto: na.tue.open,
                intervalos: na.tue.interval.map(i => ({
                  inicio: i.from,
                  fin: i.to
                }))
              },
              mie: {
                abierto: na.wed.open,
                intervalos: na.wed.interval.map(i => ({
                  inicio: i.from,
                  fin: i.to
                }))
              },
              jue: {
                abierto: na.thu.open,
                intervalos: na.thu.interval.map(i => ({
                  inicio: i.from,
                  fin: i.to
                }))
              },
              vie: {
                abierto: na.fri.open,
                intervalos: na.fri.interval.map(i => ({
                  inicio: i.from,
                  fin: i.to
                }))
              },
              sab: {
                abierto: na.sat.open,
                intervalos: na.sat.interval.map(i => ({
                  inicio: i.from,
                  fin: i.to
                }))
              },
              dom: {
                abierto: na.sun.open,
                intervalos: na.sun.interval.map(i => ({
                  inicio: i.from,
                  fin: i.to
                }))
              }
            })
          );
        } else {
          await dispatch(
            disponibilidadUpdate({
              id: na.id,
              nombre: na.title,
              areaId,
              inicio: na.start,
              fin: na.end,

              lun: {
                abierto: na.mon.open,
                intervalos: na.mon.interval.map(i => ({
                  inicio: i.from,
                  fin: i.to
                }))
              },
              mar: {
                abierto: na.tue.open,
                intervalos: na.tue.interval.map(i => ({
                  inicio: i.from,
                  fin: i.to
                }))
              },
              mie: {
                abierto: na.wed.open,
                intervalos: na.wed.interval.map(i => ({
                  inicio: i.from,
                  fin: i.to
                }))
              },
              jue: {
                abierto: na.thu.open,
                intervalos: na.thu.interval.map(i => ({
                  inicio: i.from,
                  fin: i.to
                }))
              },
              vie: {
                abierto: na.fri.open,
                intervalos: na.fri.interval.map(i => ({
                  inicio: i.from,
                  fin: i.to
                }))
              },
              sab: {
                abierto: na.sat.open,
                intervalos: na.sat.interval.map(i => ({
                  inicio: i.from,
                  fin: i.to
                }))
              },
              dom: {
                abierto: na.sun.open,
                intervalos: na.sun.interval.map(i => ({
                  inicio: i.from,
                  fin: i.to
                }))
              }
            })
          );
        }
      }
    }

    await dispatch(disponibilidadGetByArea(areaId));
    setNewAvailabilities([]);
    setNewEvents([]);
  };

  const handleAdd = () => {
    setAction('create');
    setIsOpenScheduleCard(true);
  };

  const handleDelete = async id => {
    if (isNaN(id)) {
      setNewAvailabilities(newAvailabilities.filter(na => na.id !== id));
      setIsOpenScheduleCard(false);
    } else {
      await dispatch(disponibilidadDelete(id));
      await dispatch(disponibilidadGetByArea(areaId));
      setIsOpenScheduleCard(false);
    }
  };

  const eventDragStop = async info => {
    const y1 = trash.current.getBoundingClientRect().top;
    const y2 = trash.current.getBoundingClientRect().bottom;
    const x1 = trash.current.getBoundingClientRect().left;
    const x2 = trash.current.getBoundingClientRect().right;

    const x = !info.jsEvent.changedTouches
      ? info.jsEvent.x
      : info.jsEvent.changedTouches[0].clientX;
    const y = !info.jsEvent.changedTouches
      ? info.jsEvent.y
      : info.jsEvent.changedTouches[0].clientY;

    if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
      await handleDelete(info.event.id);
    }
  };

  const eventDrop = info => {
    const schedule = areaAvailabilitiesState.find(
      availability => availability.id === Number(info.event.id)
    );

    setNewAvailabilities([
      ...newAvailabilities.filter(
        na =>
          na.id !==
          (isNaN(info.event.id) ? info.event.id : parseInt(info.event.id))
      ),
      {
        ...schedule,
        end: info.event.end,
        start: info.event.start
      }
    ]);
    setEvents(events.filter(e => e.id !== parseInt(info.event.id)));
  };

  useEffect(() => {
    setCalendarApi(calendarAvailabilitiesRef.current.getApi());
  }, []);

  useEffect(() => {
    !isOpenScheduleCard && setScheduleInfo(null);
  }, [isOpenScheduleCard]);

  useEffect(() => {
    areaAvailabilities && setAreaAvailabilitiesState(areaAvailabilities);
  }, [areaAvailabilities]);

  useEffect(() => {
    setEvents(
      areaAvailabilitiesState.map(sa => ({
        id: sa.id,
        title: sa.title,
        start: new Date(sa.start),
        end: new Date(sa.end),
        className: 'bg-primary text-white',
        allDay: true,
        overlap: false
      }))
    );
  }, [areaAvailabilitiesState]);

  useEffect(() => {
    setNewEvents(
      newAvailabilities.map(na => ({
        id: na.id,
        title: na.title,
        start: na.start,
        end: na.end,
        className: 'bg-warning',
        allDay: true,
        overlap: false
      }))
    );
  }, [newAvailabilities]);

  const popoverComoSeUsa = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">¿Cómo se usa?</Popover.Header>
      <Popover.Body>
        Podés arrastrar y seleccionar las fechas en que se puedan solicitar
        turnos.
        <br />
        <br />
        Si necesitás agregar mas días, podés editar manualmente el rango de
        fechas.
        <br />
        <br />
        Si necesitás eliminar una disponibilidad, podés arrastrarla a la
        papelera. (Esta acción no se puede deshacer)
      </Popover.Body>
    </Popover>
  );

  return (
    <div>
      <CustomCard
        style={{
          filter: isOpenScheduleCard ? 'blur(3px)' : ''
        }}
        icon="clock"
        title="Horarios de Atención"
      >
        <div style={{ maxWidth: 800 }}>
          <Card.Header className="d-flex justify-content-end">
            {checkPermissions(
              [permisosData.area.modificar_disponibilidad],
              user.empleado
            ) && (
              <div style={{ flexGrow: 1 }}>
                <IconButton
                  variant="primary"
                  iconClassName="me-2"
                  className="me-2"
                  icon="plus"
                  // transform="shrink-3"
                  size="sm"
                  onClick={handleAdd}
                >
                  Añadir Disponibilidad
                </IconButton>
              </div>
            )}
            <Button
              size="sm"
              onClick={() => {
                calendarApi.today();
                setTitle(calendarApi.getCurrentData().viewTitle);
              }}
            >
              Hoy
            </Button>
          </Card.Header>
          <Card.Header className="d-flex align-items-center justify-content-between py-2">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="nextTooltip">Anterior</Tooltip>}
            >
              <span>
                <Button
                  variant="link"
                  className="icon-item icon-item-sm icon-item-hover shadow-none p-0 me-1 ms-md-2"
                  onClick={() => {
                    calendarApi.prev();
                    setTitle(calendarApi.getCurrentData().viewTitle);
                  }}
                >
                  <FontAwesomeIcon icon="arrow-left" />
                </Button>
              </span>
            </OverlayTrigger>

            <h4 className="mb-0 fs-0 fs-sm-1 fs-lg-2">
              {title ||
                `${
                  calendarApi.currentDataManager?.data?.viewTitle[0].toUpperCase() +
                  calendarApi.currentDataManager?.data?.viewTitle.substring(1)
                }`}
            </h4>

            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="previousTooltip">Siguiente</Tooltip>}
            >
              <span>
                <Button
                  variant="link"
                  className="icon-item icon-item-sm icon-item-hover shadow-none p-0 me-lg-2"
                  onClick={() => {
                    calendarApi.next();
                    setTitle(calendarApi.getCurrentData().viewTitle);
                  }}
                >
                  <FontAwesomeIcon icon="arrow-right" />
                </Button>
              </span>
            </OverlayTrigger>
          </Card.Header>

          <Card.Body className="p-0">
            <FullCalendar
              ref={calendarAvailabilitiesRef}
              locale={esLocale}
              headerToolbar={false}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              themeSystem="bootstrap"
              dayMaxEvents={1}
              aspectRatio={1}
              fixedWeekCount={false}
              height={'auto'}
              stickyHeaderDates={false}
              editable
              selectable
              selectMirror
              select={info => {
                setIsOpenScheduleCard(true);
                setAction('create');
                setScheduleStartDate(info.start);
                setScheduleEndDate(info.end);
              }}
              eventTimeFormat={eventTimeFormat}
              eventClick={handleEventClick}
              events={[...events, ...newEvents]}
              eventDragStop={eventDragStop}
              selectOverlap={false}
              eventResizableFromStart={true}
              eventDrop={eventDrop}
              eventResize={eventDrop}
            />
          </Card.Body>
          <Card.Footer className="d-flex justify-content-between pt-3">
            <div ref={trash}>
              <FontAwesomeIcon icon="trash" className="text-primary fs-3" />
            </div>

            <OverlayTrigger
              placement="top"
              trigger={['hover', 'focus']}
              overlay={popoverComoSeUsa}
            >
              <Button
                size="sm"
                variant="link"
                className="icon-item-sm icon-item-hover shadow-none p-0"
              >
                ¿Cómo se usa?
              </Button>
            </OverlayTrigger>

            <div>
              <Button
                size="sm"
                name="cancel"
                className="me-2"
                variant="danger"
                onClick={event => handleClick(event)}
              >
                Cancelar
              </Button>

              <Button
                size="sm"
                name="submit"
                variant="success"
                onClick={event => handleClick(event)}
              >
                Guardar
              </Button>
            </div>
          </Card.Footer>
        </div>
      </CustomCard>

      <NewAvailabilityModal
        scheduleStartDate={scheduleStartDate}
        scheduleEndDate={scheduleEndDate}
        setScheduleStartDate={setScheduleStartDate}
        setScheduleEndDate={setScheduleEndDate}
        isOpenScheduleCard={isOpenScheduleCard}
        setIsOpenScheduleCard={setIsOpenScheduleCard}
        days={days}
        daysEs={daysEs}
        events={events}
        setEvents={setEvents}
        newAvailabilities={newAvailabilities}
        setNewAvailabilities={setNewAvailabilities}
        action={action}
        scheduleInfo={scheduleInfo}
      />
    </div>
  );
};

Availabilities.propTypes = {
  areaAvailabilities: PropTypes.array,
  areaId: PropTypes.number
};

export default Availabilities;
