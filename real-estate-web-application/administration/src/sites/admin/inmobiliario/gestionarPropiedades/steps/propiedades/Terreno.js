import React from 'react';
import {
  Dropdown,
  DropdownButton,
  InputGroup,
  Form as Formo
} from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import { TerrenoSchema } from '../../validations/propertiesValidation';
import './styles.css';

const Terreno = ({
  data,
  setData,
  yupSubmitRef,
  handleSubmit
}) => {

  return (
    <>
      <Formik
        initialValues={{
          totalSurface: data.surface.totalSurface,
          type: data.antiquity.type,
          years: data.antiquity.years,
          total: data.price.total,
          expenses: data.price.expenses,
          description: data.description
        }}
        validationSchema={TerrenoSchema}
        onSubmit={values =>
          handleSubmit({
            surface: {
              totalSurface: values.totalSurface,
            },
            price: { total: values.total, currency: data.price.currency },
            description: values.description
          })
        }
      >
        {({ errors, touched, values, setValues }) => {
          return (
            <Form>
              <div className="w-100">
                <div className="pb-5 d-flex">
                  <div className="me-5">
                    <label>Superficie *</label>
                    <InputGroup size="sm" style={{ width: 200 }}>
                      <InputGroup.Text id="basic-addon1">m2</InputGroup.Text>
                      <Field className="form-control" name="totalSurface" />
                    </InputGroup>
                      {errors.totalSurface && touched.totalSurface && (
                        <label style={{ color: '#da1717e8' }}>
                          {errors.totalSurface}
                        </label>
                      )}
                  </div>
                </div>
                <div className="pb-5">
                  <div className="d-flex flex-row">
                    <div className="pe-4">
                      <label>Precio de la propiedad *</label>
                      <InputGroup size="sm" style={{ width: 200 }}>
                        <DropdownButton
                          variant="secondary"
                          title={data.price.currency === 1 ? 'USD' : 'ARS'}
                          id="input-group-dropdown-1"
                          menuVariant="dark"
                          size="lg"
                        >
                          <Dropdown.Item
                            onClick={e =>
                              setData({
                                ...data,
                                price: {
                                  ...data.price,
                                  currency: parseInt(e.target.id)
                                }
                              })
                            }
                            id={1}
                          >
                            USD
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={e =>
                              setData({
                                ...data,
                                price: {
                                  ...data.price,
                                  currency: parseInt(e.target.id)
                                }
                              })
                            }
                            id={2}
                          >
                            ARS
                          </Dropdown.Item>
                        </DropdownButton>
                        <Field className="form-control" name="total" />
                        {errors.total && touched.total && (
                          <label style={{ color: '#da1717e8' }}>
                            {errors.total}
                          </label>
                        )}
                      </InputGroup>
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <label>Descripción *</label>
                  </div>
                  <Field
                    style={{ resize: 'none' }}
                    className="form-control w-100"
                    rows="4"
                    name="description"
                    component="textarea"
                  />
                  {errors.description && touched.description && (
                    <label style={{ color: '#da1717e8' }}>
                      {errors.description}
                    </label>
                  )}
                </div>
              </div>
              <button hidden ref={yupSubmitRef}></button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default Terreno;