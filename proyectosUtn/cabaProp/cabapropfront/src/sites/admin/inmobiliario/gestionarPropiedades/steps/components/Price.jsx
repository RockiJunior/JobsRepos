import React from 'react';
import { Dropdown, DropdownButton, InputGroup } from 'react-bootstrap';
import { Field } from 'formik';

export const Price = ({ values, setValues, errors, touched }) => (
  <div>
    <label>Precio de la propiedad *</label>
    <InputGroup size="sm" style={{ maxWidth: '150px' }}>
      <DropdownButton
        variant="secondary"
        defaultValues={values.currency}
        id="input-group-dropdown-1"
        menuVariant="dark"
        size="lg"
        title={values.currency === 1 ? 'USD' : 'ARS'}
      >
        <Dropdown.Item
          onClick={e =>
            setValues(prev => ({
              ...prev,
              currency: parseInt(e.target.id)
            }))
          }
          id={1}
        >
          USD
        </Dropdown.Item>
        <Dropdown.Item
          onClick={e =>
            setValues(prev => ({
              ...prev,
              currency: parseInt(e.target.id)
            }))
          }
          id={2}
        >
          ARS
        </Dropdown.Item>
      </DropdownButton>

      <Field className="form-control" name="total" />
      {errors.total && touched.total && (
        <label className="w-100 text-danger">{errors.total}</label>
      )}
    </InputGroup>
  </div>
);
