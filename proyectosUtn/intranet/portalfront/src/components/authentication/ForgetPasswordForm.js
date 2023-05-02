import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

const ForgetPasswordForm = () => {
  // State
  const [email, setEmail] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);

  // Handler
  const handleSubmit = async e => {
    e.preventDefault();
    if (email && /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      try {
        await axios.post(
          process.env.REACT_APP_SERVER + '/auth/recuperar-contrasenia',
          { email }
        );

        toast.success(
          `Un email fue enviado a ${email} con el link para restablecer la contraseña`
        );
      } catch (e) {
        toast.error(e.response?.data?.message);
      }
    } else {
      toast.error('El email no es válido');
    }
  };

  return (
    <Form className="mt-4" onSubmit={handleSubmit}>
      <Form.Group className="mb-3 text-start">
        <Form.Label>Email</Form.Label>
        <Form.Control
          value={email}
          name="email"
          onChange={({ target }) => {
            setEmail(target.value);
            if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(target.value)) {
              setIsInvalid(true);
            } else {
              setIsInvalid(false);
            }
          }}
          type="text"
          isInvalid={isInvalid}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Button className="w-100" type="submit" disabled={!email}>
          Enviar link
        </Button>
      </Form.Group>
    </Form>
  );
};

ForgetPasswordForm.propTypes = {
  layout: PropTypes.string
};

ForgetPasswordForm.defaultProps = { layout: 'simple' };

export default ForgetPasswordForm;
