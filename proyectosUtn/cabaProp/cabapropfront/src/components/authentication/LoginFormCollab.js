import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from 'components/common/IconButton';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginColab } from 'redux/loginSlice';

const LoginFormCollab = ({ hasLabel }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPass, setShowPass] = useState(false);

  // Handler
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      dispatch(loginColab(formData, navigate));
    } catch (error) {
      console.log(e);
    }
  };

  const handleFieldChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Email</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'Usuario' : ''}
          value={formData.email}
          name="email"
          onChange={handleFieldChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Contraseña</Form.Label>}
        <InputGroup>
          <Form.Control
            placeholder={!hasLabel ? 'Contraseña' : ''}
            value={formData.password}
            name="password"
            onChange={handleFieldChange}
            type={showPass ? 'text' : 'password'}
          />
          <InputGroup.Text
            className="px-2"
            onClick={() => setShowPass(!showPass)}
            style={{
              width: '13%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <FontAwesomeIcon
              icon={showPass ? 'eye-slash' : 'eye'}
              style={{ cursor: 'pointer' }}
            />
          </InputGroup.Text>
        </InputGroup>
      </Form.Group>

      <Form.Group className="w-100 mb-2 d-flex justify-content-center">
        <IconButton
          type="submit"
          color="primary"
          icon={faArrowRightToBracket}
          iconAlign="right"
          iconClassName="ms-2"
          className="mt-3 mb-3 w-100"
          disabled={!formData.email || !formData.password}
        >
          Iniciar sesión
        </IconButton>
      </Form.Group>
      <center>
        <Link className="fs--1 mb-0" to={`/recuperar-contraseña`}>
          ¿Olvidó su contraseña?
        </Link>
      </center>
    </Form>
  );
};

LoginFormCollab.propTypes = {
  layout: PropTypes.string,
  hasLabel: PropTypes.bool
};

LoginFormCollab.defaultProps = {
  layout: 'simple',
  hasLabel: false
};

export default LoginFormCollab;
