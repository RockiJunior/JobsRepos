import React from 'react';
import PropTypes from 'prop-types';

const CustomMessage = ({ ReactIcon, title, message }) => {
  return (
    <div className="py-5">
      <h3 className="d-flex align-items-center justify-content-center">
        <ReactIcon className="me-1" /> <strong>{title}</strong>
      </h3>
      <p className="text-center mb-0">{message}</p>
    </div>
  );
};

CustomMessage.propTypes = {
  ReactIcon: PropTypes.any,
  title: PropTypes.string,
  message: PropTypes.string
};

export default CustomMessage;
