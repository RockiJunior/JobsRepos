import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Overlay,
  Spinner
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import { AiOutlineLeftCircle, AiOutlineRightCircle } from 'react-icons/ai';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  eventoCreate,
  eventoGetAllPending,
  eventoGetAllTypes,
  eventoUpdate
} from 'redux/actions/eventos';
import TimeKeeper from 'react-timekeeper';
import dayjs from 'dayjs';
registerLocale('es', es);

const monthsEs = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];

const CustomHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  month,
  setMonth,
  year,
  setYear,
  today
}) => {
  useEffect(() => {
    setMonth(date.getMonth());
    setYear(date.getFullYear());
  }, [date]);

  return (
    <div className="d-flex justify-content-between align-items-center px-3">
      <Button
        className="p-0 text-primary"
        variant="link"
        disabled={month === today.getMonth() && year === today.getFullYear()}
        onClick={decreaseMonth}
        style={{ boxShadow: 'none' }}
      >
        <AiOutlineLeftCircle style={{ fontSize: 26 }} />
      </Button>
      <div>
        <span>{monthsEs[month]}</span>
        <span> de </span>
        <span>{year}</span>
      </div>
      <Button
        className="p-0 text-primary"
        onClick={increaseMonth}
        variant="link"
        style={{ boxShadow: 'none' }}
      >
        <AiOutlineRightCircle style={{ fontSize: 26 }} />
      </Button>
    </div>
  );
};

CustomHeader.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  decreaseMonth: PropTypes.func.isRequired,
  increaseMonth: PropTypes.func.isRequired,
  month: PropTypes.number.isRequired,
  setMonth: PropTypes.func.isRequired,
  year: PropTypes.number.isRequired,
  setYear: PropTypes.func.isRequired,
  today: PropTypes.instanceOf(Date).isRequired
};

const EventModal = ({ show, setShow, editEvento }) => {
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [horaEvento, setHoraEvento] = useState(null);
  const [tipoEvento, setTipoEvento] = useState('');

  const [month, setMonth] = useState(startDate.getMonth());
  const [year, setYear] = useState(startDate.getFullYear());
  const [showClock, setShowClock] = useState(false);

  const targetClock = useRef(null);

  const [loading, setLoading] = useState(false);

  const { tipoEventos } = useSelector(state => state.eventoReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(eventoGetAllTypes());
  }, []);

  useEffect(() => {
    if (editEvento) {
      setStartDate(new Date(editEvento.fecha));
      setHoraEvento(dayjs(editEvento.fecha).format('HH:mm'));
      setTipoEvento(editEvento.tipoEventoId);
    }
  }, [editEvento]);

  useEffect(() => {
    if (startDate) {
      setMonth(startDate.getMonth());
      setYear(startDate.getFullYear());
    }
  }, [startDate]);

  const handleSubmit = async () => {
    if ((horaEvento, tipoEvento, startDate)) {
      setLoading(true);
      const [hour, minute] = horaEvento.split(':');
      const fecha = dayjs(startDate)
        .set('hour', hour)
        .set('minute', minute)
        .set('second', 0)
        .toDate();

      if (editEvento) {
        await dispatch(
          eventoUpdate(editEvento.id, { fecha, tipoEventoId: tipoEvento })
        );
      } else {
        await dispatch(eventoCreate(fecha, tipoEvento));
      }

      await dispatch(eventoGetAllPending());

      setLoading(false);
      setStartDate(today);
      setHoraEvento(null);
      setTipoEvento('');
      setShowClock(false);
      setShow(false);
    }
  };

  const handleClose = () => {
    setStartDate(today);
    setHoraEvento(null);
    setTipoEvento('');
    setShowClock(false);
    setShow(false);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{editEvento ? 'Editar' : 'Crear'} evento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="g-3">
          <Col xs={12}>
            <Form.Group>
              <Form.Label>Selecciona una fecha</Form.Label>
              <div className="d-flex justify-content-center">
                <DatePicker
                  inline
                  locale="es"
                  minDate={new Date()}
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  renderCustomHeader={props => (
                    <CustomHeader
                      {...props}
                      month={month}
                      setMonth={setMonth}
                      year={year}
                      setYear={setYear}
                      today={today}
                    />
                  )}
                />
              </div>
            </Form.Group>
          </Col>

          <Col xs={6}>
            <Form.Group>
              <Form.Label>Selecciona un tipo de evento</Form.Label>
              <Form.Select
                value={tipoEvento}
                onChange={e => setTipoEvento(e.target.value)}
              >
                {!tipoEvento && <option>Seleccionar...</option>}
                {tipoEventos.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col xs={6}>
            <Form.Group>
              <Form.Label>Selecciona una hora</Form.Label>
              <Overlay
                target={targetClock.current}
                show={showClock}
                placement="top"
              >
                {/* eslint-disable-next-line no-unused-vars */}
                {({ style, show, arrowProps, ...props }) => (
                  <div
                    {...props}
                    style={{
                      zIndex: 2000,
                      position: 'absolute',

                      color: 'white',
                      borderRadius: 3,
                      ...style
                    }}
                  >
                    <TimeKeeper
                      time={horaEvento}
                      onChange={newTime => {
                        setHoraEvento(
                          `${newTime.hour < 10 ? '0' : ''}${newTime.hour}:${
                            newTime.minute < 10 ? '0' : ''
                          }${newTime.minute}`
                        );
                      }}
                      switchToMinuteOnHourSelect
                      closeOnMinuteSelect
                      doneButton={() => (
                        <Button
                          size="sm"
                          className="w-100 rounded-0"
                          onClick={() => setShowClock(false)}
                        >
                          Listo
                        </Button>
                      )}
                      hour24Mode
                    />
                  </div>
                )}
              </Overlay>

              <div onClick={() => setShowClock(!showClock)}>
                <Form.Control
                  type="time"
                  value={horaEvento || ''}
                  ref={targetClock}
                  onChange={e => setHoraEvento(e.target.value)}
                  disabled
                  style={{
                    cursor: 'pointer',
                    backgroundColor: 'var(--falcon-ligth)'
                  }}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button size="sm" variant="danger" onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          size="sm"
          variant="success"
          onClick={handleSubmit}
          disabled={!startDate || !horaEvento || !tipoEvento || loading}
        >
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : editEvento ? (
            'Editar'
          ) : (
            'Crear'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

EventModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  editEvento: PropTypes.object
};

export default EventModal;
