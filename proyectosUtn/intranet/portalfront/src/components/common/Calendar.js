import React from 'react';
import PropTypes from 'prop-types';

const Calendar = ({ month, day, year }) => (
  <div className="calendar">
    <span className="calendar-month">{month}</span>
    <span className="calendar-day">{day}</span>
    <span className="mt-1 fs--1">{year}</span>
  </div>
);

Calendar.propTypes = {
  month: PropTypes.string.isRequired,
  day: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired
};

export default Calendar;
