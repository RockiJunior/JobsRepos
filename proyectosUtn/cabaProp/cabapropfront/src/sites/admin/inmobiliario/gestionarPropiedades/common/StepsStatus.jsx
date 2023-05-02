import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import {
  Col,
  OverlayTrigger,
  ProgressBar,
  Row,
  Tooltip
} from 'react-bootstrap';
import { getStatusData } from '../steps/utils/getStatusData';

const StepsStatus = ({ property }) => {
  const { data, messages } = getStatusData(property);

  const totalStorage = data
    .map(step =>
      step
        .map(d => d.size)
        .reduce((total, currentValue) => total + currentValue, 0)
    )
    .reduce((total, currentValue) => total + currentValue, 0);

  const emptyTotal = data
    .map(step =>
      step
        .filter(d => d.color === '300')
        .map(d => d.size)
        .reduce((total, currentValue) => total + currentValue, 0)
    )
    .reduce((total, currentValue) => total + currentValue, 0);

  return (
    <div className="d-flex align-items-center">
      <div className="w-100">
        <span className="small">
          Calidad{' '}
          <span className="fw-bolder">
            {emptyTotal === 0
              ? '100'
              : `${Math.round(
                  ((totalStorage - emptyTotal) * 100) / totalStorage
                )}`}
            %
          </span>
        </span>

        <ProgressBar
          style={{ height: 8 }}
          className="shadow-none rounded-3 mb-3"
        >
          {data.map(step =>
            step.map((status, index) => (
              <OverlayTrigger
                placement="bottom"
                key={status.name + index}
                overlay={
                  <Tooltip
                    id={`tooltip-${status.name}`}
                    className="bg-white text-dark"
                  >
                    {status.name}
                  </Tooltip>
                }
              >
                <ProgressBar
                  isChild
                  variant={status.color}
                  now={(status.size * 100) / totalStorage}
                  style={{
                    borderRight:
                      index === step.length - 1
                        ? '2px solid white'
                        : '' /* `1px solid var(--falcon-colored-link-${status.color}-hover-color)` */
                  }}
                />
              </OverlayTrigger>
            ))
          )}
        </ProgressBar>

        <Row>
          {messages.map((message, index) => (
            <Col key={message.title + index} xs="auto" className="pe-2 small">
              <FontAwesomeIcon
                icon="circle"
                className={`text-${message.color} fs--2 me-2`}
              />
              <span>{message.title}</span>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

StepsStatus.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired
    }).isRequired
  ),
  className: PropTypes.string
};

export default StepsStatus;
