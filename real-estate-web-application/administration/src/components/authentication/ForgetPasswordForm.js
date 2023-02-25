import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import messageHandler from 'utils/messageHandler';
import { useDispatch } from 'react-redux';
import { RecoverPassword } from 'redux/colabsSlice';

const ForgetPasswordForm = () => {
  // State
  const [email, setEmail] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);

  const token = localStorage.getItem("token")
  const dispatch = useDispatch()

  // Handler
  const handleSubmit = async e => {
    e.preventDefault();
    if (email && /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      dispatch(RecoverPassword(email, token))
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
