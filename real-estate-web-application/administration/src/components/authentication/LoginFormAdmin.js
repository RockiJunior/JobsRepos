import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { loginAdmin } from 'redux/loginSlice';
import { useSelector } from 'react-redux';

const LoginFormAdmin = ({ hasLabel }) => {
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
      dispatch(loginAdmin(formData))
    } catch (error) {
      console.log(e)
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
        <Link className="fs--1 mb-0" to={`/collab/recuperar-contraseña`}>
          ¿Olvidó su contraseña?
        </Link>
      </center>
      <center>
        <Link className="fs--1 mb-0" to={`/ingresar`}>
          Ingresar como colaborador
        </Link>
      </center>
      {/* <Divider className="mt-4">or log in with</Divider>

      <SocialAuthButtons /> */}
    </Form>
  );
};

LoginFormAdmin.propTypes = {
  layout: PropTypes.string,
  hasLabel: PropTypes.bool
};

LoginFormAdmin.defaultProps = {
  layout: 'simple',
  hasLabel: false
};

export default LoginFormAdmin;
