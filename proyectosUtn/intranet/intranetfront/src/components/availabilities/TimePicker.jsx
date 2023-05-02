import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { Form, Row, Col } from 'react-bootstrap';
import IconButton from 'components/common/IconButton';
import dayjs from 'dayjs';

const TimePicker = ({
  hours,
  day,
  handleRemoveInterval,
  value,
  index,
  handleDateChange,
  setSaveDisabled,
  defaultAvailability,
  intervalsArray
}) => {
  let from = null;
  let to = null;

  if (hours.from) {
    from = new Date();

    from.setHours(hours.from.split(':')[0], hours.from.split(':')[1]);
  }

  if (hours.to) {
    to = new Date();
    to.setHours(hours.to.split(':')[0], hours.to.split(':')[1]);
  }

  useEffect(() => {
    if (hours.to && hours.to) {
      setSaveDisabled(false);
    } else if (!hours.to && !hours.from) {
      setSaveDisabled(false);
    } else {
      setSaveDisabled(true);
    }
  }, [hours]);

  const filterTimeFrom = time => {
    if (index !== 0) {
      const currentTime = dayjs(time);
      const currentTo = currentTime
        .set('hour', intervalsArray[index - 1].to.split(':')[0])
        .set('minute', intervalsArray[index - 1].to.split(':')[1]);

      if (currentTime.isAfter(currentTo)) {
        return true;
      } else {
        return false;
      }
    }

    return true;
  };

  const filterTimeTo = time => {
    const currentTime = dayjs(time);
    const currentFrom = currentTime
      .set('hour', hours.from.split(':')[0])
      .set('minute', hours.from.split(':')[1]);

    if (currentTime.isAfter(currentFrom)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Row className="pb-1">
      <Col xs={5} className="pe-1">
        <DatePicker
          selected={from}
          onChange={hour => handleDateChange(hour, index, value, 'from')}
          className="form-control px-2"
          timeIntervals={30}
          dateFormat="h:mm aa"
          showTimeSelect
          showTimeSelectOnly
          customInput={<Form.Control size="sm" />}
          timeCaption="Hora"
          disabled={!day.open}
          filterTime={filterTimeFrom}
        />
      </Col>
      <Col
        xs={5}
        className="d-flex align-items-center ps-1"
        style={{ position: 'relative' }}
      >
        <DatePicker
          selected={to}
          onChange={hour => handleDateChange(hour, index, value, 'to')}
          className="form-control px-2"
          timeIntervals={30}
          dateFormat="h:mm aa"
          showTimeSelect
          showTimeSelectOnly
          customInput={<Form.Control size="sm" />}
          timeCaption="Hora"
          disabled={!day.open || !hours.from}
          filterTime={filterTimeTo}
        />
        {day.interval.length > 1 && index !== 0 && (
          <IconButton
            style={{ boxShadow: 'none', position: 'absolute', right: '-15px' }}
            icon="trash"
            variant="link"
            size="sm"
            onClick={() => handleRemoveInterval(value, index)}
            disabled={!day.open || defaultAvailability}
          />
        )}
      </Col>
    </Row>
  );
};

TimePicker.propTypes = {
  hours: PropTypes.object,
  handleRemoveInterval: PropTypes.func,
  day: PropTypes.object,
  value: PropTypes.string,
  index: PropTypes.number,
  handleDateChange: PropTypes.func,
  setSaveDisabled: PropTypes.func,
  defaultAvailability: PropTypes.bool,
  intervalsArray: PropTypes.array
};

export default TimePicker;
