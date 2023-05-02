import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col } from 'react-bootstrap';
import Flex from 'components/common/Flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CardDropdown from 'components/common/CardDropdown';
import classNames from 'classnames';
import IconItem from 'components/common/icon/IconItem';
import StatsChart from './StatsChart';
import { getColor } from 'helpers/utils';

const StatsItem = ({ stat }) => {
  const { icon, color, title, amount, caret, caretColor, target, data } = stat;
  return (
    <>
      <Flex justifyContent="center" alignItems="center" className="mb-3">
        <IconItem
          tag="div"
          icon={icon}
          bg={`soft-${color}`}
          color={color}
          size="sm"
          iconClass="fs--2"
          className="me-2 shadow-none"
        />
        <h6 className="mb-0 flex-1">{title}</h6>
        <CardDropdown />
      </Flex>
      <Flex>
        <p className="font-sans-serif lh-1 mb-1 fs-4 pe-2">{amount}%</p>
        <div className="d-flex flex-column">
          <FontAwesomeIcon
            icon={caret}
            className={`me-1 mb-0 text-${caretColor}`}
          />
          <p className="fs--2 mb-0 mt-0 text-nowrap">{target}</p>
        </div>
        <div className="w-100 ms-2">
          <StatsChart color={getColor(color)} data={data} />
        </div>
      </Flex>
    </>
  );
};

const UserStats = () => {
  const statsData = [
    {
      id: 1,
      title: 'New Contact',
      amount: 15,
      target: '2500 vs 2683',
      icon: 'phone',
      caret: 'caret-up',
      color: 'primary',
      caretColor: 'success',
      data: [220, 230, 150, 175, 200, 170, 70, 160]
    },
    {
      id: 2,
      title: 'New Users',
      amount: 13,
      target: '1635 vs 863',
      icon: 'user',
      caret: 'caret-up',
      color: 'info',
      caretColor: 'success',
      data: [90, 160, 150, 120, 230, 155, 220, 240]
    },
    {
      id: 3,
      title: 'New Leads',
      amount: 16,
      target: '1423 vs 256',
      icon: 'bolt',
      caret: 'caret-down',
      color: 'success',
      caretColor: 'danger',
      data: [200, 150, 175, 130, 150, 115, 130, 100]
    },
    {
      id: 4,
      title: 'New asdasd',
      amount: 16,
      target: '1423 vs 256',
      icon: 'bolt',
      caret: 'caret-down',
      color: 'success',
      caretColor: 'danger',
      data: [200, 150, 175, 130, 150, 115, 130, 100]
    }
  ];

  const [stats] = useState(statsData);
  
  return (
    <Card>
      <Card.Body>
        <Row>
          {stats.map((stat, index) => (
            <Col
              lg={4}
              key={stat.id}
              className={classNames({
                'border-bottom border-lg-0 border-lg-end':
                  index !== stats.length - 1,
                'pb-3 pb-lg-0': index === 0,
                'py-3 py-lg-0': index === 1,
                'pt-3 pt-lg-0': index === 2
              })}
            >
              <StatsItem stat={stat} />
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

StatsItem.propTypes = {
  stat: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    caret: PropTypes.string.isRequired,
    caretColor: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    icon: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    target: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  })
};

UserStats.propTypes = {
  stats: PropTypes.arrayOf(PropTypes.shape(StatsItem.propTypes.stat))
};

export default UserStats;
