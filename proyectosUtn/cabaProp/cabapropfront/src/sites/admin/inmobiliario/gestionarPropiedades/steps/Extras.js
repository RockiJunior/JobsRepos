import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Col, FormCheck, FormGroup, Row } from 'react-bootstrap';
import {
  BodegaExtras,
  ConsultorioExtras,
  EdificioExtras,
  FondoDeComercioExtras,
  GarageExtras,
  HotelExtras,
  LocalExtras,
  OficinaExtras,
  PHExtras,
  apartmentExtras,
  houseExtras
} from '../mockup/extrasMockup';

const getExtrasProps = type => {
  switch (type) {
    case 1:
      return apartmentExtras;
    case 2:
      return houseExtras;
    case 3:
      return PHExtras;
    case 4:
      return GarageExtras;
    case 5:
      return ConsultorioExtras;
    case 6:
      return FondoDeComercioExtras;
    case 7:
      return LocalExtras;
    case 8:
      return OficinaExtras;
    case 9:
      return BodegaExtras;
    case 11:
      return HotelExtras;
    case 12:
      return EdificioExtras;
    case 13:
      return LocalExtras;
    default:
      return null;
  }
};

const Extras = ({ data, handleSubmit, yupSubmitRef, setStepStatus }) => {
  const [extrasProps, setExtrasProps] = useState(
    getExtrasProps(data.property_type)
  );

  useEffect(() => {
    setExtrasProps(getExtrasProps(data.property_type));
  }, [data]);

  return (
    <div>
      <Formik
        initialValues={{
          ...data
        }}
        onSubmit={values => handleSubmit(values)}
      >
        {({ values, setValues }) => {
          //hanlders
          const handleCheck = (id, e) => {
            setValues({
              ...values,
              extras: {
                ...values.extras,
                [id]: e.target.checked
              }
            });
          };

          useEffect(() => {
            setStepStatus(prev => ({
              ...prev,
              ...values
            }));
          }, [values]);

          return (
            <Form>
              {extrasProps ? (
                <>
                  {extrasProps.caracteristicasGenerales && (
                    <div className="pb-3">
                      <label className="fw-bold fs-1">
                        Características generales
                      </label>

                      <Row>
                        {extrasProps.caracteristicasGenerales
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map(item => (
                            <Col xs={12} md={6} lg={4} key={item.id}>
                              <FormGroup size="sm">
                                <FormCheck
                                  checked={values.extras[item.id]}
                                  onChange={e => handleCheck(item.id, e)}
                                  id={`checkbox${item.id}`}
                                  label={item.name}
                                />
                              </FormGroup>
                            </Col>
                          ))}
                      </Row>
                    </div>
                  )}

                  {extrasProps.caracteristicas && (
                    <div className="pb-3">
                      <label className="fw-bold fs-1">Caracteristicas</label>
                      <Row>
                        {extrasProps.caracteristicas
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map(item => (
                            <Col xs={12} md={6} lg={4} key={item.id}>
                              <FormGroup size="sm">
                                <FormCheck
                                  checked={values.extras[item.id]}
                                  onChange={e => handleCheck(item.id, e)}
                                  id={`checkbox${item.id}`}
                                  label={item.name}
                                />
                              </FormGroup>
                            </Col>
                          ))}
                      </Row>
                    </div>
                  )}

                  {extrasProps.services && (
                    <div className="pb-3">
                      <label className="fw-bold fs-1">Servicios</label>
                      <Row>
                        {extrasProps.servicios
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map(item => (
                            <Col xs={12} md={6} lg={4} key={item.id}>
                              <FormGroup size="sm">
                                <FormCheck
                                  checked={values.extras[item.id]}
                                  onChange={e => handleCheck(item.id, e)}
                                  id={`checkbox${item.id}`}
                                  label={item.name}
                                />
                              </FormGroup>
                            </Col>
                          ))}
                      </Row>
                    </div>
                  )}

                  {extrasProps.ambientes && (
                    <div className="pb-3">
                      <label className="fw-bold fs-1">Ambientes</label>
                      <Row>
                        {extrasProps.ambientes
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map(item => {
                            return (
                              <Col xs={12} md={6} lg={4} key={item.id}>
                                <FormGroup size="sm">
                                  <FormCheck
                                    checked={values.extras[item.id]}
                                    onChange={e => handleCheck(item.id, e)}
                                    id={`checkbox${item.id}`}
                                    label={item.name}
                                  />
                                </FormGroup>
                              </Col>
                            );
                          })}
                      </Row>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <h2>Esta propiedad no tiene extras</h2>
                </div>
              )}
              <button hidden ref={yupSubmitRef}></button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Extras;
