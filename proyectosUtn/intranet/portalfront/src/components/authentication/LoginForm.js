import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { login } from 'redux/actions/auth';

const LoginForm = ({ hasLabel }) => {
  const [formData, setFormData] = useState({
    email: localStorage.getItem('remember')
      ? localStorage.getItem('remember')
      : '',
    password: '',
    remember: false
  });
  const [showPass, setShowPass] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    if (formData.remember) {
      localStorage.setItem('remember', formData.email);
    }

    dispatch(login(formData, navigate));
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
          placeholder={!hasLabel ? 'Email' : ''}
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

      <Row className="justify-content-between align-items-center">
        <Col xs="auto">
          <Form.Check type="checkbox" id="rememberMe">
            <Form.Check.Input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={e =>
                setFormData({
                  ...formData,
                  remember: e.target.checked
                })
              }
            />
            <Form.Check.Label className="mb-0">
              Recordar Usuario
            </Form.Check.Label>
          </Form.Check>
        </Col>
      </Row>

      <Form.Group>
        <Button
          type="submit"
          color="primary"
          className="mt-3 mb-3 w-100"
          disabled={!formData.email || !formData.password}
        >
          Iniciar sesión
        </Button>
      </Form.Group>

      <center>
        <Link className="fs--1 mb-0" to={`/recuperar-contrasenia`}>
          ¿Olvidó su contraseña?
        </Link>
      </center>
      <center>
        <div className="mt-2">
          <Link to="/register">Crear una cuenta</Link>
        </div>
      </center>
    </Form>
  );
};

LoginForm.propTypes = {
  layout: PropTypes.string,
  hasLabel: PropTypes.bool
};

LoginForm.defaultProps = {
  layout: 'simple',
  hasLabel: false
};

export default LoginForm;
