import React from 'react';
import { Form, Formik } from 'formik';
import { Col, Row } from 'react-bootstrap';
import { ApartmentSchema } from '../../validations/propertiesValidation';
import { Antiquity } from '../components/Antiquity';
import { CoveredSurface } from '../components/CoveredSurface';
import { Description } from '../components/Description';
import { MinusPlusInput } from '../components/MinusPlusInput';
import { Price } from '../components/Price';
import { TotalSurface } from '../components/TotalSurface';
import './styles.css';
import { getChangeCarac } from '../utils/getChangeCarac';
import { useEffect } from 'react';

const Casa = ({ data, setData, yupSubmitRef, handleSubmit, setStepStatus }) => {
  const handleChangeCarac = getChangeCarac(setData, setStepStatus);

  return (
    <>
      <Formik
        initialValues={{
          totalSurface: data.surface.totalSurface,
          coveredSurface: data.surface.coveredSurface,
          type: data.antiquity.type,
          years: data.antiquity.years,
          total: data.price.total,
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
            price: { total: values.total, currency: data.price.currency },
            description: values.description
          })
        }
      >
        {({ errors, touched, values, setValues }) => {
          useEffect(() => {
            setStepStatus(prev => ({
              ...prev,
              surface: {
                totalSurface: values.totalSurface,
                coveredSurface: values.coveredSurface
              },
              antiquity: { type: values.type, years: values.years },
              price: { total: values.total, currency: data.price.currency },
              description: values.description
            }));
          }, [values]);

          return (
            <Form
              onKeyPress={e => {
                e.key === 'Enter' && e.preventDefault();
              }}
            >
              <p className="fw-bold">Características principales</p>

              <Row className="g-3">
                <Col xs={12} className="d-flex gap-3 flex-wrap">
                  <MinusPlusInput
                    handleChangeCarac={handleChangeCarac}
                    name={'ambience'}
                    quantity={data.characteristics.ambience}
                    title={'Ambientes'}
                  />

                  <MinusPlusInput
                    handleChangeCarac={handleChangeCarac}
                    name={'bedrooms'}
                    quantity={data.characteristics.bedrooms}
                    title={'Dormitorios'}
                  />

                  <MinusPlusInput
                    handleChangeCarac={handleChangeCarac}
                    name={'bathrooms'}
                    quantity={data.characteristics.bathrooms}
                    title={'Baños'}
                  />

                  <MinusPlusInput
                    handleChangeCarac={handleChangeCarac}
                    name={'toilettes'}
                    quantity={data.characteristics.toilettes}
                    title={'Toilettes'}
                  />

                  <MinusPlusInput
                    handleChangeCarac={handleChangeCarac}
                    name={'garages'}
                    quantity={data.characteristics.garages}
                    title={'Cocheras'}
                  />
                </Col>

                <Col xs={12} className="d-flex gap-3 flex-wrap">
                  <TotalSurface errors={errors} touched={touched} />

                  <CoveredSurface errors={errors} touched={touched} />
                </Col>

                <Col xs={12}>
                  <Antiquity
                    errors={errors}
                    setValues={setValues}
                    touched={touched}
                    values={values}
                  />
                </Col>

                <Col>
                  <Price
                    data={data}
                    errors={errors}
                    setData={setData}
                    touched={touched}
                  />
                </Col>

                <Col xs={12}>
                  <Description errors={errors} touched={touched} />
                </Col>
              </Row>

              <button hidden ref={yupSubmitRef} />
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default Casa;

export const CasaForm = {
  schema: ApartmentSchema,
  initialValues: [
    {
      name: 'totalSurface',
      path: 'surface.totalSurface'
    },
    {
      name: 'coveredSurface',
      path: 'surface.coveredSurface'
    },
    {
      name: 'type',
      path: 'antiquity.type'
    },
    {
      name: 'years',
      path: 'antiquity.years'
    },
    {
      name: 'total',
      path: 'price.total'
    },
    {
      name: 'currency',
      path: 'price.currency'
    },
    {
      name: 'description',
      path: 'description'
    }
  ],
  submit: {
    surface: {
      totalSurface: 'totalSurface',
      coveredSurface: 'coveredSurface'
    },
    antiquity: {
      type: 'type',
      years: 'years'
    },
    price: {
      total: 'total',
      currency: 'currency'
    },
    description: 'description'
  },
  inputs: [
    [
      {
        type: 'minusPlus',
        name: 'ambience',
        title: 'Ambientes',
        path: 'characteristics.ambience'
      },
      {
        type: 'minusPlus',
        name: 'bedrooms',
        title: 'Dormitorios',
        path: 'characteristics.bedrooms'
      },
      {
        type: 'minusPlus',
        name: 'bathrooms',
        title: 'Baños',
        path: 'characteristics.bathrooms'
      },
      {
        type: 'minusPlus',
        name: 'toilettes',
        title: 'Toilettes',
        path: 'characteristics.toilettes'
      },
      {
        type: 'minusPlus',
        name: 'garages',
        title: 'Cocheras',
        path: 'characteristics.garages'
      }
    ],
    [
      {
        type: 'totalSurface'
      },
      {
        type: 'coveredSurface'
      }
    ],
    [
      {
        type: 'antiquity'
      }
    ],
    [
      {
        type: 'price'
      }
    ],
    [
      {
        type: 'description'
      }
    ]
  ]
};
