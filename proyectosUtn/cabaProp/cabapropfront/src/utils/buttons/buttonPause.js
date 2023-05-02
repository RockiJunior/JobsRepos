import IconButton from 'components/common/IconButton';
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ButtonPause = ({ funcion, data }) => {
  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip>Pausar</Tooltip>}>
      <span>
        <IconButton
          buttonSize="sm"
          style={{ width: 30 }}
          icon="fa-pause"
          onClick={data ? () => funcion(data) : funcion}
          variant="light"
          className="px-2"
        />
      </span>
    </OverlayTrigger>
  );
};

ButtonPause.propTypes = {
  funcion: PropTypes.func.isRequired,
  data: PropTypes.any
};

export default ButtonPause;
