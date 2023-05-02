import React from 'react';
import { InputGroup } from 'react-bootstrap';
import { Field } from 'formik';

export const CoveredSurface = ({ errors, touched }) => (
  <div>
    <label>Superficie cubierta *</label>
    <InputGroup size="sm" style={{ maxWidth: '150px' }}>
      <InputGroup.Text id="basic-addon1">m2</InputGroup.Text>
      <Field className="form-control" name="coveredSurface" />
    </InputGroup>
    {errors.coveredSurface && touched.coveredSurface && (
      <label className="w-100 text-danger">{errors.coveredSurface}</label>
    )}
  </div>
);
