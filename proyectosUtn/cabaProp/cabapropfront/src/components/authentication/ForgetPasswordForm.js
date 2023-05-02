import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';
import messageHandler from 'utils/messageHandler';
import { useDispatch } from 'react-redux';
import { GetRecoveryPassword } from 'redux/colabsSlice';
import { Link } from 'react-router-dom';

const ForgetPasswordForm = () => {
  // State
  const [email, setEmail] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
  const token = localStorage.getItem("token")
  const dispatch = useDispatch()

  // Handler
  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true)
    if (email && emailPattern.test(email)) {
      try {
        await dispatch(GetRecoveryPassword(email))
        setIsLoading(false)
      } catch (e) {
        return e
      }
    } else {
      messageHandler('error', 'El email ingresado no es válido, por favor ingrese uno real.')
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
            if (!emailPattern.test(target.value)) {
              setIsInvalid(true);
            } else {
              setIsInvalid(false);
            }
          }}
          type="text"
          isValid={!isInvalid && email.length > 0 && emailPattern.test(email)}
          isInvalid={isInvalid}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Button className="w-100" type="submit" disabled={isLoading || isInvalid}>
          Enviar link
        </Button>
      </Form.Group>
      <center>
        <Link className="fs--1 mb-0" to={`/ingresar`}>
          Volver a iniciar sesión.
        </Link>
      </center>
    </Form>
  );
};

ForgetPasswordForm.propTypes = {
  layout: PropTypes.string
};

ForgetPasswordForm.defaultProps = { layout: 'simple' };

export default ForgetPasswordForm;
