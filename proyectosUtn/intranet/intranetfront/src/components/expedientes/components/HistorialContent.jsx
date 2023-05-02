import React from 'react';
import PropTypes from 'prop-types';
import { TimeLineItem } from './historial/TimeLineItem';

const HistorialContent = ({ expediente }) => {
  return (
    <div className="timeline-vertical">
      {expediente.historial.map((item, index) => (
        <TimeLineItem key={index} item={item} expediente={expediente} />
      ))}
    </div>
  );
};

HistorialContent.propTypes = {
  expediente: PropTypes.object
};

export default HistorialContent;
