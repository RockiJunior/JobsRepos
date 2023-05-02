import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'components/common/IconButton';
import { Form, Row, Col, Card, Dropdown } from 'react-bootstrap';
import TimePicker from './TimePicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { days, daysEs } from './days';

const DayForm = ({
  name,
  day,
  handleAddInterval,
  handleRemoveInterval,
  value,
  handleChangeCheck,
  handleDateChange,
  setSaveDisabled,
  defaultAvailability,
  handleCopy,
  dayDropdown
}) => {
  return (
    <Card>
      <Card.Body>
        <Col xs={12} style={{ position: 'relative' }}>
          <Form.Group className="mt-1">
            <Form.Label className="d-flex">
              <Form.Check
                className="p-0 me-1"
                type="checkbox"
                name={name}
                checked={day.open}
                onChange={
                  !defaultAvailability
                    ? e => handleChangeCheck(value, e)
                    : () => {}
                }
              />
              {name}
            </Form.Label>
            <Row>
              <Col xs={12}>
                {day.interval.map((interval, index) => (
                  <TimePicker
                    key={`${name}${index}`}
                    hours={interval}
                    day={day}
                    handleRemoveInterval={handleRemoveInterval}
                    index={index}
                    value={value}
                    handleDateChange={
                      !defaultAvailability ? handleDateChange : () => {}
                    }
                    setSaveDisabled={setSaveDisabled}
                    defaultAvailability={defaultAvailability}
                    intervalsArray={day.interval}
                  />
                ))}
              </Col>
              <Col xs={12}>
                <IconButton
                  className="p-0 ps-1"
                  style={{ boxShadow: 'none' }}
                  size="lg"
                  icon="plus"
                  variant="link"
                  disabled={
                    !day.open || defaultAvailability || !day.interval.at(-1).to
                  }
                  onClick={() => handleAddInterval(value)}
                />
              </Col>
            </Row>
          </Form.Group>
          <Dropdown
            className="font-sans-serif btn-reveal-trigger"
            style={{
              position: 'absolute',
              top: 0,
              right: 0
            }}
            id="new-club-schedule-day-dropdown"
            show={dayDropdown}
          >
            <Dropdown.Toggle
              variant="link"
              className="text-600 btn-reveal p-0 px-1 m-0"
            >
              <FontAwesomeIcon
                style={{ color: 'var(--falcon-1000)' }}
                icon="ellipsis-v"
                className="fs--10"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu className="border py-0 bg-light">
              {days.map((d, i) =>
                d !== value ? (
                  <Dropdown.Item onClick={() => handleCopy(value, d)}>
                    Copiar a {daysEs[i]}
                  </Dropdown.Item>
                ) : null
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Card.Body>
    </Card>
  );
};

DayForm.propTypes = {
  name: PropTypes.string,
  day: PropTypes.object,
  handleAddInterval: PropTypes.func,
  handleRemoveInterval: PropTypes.func,
  value: PropTypes.string,
  handleChangeCheck: PropTypes.func,
  handleDateChange: PropTypes.func,
  setSaveDisabled: PropTypes.func,
  defaultAvailability: PropTypes.bool,
  handleCopy: PropTypes.func,
  dayDropdown: PropTypes.bool
};

export default DayForm;
