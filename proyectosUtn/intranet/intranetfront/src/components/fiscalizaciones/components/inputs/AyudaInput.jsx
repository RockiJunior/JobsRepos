import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const getAyuda = (ayuda, formData) => {
  if (ayuda.includes('condition::')) {
    const [condition, options] = ayuda.replace('condition::', '').split('??');
    const [first, second] = options.split('||');

    return (formData[condition] ? first : second).split('\n').map((item, i) => (
      <Fragment key={i + 'asd'}>
        {item}
        <br />
      </Fragment>
    ));
  } else {
    return ayuda;
  }
};

const AyudaInput = ({ ayuda, formData }) => {
  return (
    <div className="d-flex justify-content-end fw-bold w-100 mt-1">
      <small>{getAyuda(ayuda, formData)}</small>
    </div>
  );
};

AyudaInput.propTypes = {
  ayuda: PropTypes.string.isRequired,
  formData: PropTypes.object.isRequired
};

export default AyudaInput;
