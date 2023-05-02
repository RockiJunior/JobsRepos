import IconButton from 'components/common/IconButton';
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ButtonDelete = ({ funcion, data, className, style, ...rest }) => {
  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip>Eliminar</Tooltip>}>
      <span>
        <IconButton
          buttonSize="sm"
          style={{ width: 30, ...style }}
          icon="trash-can"
          onClick={data ? () => funcion(data) : funcion}
          variant="danger"
          className={'px-2' + ' ' + className}
          {...rest}
        />
      </span>
    </OverlayTrigger>
  );
};

ButtonDelete.propTypes = {
  funcion: PropTypes.func.isRequired,
  data: PropTypes.any,
  className: PropTypes.string,
  style: PropTypes.object
};

export default ButtonDelete;
