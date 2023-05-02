import React from 'react';
import { Field } from 'formik';

export const Antiquity = ({ values, setValues, errors, touched }) => (
  <div>
    <label>Antigüedad *</label>
    <div>
      <Field
        type="radio"
        name="type"
        value={1}
        checked={parseInt(values.type) === 1}
        onClick={() => setValues({ ...values, years: 1 })}
      />
      <label className="ps-2">A estrenar</label>
    </div>

    <div>
      <div>
        <Field
          type="radio"
          name="type"
          value={2}
          checked={parseInt(values.type) === 2}
        />
        <label className="ps-2">Años de antigüedad</label>
      </div>
      {parseInt(values.type) === 2 && (
        <>
          <Field
            className="form-control form-control-sm ms-1"
            name="years"
            style={{ maxWidth: '150px' }}
          />
          {errors.years && touched.years && (
            <label className="w-100 text-danger">{errors.years}</label>
          )}
        </>
      )}
    </div>

    <div>
      <Field
        type="radio"
        name="type"
        value={3}
        checked={parseInt(values.type) === 3}
        onClick={() => setValues({ ...values, years: 1 })}
      />
      <label className="ps-2 mb-0">En construcción</label>
    </div>
    {errors.type && touched.type && (
      <label className="w-100 text-danger">{errors.type}</label>
    )}
  </div>
);
