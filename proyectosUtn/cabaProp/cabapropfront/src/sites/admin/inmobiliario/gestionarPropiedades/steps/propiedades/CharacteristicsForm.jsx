import React from 'react';
import { Form, Formik } from 'formik';
import { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { getChangeCarac } from '../utils/getChangeCarac';
import { GetInput } from '../utils/GetInput';
import { getInitialValues } from '../utils/getInitialValues';
import { replaceValues } from '../utils/replaceValues';
import forms from '.';

export const CharacteristicsForm = ({
  data,
  setData,
  yupSubmitRef,
  handleSubmit,
  setStepStatus
}) => {
  const handleChangeCarac = getChangeCarac(setData, setStepStatus);

  return (
    <Formik
      initialValues={getInitialValues(
        data,
        forms[data.property_type].initialValues
      )}
      validationSchema={forms[data.property_type].schema}
      onSubmit={values => {
        const submitObj = forms[data.property_type].submit;

        replaceValues(submitObj, values);

        handleSubmit(submitObj);
      }}
    >
      {({ errors, touched, values, setValues }) => {
        useEffect(() => {
          const submitObj = forms[data.property_type].submit;

          replaceValues(submitObj, values);

          setStepStatus(prev => ({
            ...prev,
            ...submitObj
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
              {forms[data.property_type].inputs.map((col, index) => (
                <Col
                  xs={12}
                  key={`col-form-${index}`}
                  className={
                    col.some(i => i.type === 'switch')
                      ? ''
                      : 'd-flex gap-3 flex-wrap'
                  }
                >
                  {col.map((input, i) => (
                    <GetInput
                      key={`${input.type}-${i}`}
                      input={input}
                      errors={errors}
                      touched={touched}
                      values={values}
                      setValues={setValues}
                      data={data}
                      setData={setData}
                      handleChangeCarac={handleChangeCarac}
                    />
                  ))}
                </Col>
              ))}
            </Row>

            <button hidden ref={yupSubmitRef} />
          </Form>
        );
      }}
    </Formik>
  );
};
