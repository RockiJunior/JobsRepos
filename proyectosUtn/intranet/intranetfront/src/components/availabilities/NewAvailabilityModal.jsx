import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Form } from 'react-bootstrap';
import DayForm from './DayForm';
import DatePicker, { registerLocale } from 'react-datepicker';
import dayjs from 'dayjs';
import es from 'date-fns/locale/es';

registerLocale('es', es);

const emptySchedule = {
  id: null,
  title: '',
  start: null,
  end: null,
  sun: { open: false, interval: [{ from: null, to: null }] },
  mon: { open: false, interval: [{ from: null, to: null }] },
  tue: { open: false, interval: [{ from: null, to: null }] },
  wed: { open: false, interval: [{ from: null, to: null }] },
  thu: { open: false, interval: [{ from: null, to: null }] },
  fri: { open: false, interval: [{ from: null, to: null }] },
  sat: { open: false, interval: [{ from: null, to: null }] }
};

const NewAvailabilityModal = ({
  isOpenScheduleCard,
  setIsOpenScheduleCard,
  days,
  daysEs,
  scheduleStartDate,
  scheduleEndDate,
  newAvailabilities,
  events,
  setNewAvailabilities,
  setEvents,
  action,
  scheduleInfo
}) => {
  const [schedule, setSchedule] = useState(emptySchedule);
  const [saveDisabled, setSaveDisabled] = useState(false);
  const [noIntervals, setNoIntervals] = useState(false);
  const [noOpenChecks, setNoOpenChecks] = useState(false);

  useEffect(() => {
    if (!scheduleInfo) {
      setSchedule(emptySchedule);
    } else if (action === 'edit' && scheduleInfo) {
      setSchedule(scheduleInfo);
    }
  }, [scheduleInfo, action]);

  useEffect(() => {
    if (action === 'create') {
      setSchedule({
        ...schedule,
        start: scheduleStartDate,
        end: scheduleEndDate,
        title: '',
        id: `na${newAvailabilities.length}`
      });
    }
  }, [scheduleStartDate, scheduleEndDate, action]);

  const handleChangeDate = (date, type) => {
    if (type === 'start') {
      setSchedule({
        ...schedule,
        start: date
      });
    } else {
      setSchedule({
        ...schedule,
        end: date ? dayjs(date).add(1, 'day').toDate() : date
      });
    }
  };

  const handleAddInterval = day => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        interval: [...schedule[day].interval, { from: null, to: null }]
      }
    });
  };

  const handleRemoveInterval = (day, index) => {
    let newInterval = schedule[day].interval;
    newInterval = newInterval.filter((e, i) => index !== i);
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        interval: newInterval
      }
    });
  };

  const handleChangeCheck = (day, event) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        open: event.target.checked
      }
    });
  };

  const handleDateChange = (hour, index, day, type) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        interval: schedule[day].interval.map((interval, i) =>
          index === i
            ? {
                ...interval,
                [type]: hour
                  ? hour.getHours() +
                    ':' +
                    (hour.getMinutes() < 10
                      ? '0' + hour.getMinutes()
                      : hour.getMinutes())
                  : null
              }
            : interval
        )
      }
    });
  };

  const handleClose = () => {
    setSchedule(emptySchedule);
    setIsOpenScheduleCard(false);
  };

  const handleSubmit = async () => {
    // eslint-disable-next-line no-unused-vars
    let { id, title, start, end, ...newSchedule } = { ...schedule };

    for (let day in newSchedule) {
      newSchedule[day].interval = newSchedule[day].interval.filter(
        interval => interval.from !== null || interval.to !== null
      );
      if (!newSchedule[day].interval.length) {
        newSchedule[day].interval = [{ from: null, to: null }];
      }
      if (newSchedule[day].interval[0].from === null) {
        newSchedule[day].open = false;
      }
    }
    // await dispatch(
    //   createAvailability(establishment.id, { ...newSchedule, title })
    // );
    // await dispatch(getAvailabilityByEstablishment(establishment.id));

    if (action === 'create') {
      setNewAvailabilities([...newAvailabilities, schedule]);
    } else if (action === 'edit') {
      setNewAvailabilities([
        ...newAvailabilities.filter(na => na.id !== schedule.id),
        { ...schedule, id: schedule.id }
      ]);
      setEvents(events.filter(e => e.id !== schedule.id));
    }

    setSchedule(emptySchedule);
    setIsOpenScheduleCard(false);
  };

  const handleCopy = (from, to) => {
    setSchedule({ ...schedule, [to]: schedule[from] });
  };

  const dayForm = useMemo(() => {
    return (
      <>
        <Form.Group className="mb-3 position-relative">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            size="sm"
            placeholder="..."
            name="name"
            value={schedule.title}
            onChange={e => setSchedule({ ...schedule, title: e.target.value })}
            isInvalid={!schedule.title}
            disabled={schedule.title === 'default'}
          />
          <Form.Control.Feedback type="invalid" tooltip>
            Este campo es requerido
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="startDate">
          <Form.Label>Desde</Form.Label>
          <DatePicker
            selected={schedule.start ? new Date(schedule.start) : null}
            startDate={schedule.start ? new Date(schedule.start) : null}
            endDate={
              schedule.end
                ? dayjs(schedule.end).subtract(1, 'day').toDate()
                : schedule.end
            }
            selectsStart
            onChange={date => handleChangeDate(date, 'start')}
            className="form-control"
            placeholderText="DD-MM-YYYY"
            dateFormat="dd-MM-yyyy"
            excludeDateIntervals={[...newAvailabilities, ...events]
              .filter(e => e.id !== schedule.id)
              .map(e => ({
                start: new Date(e.start),
                end: new Date(e.end)
              }))}
            excludeOut
            locale="es"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="startDate">
          <Form.Label>Hasta</Form.Label>
          <DatePicker
            selected={
              schedule.end
                ? dayjs(schedule.end).subtract(1, 'day').toDate()
                : null
            }
            startDate={schedule.start}
            endDate={
              schedule.end
                ? dayjs(schedule.end).subtract(1, 'day').toDate()
                : null
            }
            onChange={date => handleChangeDate(date, 'end')}
            selectsEnd
            minDate={schedule.start}
            className="form-control"
            placeholderText="DD-MM-YYYY"
            dateFormat="dd-MM-yyyy"
            excludeDateIntervals={[...newAvailabilities, ...events]
              .filter(e => e.id !== schedule.id)
              .map(e => ({
                start: new Date(e.start),
                end: new Date(e.end)
              }))}
            excludeOut
            locale="es"
          />
        </Form.Group>

        {days.map((d, i) => (
          <div key={`da${d}`}>
            <DayForm
              value={d}
              name={daysEs[i]}
              day={schedule[d]}
              handleAddInterval={handleAddInterval}
              handleRemoveInterval={handleRemoveInterval}
              handleChangeCheck={handleChangeCheck}
              handleDateChange={handleDateChange}
              setSaveDisabled={setSaveDisabled}
              defaultAvailability={schedule.title === 'default'}
              handleCopy={handleCopy}
            />
            <hr className="my-2" />
          </div>
        ))}
      </>
    );
  }, [schedule]);

  useEffect(() => {
    let intervals = 0;
    days.forEach(d =>
      schedule[d].interval.forEach(i => i.from && i.to && intervals++)
    );
    setNoIntervals(!intervals);

    let openCheks = 0;
    days.forEach(d => schedule[d].open && openCheks++);
    setNoOpenChecks(!openCheks);
  }, [schedule]);

  return (
    <Modal
      show={isOpenScheduleCard}
      onHide={handleClose}
      contentClassName="border"
      size="sm"
    >
      <Modal.Header closeButton className="bg-light px-card border-bottom-0">
        <Modal.Title as="h5">Nueva disponibilidad</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-card">{dayForm}</Modal.Body>
      <Modal.Footer className="bg-light px-card border-top-0 d-flex justify-content-between">
        <Button
          variant="primary"
          size="sm"
          onClick={handleClose}
          style={{ fontSize: '.7rem' }}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          size="sm"
          style={{ fontSize: '.7rem' }}
          disabled={
            saveDisabled || !schedule.title || noIntervals || noOpenChecks
          }
        >
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

NewAvailabilityModal.propTypes = {
  isOpenScheduleCard: PropTypes.bool,
  setIsOpenScheduleCard: PropTypes.func,
  days: PropTypes.array,
  daysEs: PropTypes.array,
  scheduleStartDate: PropTypes.object,
  setScheduleStartDate: PropTypes.func,
  scheduleEndDate: PropTypes.object,
  setScheduleEndDate: PropTypes.func,
  newAvailabilities: PropTypes.array,
  events: PropTypes.array,
  setNewAvailabilities: PropTypes.func,
  setEvents: PropTypes.func,
  action: PropTypes.string,
  scheduleInfo: PropTypes.object
};

export default NewAvailabilityModal;
