import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import IconButton from 'components/common/IconButton';

const ButtonView = ({ funcion, data, link, style, className, ...rest }) => {
  return !link ? (
    <OverlayTrigger placement="bottom" overlay={<Tooltip>Ver</Tooltip>}>
      <span>
        <IconButton
          buttonSize="sm"
          style={{ width: 30, ...style }}
          icon="external-link-alt"
          onClick={data ? () => funcion(data) : funcion}
          variant="light"
          className={'px-2' + ' ' + className}
          {...rest}
        />
      </span>
    </OverlayTrigger>
  ) : (
    <OverlayTrigger placement="bottom" overlay={<Tooltip>Ver</Tooltip>}>
      <span>
        <Link to={link} target="_blank">
          <IconButton
            buttonSize="sm"
            style={{ width: 30, ...style }}
            icon="external-link-alt"
            variant="light"
            className={'px-2' + ' ' + className}
            {...rest}
          />
        </Link>
      </span>
    </OverlayTrigger>
  );
};

ButtonView.propTypes = {
  funcion: PropTypes.func.isRequired,
  data: PropTypes.any
};

export default ButtonView;
