import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

const MultiSelect = forwardRef(({ options, placeholder, ...rest }, ref) => {
  return (
    <Select
      ref={ref}
      closemenuonselect={false}
      ismulti
      options={options}
      placeholder={placeholder}
      classNamePrefix="react-select react-select-sm"
      {...rest}
    />
  );
});

MultiSelect.propTypes = {
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string
};

export default MultiSelect;
