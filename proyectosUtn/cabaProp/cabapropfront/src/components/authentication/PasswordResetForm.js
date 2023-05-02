import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Button, Form } from 'react-bootstrap';
import classNames from 'classnames';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const PasswordResetForm = ({ hasLabel }) => {
  // State
  const [flag, setFlag] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const { email } = useParams();

  // Handler
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(process.env.REACT_APP_SERVER + '/admin/resetPassword', {
        email,
        password: formData.password
      });
      toast.success('La contraseña se ha cambiado correctamente');
      setFlag(true);
    } catch (e) {
      toast.error(e.response?.data?.message);
    }
  };

  const handleFieldChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return flag ? (
    <div>
      <p className="mt-4 font-sans-serif fw-semi-bold text-center">
        Su contraseña ha sido restablecida. <br /> <br /> Inicie sesión con su
        nueva contraseña haciendo click <Link href="/login">aquí.</Link>
      </p>
    </div>
  ) : (
    <Form
      className={classNames('mt-3', { 'text-left': hasLabel })}
      onSubmit={handleSubmit}
    >
      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Nueva contraseña</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'New Password' : ''}
          value={formData.password}
          name="password"
          onChange={handleFieldChange}
          type="password"
          isInvalid={!formData.password}
        />
        <Form.Control.Feedback type="invalid">
          {!formData.password.newPassword && 'Este campo es requerido'}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Confirmar contraseña</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'Confirm Password' : ''}
          value={formData.confirmPassword}
          name="confirmPassword"
          onChange={handleFieldChange}
          type="password"
          isInvalid={
            formData.password !== formData.confirmPassword ||
            !formData.confirmPassword
          }
        />
        <Form.Control.Feedback type="invalid">
          {!formData.confirmPassword
            ? 'Este campo es requerido'
            : 'Las contraseñas deben ser iguales'}
        </Form.Control.Feedback>
      </Form.Group>

      <Button
        type="submit"
        className="w-100"
        disabled={
          formData.password !== formData.confirmPassword ||
          !formData.confirmPassword
        }
      >
        Cambiar contraseña
      </Button>
    </Form>
  );
};

PasswordResetForm.propTypes = {
  hasLabel: PropTypes.bool
};

export default PasswordResetForm;
