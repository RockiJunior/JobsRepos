import React from 'react';
import {
  Button,
  Dropdown,
  DropdownButton,
  InputGroup,
  Form as Formo
} from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import { ApartmentSchema } from '../../validations/propertiesValidation';
import './styles.css';

const Local = ({
  data,
  setData,
  yupSubmitRef,
  handleSubmit
}) => {
  //handlers
  const handleChangeCarac = (e, value, action) => {
    e.preventDefault();
    setData({
      ...data,
      characteristics: {
        ...data.characteristics,
        [value]:
          action === 'add'
            ? data.characteristics[value] + 1
            : data.characteristics[value] > 0
            ? data.characteristics[value] - 1
            : 0
      }
    });
  };

  return (
    <>
      <Formik
        initialValues={{
          totalSurface: data.surface.totalSurface,
          coveredSurface: data.surface.coveredSurface,
          type: data.antiquity.type,
          years: data.antiquity.years,
          total: data.price.total,
          expenses: data.price.expenses,
          description: data.description
        }}
        validationSchema={ApartmentSchema}
        onSubmit={values =>
          handleSubmit({
            surface: {
              totalSurface: values.totalSurface,
              coveredSurface: values.coveredSurface
            },
            antiquity: { type: values.type, years: values.years },
            price: { total: values.total, expenses: values.expenses, currency: data.price.currency },
            description: values.description
          })
        }
      >
        {({ errors, touched, values, setValues }) => {
          return (
            <Form>
              <div className="w-100">
                <p className="fw-bold">Caracteristicas principales</p>
                <div className="d-flex flex-row flex-wrap w-100 pb-3">
                  <div className="me-7 text-center mb-4">
                    <label>Ambientes</label>
                    <div className="caracteristicas__box">
                      <Button
                        variant="falcon-default"
                        className="rounded-pill mx-2 py-0 px-2"
                        size="sm"
                        onClick={e => handleChangeCarac(e, 'ambience', 'rest')}
                      >
                        -
                      </Button>
                      <span className="caracteristicas__quantity">
                        {data.characteristics.ambience}
                      </span>
                      <Button
                        variant="falcon-default"
                        className="rounded-pill mx-2 px-2 py-0"
                        size="sm"
                        onClick={e => handleChangeCarac(e, 'ambience', 'add')}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="me-7 text-center mb-4">
                    <label>Dormitorios</label>
                    <div className="caracteristicas__box">
                      <Button
                        variant="falcon-default"
                        className="rounded-pill mx-2 px-2 py-0"
                        size="sm"
                        onClick={e => handleChangeCarac(e, 'bedrooms', 'rest')}
                      >
                        -
                      </Button>
                      <span className="caracteristicas__quantity">
                        {data.characteristics.bedrooms}
                      </span>
                      <Button
                        variant="falcon-default"
                        className="rounded-pill mx-2 px-2 py-0"
                        size="sm"
                        onClick={e => handleChangeCarac(e, 'bedrooms', 'add')}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="me-7 text-center mb-4">
                    <label>Baños</label>
                    <div className="caracteristicas__box">
                      <Button
                        variant="falcon-default"
                        className="rounded-pill mx-2 px-2 py-0"
                        size="sm"
                        onClick={e => handleChangeCarac(e, 'bathrooms', 'rest')}
                      >
                        -
                      </Button>
                      <span className="caracteristicas__quantity">
                        {data.characteristics.bathrooms}
                      </span>
                      <Button
                        variant="falcon-default"
                        className="rounded-pill mx-2 px-2 py-0"
                        size="sm"
                        onClick={e => handleChangeCarac(e, 'bathrooms', 'add')}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="me-7 text-center mb-4">
                    <label>Toilettes</label>
                    <div className="caracteristicas__box">
                      <Button
                        variant="falcon-default"
                        className="rounded-pill mx-2 px-2 py-0"
                        size="sm"
                        onClick={e => handleChangeCarac(e, 'toilettes', 'rest')}
                      >
                        -
                      </Button>
                      <span className="caracteristicas__quantity">
                        {data.characteristics.toilettes}
                      </span>
                      <Button
                        variant="falcon-default"
                        className="rounded-pill mx-2 px-2 py-0"
                        size="sm"
                        onClick={e => handleChangeCarac(e, 'toilettes', 'add')}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="me-7 text-center mb-4">
                    <label>Cocheras</label>
                    <div className="caracteristicas__box">
                      <Button
                        variant="falcon-default"
                        className="rounded-pill mx-2 px-2 py-0"
                        size="sm"
                        onClick={e => handleChangeCarac(e, 'garages', 'rest')}
                      >
                        -
                      </Button>
                      <span className="caracteristicas__quantity">
                        {data.characteristics.garages}
                      </span>
                      <Button
                        variant="falcon-default"
                        className="rounded-pill mx-2 px-2 py-0"
                        size="sm"
                        onClick={e => handleChangeCarac(e, 'garages', 'add')}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pb-5 d-flex">
                  <div className="me-5">
                    <label>Superficie total *</label>
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
                  <div>
                    <label>Superficie cubierta *</label>
                    <InputGroup size="sm" style={{ width: 200 }}>
                      <InputGroup.Text id="basic-addon1">m2</InputGroup.Text>
                      <Field className="form-control" name="coveredSurface"/>
                    </InputGroup>
                      {errors.coveredSurface && touched.coveredSurface && (
                        <label style={{ color: '#da1717e8' }}>
                          {errors.coveredSurface}
                        </label>
                      )}
                  </div>
                </div>

                <div className="pb-4">
                  <label>Antigüedad *</label>
                  <div>
                    <Field
                      type="radio"
                      name="type"
                      value={1}
                      checked={parseInt(values.type) === 1}
                      onClick={()=>setValues({...values, years: 1})}
                    />
                    <label className="ps-2">A estrenar</label>
                  </div>

                  <div className="d-flex align-items-center">
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
                          style={{ width: 70 }}
                          className="form-control ms-1"
                          name="years"
                        />
                        {errors.years && touched.years && (
                          <label
                            className="ps-2"
                            style={{ color: '#da1717e8' }}
                          >
                            {errors.years}
                          </label>
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
                      onClick={()=>setValues({...values, years: 1})}
                    />
                    <label className="ps-2">En construcción</label>
                  </div>
                  {errors.type && touched.type && (
                    <label className="ps-2" style={{ color: '#da1717e8' }}>
                      {errors.type}
                    </label>
                  )}
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
                    <div>
                      <label>Expensas</label>
                      <InputGroup size="sm" style={{ width: 200 }}>
                        <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
                        <Field className="form-control" name="expenses" />
                      </InputGroup>
                      {errors.expenses && touched.expenses && (
                        <label style={{ color: '#da1717e8' }}>
                          {errors.expenses}
                        </label>
                      )}
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

export default Local;