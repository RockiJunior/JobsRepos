import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import classNames from 'classnames';
import Background from 'components/common/Background';
import SoftBadge from 'components/common/SoftBadge';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CountUp from 'react-countup';

const StatisticsCard = ({ stat, ...rest }) => {
  const {
    title,
    value,
    decimal,
    suffix,
    prefix,
    valueClassName,
    linkText,
    link,
    badgeText,
    badgeBg,
    image,
    className,
    row,
    countUpColor,
    linkClassName,
    requestPayment
  } = stat;
  return !row ? (
    <Card className={classNames(className, 'overflow-hidden')} {...rest}>
      <Background image={image} className="bg-white" />
      <Card.Body className="position-relative d-flex flex-column justify-content-between">
        <h6>
          {title}
          {badgeText && (
            <SoftBadge bg={badgeBg} pill className="ms-2">
              {badgeText}
            </SoftBadge>
          )}
        </h6>
        <div
          className={classNames(
            valueClassName,
            'display-4 fs-4 mb-0 fw-normal font-sans-serif'
          )}
        >
          <CountUp
            style={{ color: countUpColor }}
            start={0}
            end={value}
            duration={1.5}
            suffix={suffix}
            prefix={prefix}
            separator=","
            decimals={decimal ? 2 : 0}
            decimal="."
          />
        </div>
        {link && (
          <div className="w-100 text-end">
            <Link
              to={link}
              className={'fw-semi-bold fs--1 text-nowrap ' + linkClassName}
            >
              {linkText}
              <FontAwesomeIcon
                icon="angle-right"
                className="ms-1"
                transform="down-1"
              />
            </Link>
          </div>
        )}
      </Card.Body>
    </Card>
  ) : (
    <Card className={classNames(className, 'overflow-hidden')} {...rest}>
      <Background image={image} className="bg-card" />
      <Card.Body
        className={
          requestPayment
            ? 'py-3 px-4 position-relative d-flex flex-column flex-md-row align-items-center justify-content-between'
            : 'py-3 px-4 position-relative d-flex align-items-center justify-content-between'
        }
      >
        <h4 className="m-0">
          {title}:
          {badgeText && (
            <SoftBadge bg={badgeBg} pill className="ms-2">
              {badgeText}
            </SoftBadge>
          )}
        </h4>
        {requestPayment && (
          <div
            className="position-md-absolute d-flex justify-content-center"
            style={{ width: '100%', left: 0 }}
          >
            <div
              className={classNames(
                valueClassName,
                'display-4 fs-4 fw-normal font-sans-serif'
              )}
            >
              {requestPayment && (
                <CountUp
                  start={0}
                  end={value}
                  duration={1.5}
                  suffix={suffix}
                  prefix={prefix}
                  separator=","
                  decimals={decimal ? 2 : 0}
                  decimal="."
                />
              )}
            </div>
          </div>
        )}
        <div
          className={classNames(
            valueClassName,
            'display-4 fs-4 fw-normal font-sans-serif'
          )}
        >
          {!requestPayment && (
            <CountUp
              start={0}
              end={value}
              duration={1.5}
              suffix={suffix}
              prefix={prefix}
              separator=","
              decimals={decimal ? 2 : 0}
              decimal="."
            />
          )}
        </div>
        {link && (
          <Link to={link} className="fw-semi-bold fs--1 text-nowrap">
            {linkText}
            <FontAwesomeIcon
              icon="angle-right"
              className="ms-1"
              transform="down-1"
            />
          </Link>
        )}
        {requestPayment && (
          <Link
            to=""
            className={
              'fw-semi-bold fs--1 text-nowrap z-index-1 ' + linkClassName
            }
            onClick={requestPayment}
          >
            {linkText}
            <FontAwesomeIcon
              icon="angle-right"
              className="ms-1"
              transform="down-1"
            />
          </Link>
        )}
      </Card.Body>
    </Card>
  );
};

StatisticsCard.propTypes = {
  stat: PropTypes.shape({
    title: PropTypes.string.isRequired,
    value: PropTypes.number,
    decimal: PropTypes.bool,
    suffix: PropTypes.string.isRequired,
    prefix: PropTypes.string.isRequired,
    valueClassName: PropTypes.string,
    linkText: PropTypes.string,
    link: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    badgeText: PropTypes.string,
    badgeBg: PropTypes.string,
    image: PropTypes.string,
    className: PropTypes.string,
    row: PropTypes.bool,
    countUpColor: PropTypes.string,
    linkClassName: PropTypes.string,
    requestPayment: PropTypes.func
  })
};

export default StatisticsCard;
