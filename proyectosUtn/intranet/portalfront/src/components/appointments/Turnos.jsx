import React, { useState } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import '../../assets/Widget.css';
import Datepicker from './Datepicker';
import Hourpicker from './Hourpicker';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTurnosByMonth, reservarTurno } from 'redux/actions/turnos';
import { tramiteGetById } from 'redux/actions/tramite';
import PropTypes from 'prop-types';

export const ConfirmModal = ({
  openConfimModal,
  setOpenConfimModal,
  title,
  message,
  yesAction,
  loading
}) => {
  const handleClose = () => {
    setOpenConfimModal(false);
  };

  return (
    <Modal
      show={openConfimModal}
      onHide={handleClose}
      contentClassName="border"
      centered
    >
      <Modal.Header closeButton className="bg-light px-card border-bottom-0">
        <h5 className="mb-0">{title ? title : '¿Estas seguro ?'}</h5>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column justify-content-center">
        <p>
          {message
            ? message
            : '¿Estas seguro que deseas confirmar esta accion?'}
        </p>
        <div className="d-flex flex-row justify-content-center">
          <Button
            size="sm"
            variant="success"
            className="me-1"
            disabled={loading}
            onClick={() => {
              if (!loading) {
                yesAction();
                setOpenConfimModal(false);
              }
            }}
          >
            <span>Si</span>
          </Button>
          <Button
            className="ms-1"
            size="sm"
            variant="danger"
            disabled={loading}
            onClick={() => setOpenConfimModal(false)}
          >
            <span>No</span>
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

ConfirmModal.propTypes = {
  openConfimModal: PropTypes.bool.isRequired,
  setOpenConfimModal: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  yesAction: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

const Turnos = ({ puedePedirTurno }) => {
  const dispatch = useDispatch();

  const { turnosByMonth, loading } = useSelector(state => state.turnosReducer);
  const { tramite } = useSelector(state => state.tramiteReducer);

  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [monthEvents, setMonthEvents] = useState([]);
  const [dayEvents, setDayEvents] = useState([]);
  const [appointment, setAppointment] = useState({});
  const [month, setMonth] = useState(startDate.getMonth());
  const [year, setYear] = useState(startDate.getFullYear());
  const [open, setOpen] = useState(false);

  const [loadingResponse, setLoadingResponse] = useState(false);

  useEffect(() => {
    puedePedirTurno(tramite)[0] &&
      dispatch(
        getTurnosByMonth(`${month}`, `${year}`, puedePedirTurno(tramite)[1])
      );
  }, [month]);

  useEffect(() => {
    turnosByMonth && setMonthEvents(turnosByMonth);
  }, [turnosByMonth]);

  useEffect(() => {
    const dayEvents = monthEvents.filter(
      event => dayjs(event.inicio).date() === startDate.getDate()
    );
    setDayEvents(dayEvents);
  }, [startDate, monthEvents]);

  const [turnoPendiente, setTurnoPendiente] = useState(undefined);
  const [turnosPasados, setTurnosPasados] = useState([]);

  useEffect(() => {
    setTurnoPendiente(tramite.turno?.find(turno => turno.estado === 'pending'));
    setTurnosPasados(
      tramite.turno?.filter(turno => turno.estado !== 'pending')
    );
  }, [tramite]);

  return (
    <>
      {!!turnosPasados.length && (
        <>
          <h5>Turnos anteriores</h5>
          {turnosPasados.map(turno => (
            <div key={turno.id}>
              <p>{dayjs(turno.inicio).format('DD/MM/YYYY - HH:mm')} hs</p>
            </div>
          ))}
        </>
      )}

      {tramite && puedePedirTurno(tramite)[0] ? (
        turnoPendiente ? (
          <Alert variant="info" className="mt-3">
            <Alert.Heading>Ya tenés tu turno.</Alert.Heading>
            <p>
              Tu turno es el día{' '}
              {dayjs(turnoPendiente.inicio).format('DD/MM/YYYY')} a las{' '}
              {dayjs(turnoPendiente.inicio).format('HH:mm')}. Recorda que debes
              presentar toda la documentación que subiste anteriormente. Si
              tenes alguna duda podés comunicarte con las oficinas de CUCICBA.
            </p>
          </Alert>
        ) : (
          <div
            style={{
              userSelect: 'none'
            }}
          >
            <div className="d-flex flex-column flex-md-row justify-content-center align-items-center">
              <Datepicker
                today={today}
                setStartDate={setStartDate}
                startDate={startDate}
                monthEvents={monthEvents}
                month={month}
                setMonth={setMonth}
                year={year}
                setYear={setYear}
                loading={loading}
              />

              <Hourpicker
                className="rounded-0 d-flex flex-md-column flex-wrap nice-scroll justify-content-center justify-content-md-start"
                style={{
                  height: 293,
                  flexGrow: 1,
                  overflowY: 'scroll',
                  overflowX: 'scroll'
                }}
                events={dayEvents}
                appointment={appointment}
                setAppointment={setAppointment}
              />
            </div>
            <div className="d-flex justify-content-end">
              <Button
                disabled={!appointment.inicio}
                className={'mt-2'}
                size={'sm'}
                onClick={() => setOpen(true)}
              >
                <span>Reservar</span>
              </Button>
            </div>
            <ConfirmModal
              openConfimModal={open}
              setOpenConfimModal={setOpen}
              loading={loadingResponse}
              title="¿Estas seguro que deseas reservar este horario?"
              message={`Estas realizando una reserva para el ${dayjs(
                appointment.inicio
              ).format('DD/MM/YYYY')} de ${dayjs(appointment.inicio).format(
                'HH:mm'
              )} a ${dayjs(appointment.fin).format('HH:mm')}.
        Una vez confirmada no puede ser cambiada.
        `}
              yesAction={async () => {
                setLoadingResponse(true);
                appointment &&
                  tramite &&
                  (await dispatch(
                    reservarTurno(
                      appointment.inicio,
                      appointment.fin,
                      puedePedirTurno(tramite)[1],
                      tramite.id
                    )
                  ));

                await dispatch(tramiteGetById(tramite.id));
                setLoadingResponse(false);
              }}
            />
          </div>
        )
      ) : (
        <div>Aún no puedes solicitar un turno</div>
      )}
    </>
  );
};

Turnos.propTypes = {
  puedePedirTurno: PropTypes.func.isRequired
};

export default Turnos;
