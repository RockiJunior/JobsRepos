/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { AiOutlineLeftCircle, AiOutlineRightCircle } from 'react-icons/ai';
import dayjs from 'dayjs';
import es from 'date-fns/locale/es';
import 'dayjs/locale/es';
import { Button, Spinner } from 'react-bootstrap';
registerLocale('es', es);
dayjs.locale('es');

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

const Datepicker = ({
  today,
  startDate,
  setStartDate,
  monthEvents,
  month,
  setMonth,
  className,
  year,
  setYear,
  loading
}) => {
  const [selectableDates, setSelectableDates] = useState([]);

  useEffect(() => {
    // styleChanges();
  }, [startDate]);

  useEffect(() => {
    setSelectableDates(monthEvents.map(event => new Date(event.inicio)));
  }, [monthEvents]);

  return (
    <div className={className} style={{ position: 'relative', paddingTop: 3 }}>
      <DatePicker
        selected={startDate}
        minDate={
          today.getMonth() === month && year === today.getFullYear()
            ? today
            : dayjs(today).month(month).year(year).startOf('month').toDate()
        }
        maxDate={dayjs(today).month(month).year(year).endOf('month').toDate()}
        locale="es"
        onChange={date => setStartDate(date)}
        inline
        includeDates={selectableDates}
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
      {loading && (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0
          }}
          className="d-flex justify-content-center align-items-center"
        >
          <Spinner animation="border" variant="primary" />
        </div>
      )}
    </div>
  );
};

export default Datepicker;
