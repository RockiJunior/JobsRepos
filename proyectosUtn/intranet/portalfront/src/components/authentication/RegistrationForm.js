import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { register } from 'redux/actions/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const validate = (errors, value, name, formData) => {
  const newErrors = { ...errors };

  switch (name) {
    case 'nombre':
      if (!value) {
        newErrors.name = 'El nombre es requerido';
      } else {
        delete newErrors.name;
      }
      break;

    case 'apellido':
      if (!value) {
        newErrors.lastname = 'El apellido es requerido';
      } else {
        delete newErrors.lastname;
      }
      break;

    case 'email':
      const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!value) {
        newErrors.email = 'El email es requerido';
      } else if (!regex.test(value)) {
        newErrors.email = 'El email no es válido';
      } else {
        delete newErrors.email;
      }

      break;

    case 'dni':
      if (!value) {
        newErrors.dni = 'El DNI es requerido';
      } else if (value.length < 7 || value.length > 8) {
        newErrors.dni = 'El DNI no es válido';
      } else {
        delete newErrors.dni;
      }
      break;

    case 'password':
      if (!value) {
        newErrors.password = 'La contraseña es requerida';
      } else if (value.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      } else {
        delete newErrors.password;
      }
      break;

    case 'confirmPassword':
      if (value !== formData.password) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      } else {
        delete newErrors.confirmPassword;
      }
      break;

    default:
      break;
  }

  return newErrors;
};

const RegistrationForm = ({ hasLabel }) => {
  // State
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    dni: '',
    password: '',
    confirmPassword: '',
    isAccepted: false
  });

  const [sended, setSended] = useState(false);

  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handler
  const handleSubmit = e => {
    e.preventDefault();
    setSended(true);
    // eslint-disable-next-line no-unused-vars
    const { isAccepted, confirmPassword, ...rest } = formData;

    dispatch(register(rest, navigate, setSended));
  };

  const handleFieldChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setErrors(validate(errors, e.target.value, e.target.name, formData));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="g-2 mb-3">
        <Form.Group as={Col} sm={6} className="position-relative">
          {hasLabel && <Form.Label>Nombre</Form.Label>}
          <Form.Control
            placeholder={!hasLabel ? 'Nombre' : ''}
            value={formData.name}
            name="name"
            onChange={handleFieldChange}
            type="text"
            isInvalid={errors.name}
          />

          {!errors.name && (
            <FontAwesomeIcon
              style={{
                position: 'absolute',
                right: 10,
                bottom: 12,
                zIndex: 5
              }}
              className="text-danger fs--2"
              icon="asterisk"
            />
          )}

          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} sm={6} className="position-relative">
          {hasLabel && <Form.Label>Apellido</Form.Label>}
          <Form.Control
            placeholder={!hasLabel ? 'Apellido' : ''}
            value={formData.lastname}
            name="lastname"
            onChange={handleFieldChange}
            type="text"
            isInvalid={errors.lastname}
          />

          {!errors.lastname && (
            <FontAwesomeIcon
              style={{
                position: 'absolute',
                right: 10,
                bottom: 12,
                zIndex: 5
              }}
              className="text-danger fs--2"
              icon="asterisk"
            />
          )}

          <Form.Control.Feedback type="invalid">
            {errors.lastname}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Form.Group className="mb-3 position-relative">
        {hasLabel && <Form.Label>DNI</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'DNI' : ''}
          value={formData.dni}
          name="dni"
          onChange={handleFieldChange}
          type="number"
          isInvalid={errors.dni}
        />

        {!errors.dni && (
          <FontAwesomeIcon
            style={{
              position: 'absolute',
              right: 10,
              bottom: 12,
              zIndex: 5
            }}
            className="text-danger fs--2"
            icon="asterisk"
          />
        )}

        <Form.Control.Feedback type="invalid">
          {errors.dni}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3 position-relative">
        {hasLabel && <Form.Label>Email</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'Email' : ''}
          value={formData.email}
          name="email"
          onChange={handleFieldChange}
          type="text"
          isInvalid={errors.email}
        />

        {!errors.email && (
          <FontAwesomeIcon
            style={{
              position: 'absolute',
              right: 10,
              bottom: 12,
              zIndex: 5
            }}
            className="text-danger fs--2"
            icon="asterisk"
          />
        )}
        <Form.Control.Feedback type="invalid">
          {errors.email}
        </Form.Control.Feedback>
      </Form.Group>

      <Row className="g-2 mb-3">
        <Form.Group as={Col} sm={6} className="position-relative">
          {hasLabel && <Form.Label>Contraseña</Form.Label>}
          <Form.Control
            placeholder={!hasLabel ? 'Contraseña' : ''}
            value={formData.password}
            name="password"
            onChange={handleFieldChange}
            type="password"
          />

          {!errors.password && (
            <FontAwesomeIcon
              style={{
                position: 'absolute',
                right: 10,
                bottom: 12,
                zIndex: 5
              }}
              className="text-danger fs--2"
              icon="asterisk"
            />
          )}
        </Form.Group>

        <Form.Group as={Col} sm={6} className="position-relative">
          {hasLabel && <Form.Label>Confirmar contraseña</Form.Label>}
          <Form.Control
            placeholder={!hasLabel ? 'Confirmar contraseña' : ''}
            value={formData.confirmPassword}
            name="confirmPassword"
            onChange={handleFieldChange}
            type="password"
            isInvalid={
              formData.confirmPassword
                ? formData.confirmPassword !== formData.password
                : false
            }
          />

          {formData.confirmPassword === formData.password && (
            <FontAwesomeIcon
              style={{
                position: 'absolute',
                right: 10,
                bottom: 12,
                zIndex: 5
              }}
              className="text-danger fs--2"
              icon="asterisk"
            />
          )}

          <Form.Control.Feedback type="invalid">
            Las contraseñas no coinciden
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Form.Group className="mb-3">
        <Form.Check type="checkbox" id="acceptCheckbox" className="form-check">
          <Form.Check.Input
            type="checkbox"
            name="isAccepted"
            checked={formData.isAccepted}
            onChange={e =>
              setFormData({
                ...formData,
                isAccepted: e.target.checked
              })
            }
          />
          <Form.Check.Label className="form-label">
            Acepto los <Link to="/policy">términos</Link> y la{' '}
            <Link to="/policy">política de privacidad</Link>
          </Form.Check.Label>
        </Form.Check>
      </Form.Group>

      <Form.Group>
        <Button
          className="w-100"
          type="submit"
          disabled={
            !formData.name ||
            !formData.lastname ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword ||
            !formData.isAccepted ||
            sended ||
            Object.keys(errors).length
          }
        >
          {sended ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            'Registrarse'
          )}
        </Button>
      </Form.Group>
    </Form>
  );
};

RegistrationForm.propTypes = {
  hasLabel: PropTypes.bool
};

export default RegistrationForm;
