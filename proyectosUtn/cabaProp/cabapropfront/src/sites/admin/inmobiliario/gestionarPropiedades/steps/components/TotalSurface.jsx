import React from 'react';
import { InputGroup } from 'react-bootstrap';
import { Field } from 'formik';

export const TotalSurface = ({ errors, touched, noTotal }) => (
  <div>
    <label>Superficie {!noTotal && 'total '}*</label>
    <InputGroup size="sm" style={{ maxWidth: '150px' }}>
      <InputGroup.Text id="basic-addon1">m2</InputGroup.Text>
      <Field className="form-control" name="totalSurface" />
    </InputGroup>
    {errors.totalSurface && touched.totalSurface && (
      <label className="w-100 text-danger">{errors.totalSurface}</label>
    )}
  </div>
);
