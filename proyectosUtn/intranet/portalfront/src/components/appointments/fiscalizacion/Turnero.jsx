import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTurnosByMonth } from 'redux/actions/turnos';
import Datepicker from '../Datepicker';
import Hourpicker from '../Hourpicker';

const Turnero = ({ setAppointment, appointment }) => {
  const dispatch = useDispatch();
  const { turnosByMonth, loading } = useSelector(state => state.turnosReducer);

  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [monthEvents, setMonthEvents] = useState([]);
  const [dayEvents, setDayEvents] = useState([]);
  const [month, setMonth] = useState(startDate.getMonth());
  const [year, setYear] = useState(startDate.getFullYear());

  useEffect(() => {
    dispatch(getTurnosByMonth(`${month}`, `${year}`, 5));
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

  return (
    <div
      style={{
        userSelect: 'none'
      }}
      className="mt-4"
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
            height: 245,
            flexGrow: 1,
            overflowY: 'scroll',
            overflowX: 'scroll'
          }}
          events={dayEvents}
          appointment={appointment}
          setAppointment={setAppointment}
        />
      </div>
    </div>
  );
};

Turnero.propTypes = {
  setAppointment: PropTypes.func.isRequired,
  appointment: PropTypes.object.isRequired
};

export default Turnero;
