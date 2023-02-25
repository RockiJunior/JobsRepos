import React from 'react';
import { listaBarrios } from '../mockup/barrios';
import InputAddressAutocomplete from './utils/InputAutocomplete.jsx';
import GoogleMap from './utils/GoogleMap.js';
/* import { Marker } from 'google-maps-react'; */
import { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { LocationSchema } from '../validations/propertiesValidation';

const Ubicacion = ({ data, yupSubmitRef, handleSubmit }) => {
  const [ready, setReady] = useState(false);
  const [emptyInput, setEmptyInput] = useState(false);
  return (
    <>
      {data && (
        <>
          <Formik
            initialValues={{
              street: data.location.street,
              number: data.location.number,
              barrio: data.location.barrio,
              lat: data.location.lat,
              lng: data.location.lng,
              cp: "",
              cp_suffix: "",
              area_level_1: "",
              area_level_2: "",
              locality: ""
            }}
            validationSchema={LocationSchema}
            onSubmit={values =>
              handleSubmit({
                location: { ...values}
              })
            }
          >
            {({ errors, setValues, values }) => {
              return (
                <Form className="contact_form profile mb30">
                  <div className="d-flex flex-row w-100 justify-content-between">
                    <div
                      className="d-flex flex-column"
                      style={{ width: '45%' }}
                    >
                      <div className="d-flex flex-column mb-4">
                        <label className="mb-2">Ingrese la dirección:</label>
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
                      </div>
                      <div className="">
                        <div className='d-flex'>
                          <div className="d-flex flex-column mb-4 me-5">
                            <label className="mb-2">Calle</label>
                            <Field
                              type="text"
                              name="street"
                              className="form-control-sm"
                              value={values.street}
                              disabled
                            />
                          </div>
                          <div className="d-flex flex-column mb-4">
                            <label className="mb-2">Altura</label>
                            <Field
                              type="number"
                              className="form-control-sm"
                              name="number"
                              value={values.number}
                              disabled
                            />
                          </div>
                        </div>

                        {values.lat && (
                          <div className="d-flex flex-column mb-4">
                            <label className="mb-2">Barrio *</label>
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
                                  <option
                                    selected={
                                      values.barrio === Number(value)
                                    }
                                    key={value}
                                    value={value}
                                  >
                                    {label}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="google-map">
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
                  </div>
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
