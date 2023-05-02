import React from 'react';
import { listaBarrios } from '../mockup/barrios';
import InputAddressAutocomplete from './utils/InputAutocomplete.jsx';
import GoogleMap from './utils/GoogleMap.js';
/* import { Marker } from 'google-maps-react'; */
import { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { LocationSchema } from '../validations/propertiesValidation';
import { useEffect } from 'react';
import lodash from 'lodash';
import { Col, Row } from 'react-bootstrap';

const Ubicacion = ({ data, yupSubmitRef, handleSubmit, setStepStatus }) => {
  const [ready, setReady] = useState(false);
  const [emptyInput, setEmptyInput] = useState(false);
  const [initialValues, setInitialValues] = useState({
    street: data.location.street,
    number: data.location.number,
    barrio: data.location.barrio,
    lat: data.location.lat,
    lng: data.location.lng,
    cp: '',
    cp_suffix: '',
    area_level_1: '',
    area_level_2: '',
    locality: ''
  });

  useEffect(() => {
    setInitialValues({
      street: data.location.street,
      number: data.location.number,
      barrio: data.location.barrio,
      lat: data.location.lat,
      lng: data.location.lng,
      cp: '',
      cp_suffix: '',
      area_level_1: '',
      area_level_2: '',
      locality: ''
    });
  }, [data]);

  return (
    <>
      {data && (
        <>
          <Formik
            initialValues={initialValues}
            validationSchema={LocationSchema}
            onSubmit={values =>
              handleSubmit(
                {
                  location: { ...values }
                },
                lodash.isEqual(values, initialValues)
              )
            }
          >
            {({ errors, setValues, values }) => {
              useEffect(() => {
                setStepStatus(prev => ({
                  ...prev,
                  location: { ...values }
                }));
              }, [values]);

              return (
                <Form
                  className="contact_form profile mb30"
                  onKeyPress={e => {
                    e.key === 'Enter' && e.preventDefault();
                  }}
                >
                  <Row className="g-3">
                    <Col xs={12}>
                      <label className="mb-2 w-100">Ingrese la dirección</label>

                      <InputAddressAutocomplete
                        ready={ready}
                        values={values}
                        setValues={setValues}
                        emptyInput={emptyInput}
                        setEmptyInput={setEmptyInput}
                        name="autocomplete"
                      />
                      {errors.street && errors.number && emptyInput ? (
                        <label style={{ color: '#da1717e8' }}>
                          Este campo es obligatorio
                        </label>
                      ) : (
                        (errors.street || errors.number || errors.barrio) && (
                          <label style={{ color: '#da1717e8' }}>
                            Dirección inválida
                          </label>
                        )
                      )}
                    </Col>

                    <Col xs={12} sm={6} lg={3}>
                      <label className="mb-2 w-100">Calle</label>
                      <Field
                        type="text"
                        name="street"
                        className="form-control-sm w-100"
                        value={values.street}
                        disabled
                      />
                    </Col>

                    <Col xs={12} sm={6} lg={3}>
                      <label className="mb-2 w-100">Altura</label>
                      <Field
                        type="number"
                        className="form-control-sm w-100"
                        name="number"
                        value={values.number}
                        disabled
                      />
                    </Col>

                    {values.lat && (
                      <Col xs={12} lg={6}>
                        <label className="mb-2 w-100">Barrio *</label>
                        <select
                          size="sm"
                          className="form-select form-select-sm"
                          name="barrio"
                          defaultValue={values.barrio}
                          onChange={e =>
                            setValues({
                              ...values,
                              barrio: e.target.value
                            })
                          }
                        >
                          <option key={0} hidden>
                            Selecciona el barrio
                          </option>
                          {listaBarrios.map(({ value, label }) => {
                            return (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            );
                          })}
                        </select>
                      </Col>
                    )}
                  </Row>

                  <Row className="g-3 mt-3">
                    <Col className="google-map">
                      <GoogleMap
                        values={values}
                        setValues={setValues}
                        mapStyle="Beard"
                        darkStyle="Beard"
                        zoom={values.lat ? 17 : 11}
                        onReady={() => setReady(true)}
                        center={
                          values.lat && values.lng
                            ? { lat: values.lat, lng: values.lng }
                            : { lat: -34.6106694, lng: -58.4300401 }
                        }
                      />
                    </Col>
                  </Row>
                  <button hidden ref={yupSubmitRef}></button>
                </Form>
              );
            }}
          </Formik>
        </>
      )}
    </>
  );
};

export default Ubicacion;
