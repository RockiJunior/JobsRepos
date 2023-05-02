import React from 'react';
import { InputGroup } from 'react-bootstrap';
import { Field } from 'formik';

export const Expensas = ({ errors, touched }) => (
  <div>
    <label>Expensas</label>
    <InputGroup size="sm" style={{ maxWidth: '150px' }}>
      <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
      <Field className="form-control" name="expenses" />
    </InputGroup>
    {errors.expenses && touched.expenses && (
      <label className="w-100 text-danger">{errors.expenses}</label>
    )}
  </div>
);
