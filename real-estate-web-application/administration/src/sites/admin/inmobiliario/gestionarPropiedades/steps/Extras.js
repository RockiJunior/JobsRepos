import { Formik, Form } from 'formik';
import React from 'react';
import {
  apartmentExtras,
  GarageExtras,
  houseExtras,
  PHExtras,
  BodegaExtras,
  LocalExtras,
  FondoDeComercioExtras,
  ConsultorioExtras
} from '../mockup/extrasMockup';

const Extras = ({ data, setData, handleSubmit, yupSubmitRef }) => {
  //hanlders
  const handleCheck = (category, id, e) => {
    setData({
      ...data,
      extras: {
        ...data.extras,
        [category]: {
          ...data.extras[category],
          [id]: e.target.checked
        }
      }
    });
  };

  const extrasProps =
    data.property_type === 1 ? apartmentExtras
      : data.property_type === 2 ? houseExtras
        : data.property_type === 3 ? PHExtras
          : data.property_type === 4 ? GarageExtras
            : data.property_type === 5 ? ConsultorioExtras
              : data.property_type === 6 ? FondoDeComercioExtras
                : data.property_type === 7 ? LocalExtras
                  : data.property_type === 8 && BodegaExtras


  return (
    <div>
      <Formik
        initialValues={{
          ...data
        }}
        onSubmit={values => handleSubmit(values)}
      >
        {({ values, setValues }) => {
          return (
            <Form>
              {extrasProps.caracteristicasGenerales && (
                <div className="pb-3">
                  <label className="fw-bold fs-1">
                    Caracteristicas generales
                  </label>
                  <div className="d-flex flex-wrap">
                    {extrasProps.caracteristicasGenerales.map(item => (
                      <div
                        className="d-flex flex-row"
                        key={item.id}
                        style={{ width: '33%' }}
                      >
                        <input
                          className="form-check-input me-2"
                          checked={
                            values.extras.generalCharacteristics[item.id]
                          }
                          onChange={e => {
                            setValues({
                              ...values,
                              extras: {
                                ...values.extras,
                                generalCharacteristics: {
                                  ...values.extras.generalCharacteristics,
                                  [item.id]: e.target.checked
                                }
                              }
                            });
                          }}
                          type="checkbox"
                          key={item.id}
                          id={`checkbox${item.id}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`checkbok${item.id}`}
                        >
                          {item.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {extrasProps.caracteristicas && (
                <div className="pb-3">
                  <label className="fw-bold fs-1">Caracteristicas</label>
                  <div className="d-flex flex-wrap">
                    {extrasProps.caracteristicas.map(item => (
                      <div
                        className="d-flex flex-row"
                        key={item.id}
                        style={{ width: '33%' }}
                      >
                        <input
                          className="form-check-input me-2"
                          checked={values.extras.characteristics[item.id]}
                          onChange={e => {
                            setValues({
                              ...values,
                              extras: {
                                ...values.extras,
                                characteristics: {
                                  ...values.extras.characteristics,
                                  [item.id]: e.target.checked
                                }
                              }
                            });
                          }}
                          type="checkbox"
                          id={`checkbox${item.id}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`checkbok${item.id}`}
                        >
                          {item.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {extrasProps.services && (
                <div className="pb-3">
                  <label className="fw-bold fs-1">Servicios</label>
                  <div className="d-flex flex-wrap">
                    {extrasProps.servicios.map(item => (
                      <div
                        className="d-flex flex-row"
                        key={item.id}
                        style={{ width: '33%' }}
                      >
                        <input
                          className="form-check-input me-2"
                          checked={values.extras.services[item.id]}
                          onChange={e => {
                            setValues({
                              ...values,
                              extras: {
                                ...values.extras,
                                services: {
                                  ...values.extras.services,
                                  [item.id]: e.target.checked
                                }
                              }
                            });
                          }}
                          type="checkbox"
                          id={`checkbox${item.id}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`checkbok${item.id}`}
                        >
                          {item.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {extrasProps.ambientes && (
                <div className="pb-3">
                  <label className="fw-bold fs-1">Ambientes</label>
                  <div className="d-flex flex-wrap">
                    {extrasProps.ambientes.map(item => {
                      return (
                        <div
                          className="d-flex flex-row"
                          key={item.id}
                          style={{ width: '33%' }}
                        >
                          <input
                            className="form-check-input me-2"
                            checked={values.extras.ambience[item.id]}
                            onChange={e => {
                              setValues({
                                ...values,
                                extras: {
                                  ...values.extras,
                                  ambience: {
                                    ...values.extras.ambience,
                                    [item.id]: e.target.checked
                                  }
                                }
                              });
                            }}
                            type="checkbox"
                            id={`checkbox${item.id}`}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`checkbok${item.id}`}
                          >
                            {item.name}
                          </label>
                        </div>
                      );
                    })}
                  </div>
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
