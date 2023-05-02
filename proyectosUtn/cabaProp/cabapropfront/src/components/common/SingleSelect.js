import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

const SingleSelect = forwardRef(({ options, placeholder, ...rest }, ref) => {
  return (
    <Select
      ref={ref}
      maxMenuHeight={190}
      closemenuonselect={false}
      options={options}
      placeholder={placeholder}
      classNamePrefix="react-select react-select-sm"
      {...rest}
    />
  );
});

SingleSelect.propTypes = {
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string
};

export default SingleSelect;