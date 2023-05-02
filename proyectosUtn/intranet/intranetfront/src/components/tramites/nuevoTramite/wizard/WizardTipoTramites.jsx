import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { tipoTramiteGetAll } from 'redux/actions/tipoTramite';
import { usersGetMatriculados } from 'redux/actions/users';
import './wizard.css';

export const WizardTipoTramites = ({ setTramite }) => {
  const dispatch = useDispatch();
  const { tipoTramites } = useSelector(state => state.tipoTramiteReducer);

  useEffect(() => {
    dispatch(tipoTramiteGetAll());
    dispatch(usersGetMatriculados());
  }, []);

  return (
    <ListGroup variant="flush" style={{ width: 'fit-content' }}>
      {tipoTramites.map((item, index) => (
        <ListGroup.Item
          key={index}
          className=" tipo-tramite-list-item cursor-pointer"
        >
          <Form.Group className="d-flex align-items-center ">
            <Form.Check
              type="radio"
              id={`radio-${index}`}
              name="radio"
              className="me-3 cursor-pointer"
              onClick={() => {
                setTramite(item);
              }}
            />

            <Form.Label
              htmlFor={`radio-${index}`}
              className="mb-0 cursor-pointer"
            >
              {item.titulo}
            </Form.Label>
          </Form.Group>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};
WizardTipoTramites.propTypes = {
  setTramite: PropTypes.func.isRequired
};
