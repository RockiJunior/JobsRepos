import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Form, Row, Col } from 'react-bootstrap';
/* import Divider from 'components/common/Divider';
import SocialAuthButtons from './SocialAuthButtons'; */
import { ToastContent } from 'components/common/Toast';
import validate from 'components/admin/validate';
/* import { createAdmin } from 'actions/admin';
 */
const RegistrationForm = ({ hasLabel }) => {
  // State
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    isAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [flag, setFlag] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { newAdmin, error } = useSelector(state => state.adminReducer);

  useEffect(async () => {
    if (newAdmin) {
      toast(
        <ToastContent
          title="Registro exitoso!"
          body={'Te registraste como ' + newAdmin.email}
          time="Justo ahora"
        />
      );

      navigate('/confirmmail/' + btoa(newAdmin.email));
    } else if (flag) {
      toast(
        <ToastContent
          title="Error al registrarse!"
          body={'Por favor, intenta de nuevo'}
          time="Justo ahora"
        />
      );
    }
  }, [newAdmin, error]);

  // Handler
  /* const handleSubmit = e => {
    e.preventDefault();
    // eslint-disable-next-line no-unused-vars
    const { isAccepted, confirmPassword, ...rest } = formData;
    setFlag(true);
    dispatch(createAdmin({ ...rest, email: rest.email.toLowerCase() }));
  };

  const handleFieldChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors(state =>
      validate(
        { ...formData, [event.target.name]: event.target.value },
        e.target.name,
        state
      )
    );
  }; */

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="g-2 mb-3">
        <Form.Group as={Col} sm={6}>
          {hasLabel && <Form.Label>Nombre</Form.Label>}
          <Form.Control
            placeholder={!hasLabel ? 'Nombre' : ''}
            value={formData.name}
            name="name"
            onChange={handleFieldChange}
            type="text"
            isInvalid={errors.name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} sm={6}>
          {hasLabel && <Form.Label>Apellido</Form.Label>}
          <Form.Control
            placeholder={!hasLabel ? 'Apellido' : ''}
            value={formData.lastName}
            name="lastName"
            onChange={handleFieldChange}
            type="text"
            isInvalid={errors.lastName}
          />
          <Form.Control.Feedback type="invalid">
            {errors.lastName}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Email</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'Email' : ''}
          value={formData.email}
          name="email"
          onChange={handleFieldChange}
          type="text"
          isInvalid={errors.email}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email}
        </Form.Control.Feedback>
      </Form.Group>

      <Row className="g-2 mb-3">
        <Form.Group as={Col} sm={6}>
          {hasLabel && <Form.Label>Contraseña</Form.Label>}
          <Form.Control
            placeholder={!hasLabel ? 'Contraseña' : ''}
            value={formData.password}
            name="password"
            onChange={handleFieldChange}
            type="password"
          />
        </Form.Group>
        <Form.Group as={Col} sm={6}>
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
            !formData.lastName ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword ||
            formData.password !== formData.confirmPassword ||
            !formData.isAccepted ||
            Object.keys(errors).length
          }
        >
          Registrarse
        </Button>
      </Form.Group>
      {/* <Divider>or register with</Divider>

      <SocialAuthButtons /> */}
    </Form>
  );
};

RegistrationForm.propTypes = {
  hasLabel: PropTypes.bool
};

export default RegistrationForm;
