import React from 'react';
import { Field } from 'formik';

export const Description = ({ touched, errors }) => (
  <div className="w-100">
    <label>Descripción *</label>

    <Field
      style={{ resize: 'none' }}
      className="form-control w-100"
      rows="4"
      name="description"
      component="textarea"
    />
    {errors.description && touched.description && (
      <label className="w-100 text-danger">{errors.description}</label>
    )}
  </div>
);
