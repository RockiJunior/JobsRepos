import React from 'react';
import PropTypes from 'prop-types';
import { TimeLineItem } from './historial/TimeLineItem';

const HistorialContent = ({ tramite }) => {
  return (
    <div className="timeline-vertical">
      {tramite.historial.map((item, index) => (
        <TimeLineItem key={index} item={item} tramite={tramite} />
      ))}
    </div>
  );
};

HistorialContent.propTypes = {
  tramite: PropTypes.object
};

export default HistorialContent;
