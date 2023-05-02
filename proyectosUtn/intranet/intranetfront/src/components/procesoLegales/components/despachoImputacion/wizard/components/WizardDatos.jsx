import React from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

const WizardDatos = ({ setFormData, formData, setErrors, errors }) => {
  return (
    <div className="w-100">
      <Form.Group>
        <Form.Label>Título</Form.Label>
        <Form.Control
          type="text"
          placeholder="Título"
          name="titulo"
          value={formData.titulo}
          onChange={e => {
            setFormData({ ...formData, titulo: e.target.value });
            setErrors({ ...errors, titulo: '' });
          }}
          isInvalid={errors.titulo}
        />

        <Form.Control.Feedback type="invalid">
          {errors.titulo}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          type="text"
          placeholder="Descripción"
          name="motivo"
          as="textarea"
          value={formData.motivo}
          onChange={e => {
            setFormData({ ...formData, motivo: e.target.value });
            setErrors({ ...errors, motivo: '' });
          }}
          isInvalid={errors.motivo}
        />

        <Form.Control.Feedback type="invalid">
          {errors.motivo}
        </Form.Control.Feedback>
      </Form.Group>
    </div>
  );
};

WizardDatos.propTypes = {
  setFormData: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  setErrors: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

export default WizardDatos;
