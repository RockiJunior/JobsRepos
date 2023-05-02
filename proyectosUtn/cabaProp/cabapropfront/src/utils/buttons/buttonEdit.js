import IconButton from 'components/common/IconButton';
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ButtonEdit = ({ funcion, data }) => {
  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip>Editar</Tooltip>}>
      <span>
        <IconButton
          buttonSize="sm"
          style={{ width: 30 }}
          icon="fa-pen-to-square"
          onClick={data ? () => funcion(data) : funcion}
          variant="light"
          className="px-2"
        />
      </span>
    </OverlayTrigger>
  );
};

ButtonEdit.propTypes = {
  funcion: PropTypes.func.isRequired,
  data: PropTypes.any
};

export default ButtonEdit;
