import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { ButtonGroup, Col, Row, ToggleButton } from 'react-bootstrap';
import './propiedades/styles.css';
import { useSelector } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import { PropertieSchema } from '../validations/propertiesValidation';
import {
  propertyList as properties,
  subPropertyList as subproperties
} from '../mockup/props';
import lodash from 'lodash';

const operaciones = [
  { name: 'Venta', value: '1' },
  { name: 'Alquiler', value: '2' },
  { name: 'Temporario', value: '3' }
];
const propertiesMockup = properties?.sort((a, b) =>
  a.label > b.label ? 1 : -1
);

const OperacionYPropiedad = ({
  data,
  setData,
  yupSubmitRef,
  handleSubmit,
  setStepStatus
}) => {
  const userLogged = useSelector(state => state.login.currentUser);
  const [branchOffices, setBranchOffices] = useState([]);
  const [initialValues, setInitialValues] = useState({
    real_estate: data.real_estate || userLogged.realEstate,
    branch_office: data.branch_office,
    operation_type: data.operation_type,
    property_type: data.property_type,
    sub_property_type: data.sub_property_type,
    title: data.title
  });

  useEffect(() => {
    const officesArray = userLogged?.branchOffices;

    const offices =
      officesArray?.map(branchOffice => ({
        ...branchOffice,
        role:
          userLogged?.typeOfUser === 'admin'
            ? userLogged?.typeOfUser
            : branchOffice.role_id
      })) || [];

    setBranchOffices(offices);
  }, [userLogged]);

  useEffect(() => {
    setInitialValues({
      real_estate: data.real_estate.id,
      branch_office: data.branch_office.id,
      operation_type: data.operation_type,
      property_type: data.property_type,
      sub_property_type: data.sub_property_type,
      title: data.title
    });
  }, [data, userLogged]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={PropertieSchema}
      onSubmit={values => {
        handleSubmit(values, lodash.isEqual(values, initialValues));
      }}
    >
      {({ errors, touched, values, setValues }) => {
        const subpropertiesList = subproperties.find(
          prop => prop.propertyId === values.property_type
        );

        useEffect(() => {
          setStepStatus(prev => ({
            ...prev,
            ...values
          }));
        }, [values]);

        return (
          <Form
            onKeyPress={e => {
              e.key === 'Enter' && e.preventDefault();
            }}
          >
            <Row className="g-3">
              <Col xs={12} md={6}>
                <label>Seleccionar sucursal *</label>
                <Field
                  as="select"
                  className="form-select form-select-sm mb-1"
                  name="branch_office"
                  /* defaultValue={values.branch_office} */
                  onChange={e => {
                    const branch_office = branchOffices.find(
                      branch => branch.id === Number(e.target.value)
                    );
                    setValues({
                      ...values,
                      branch_office
                    });
                  }}
                  value={values.branch_office?.id}
                >
                  <option value={0} key={0} hidden>
                    Selecciona la sucursal
                  </option>
                  {branchOffices.length > 0 &&
                    branchOffices.map((suc, index) => (
                      <option key={index} value={suc.id}>
                        {suc.branch_office_name}
                      </option>
                    ))}
                </Field>
                {errors.branch_office && touched.branch_office && (
                  <label style={{ color: '#da1717e8' }}>
                    {errors.branch_office}
                  </label>
                )}
              </Col>

              <Col xs={12} md={6}>
                <label>Tipo de operación *</label>
                <Field
                  as="select"
                  className="form-select form-select-sm mb-1"
                  name="operation_type"
                  /* defaultValue={values.operation_type} */
                  onChange={e => {
                    setData({
                      ...data,
                      price: { ...data.price, currency: Number(e.target.value) }
                    });
                    setValues({
                      ...values,
                      operation_type: Number(e.target.value)
                    });
                  }}
                >
                  <option value={0} hidden>
                    Seleccione la operación
                  </option>
                  {operaciones.map((radio, idx) => (
                    <option
                      key={radio.value}
                      id={`radio-${idx}`}
                      size="sm"
                      value={radio.value}
                      /* selected={values.operation_type === Number(radio.value)} */
                    >
                      {radio.name}
                    </option>
                  ))}
                </Field>
                {errors.operation_type && touched.operation_type && (
                  <label style={{ color: '#da1717e8' }}>
                    {errors.operation_type}
                  </label>
                )}
              </Col>

              <Col xs={12} md={6}>
                <label>Tipo de propiedad *</label>

                <Field
                  as="select"
                  className="form-select form-select-sm mb-1"
                  name="property_type"
                  disabled={data._id}
                  onChange={e => {
                    if (!data._id)
                      setValues({
                        ...values,
                        property_type: Number(e.target.value)
                      });
                  }}
                >
                  <option value={0} hidden>
                    Seleccione el tipo de propiedad
                  </option>
                  {propertiesMockup &&
                    propertiesMockup.map((prop, index) => (
                      <option
                        key={index}
                        value={prop.id}
                        /* selected={values.property_type === prop.id} */
                      >
                        {prop.label}
                      </option>
                    ))}
                </Field>

                <h6 className="text-center text-muted">
                  Esta característica no{' '}
                  {!data._id
                    ? 'podrá modificarse luego.'
                    : 'puede modificarse.'}
                </h6>

                {errors.property_type && touched.property_type && (
                  <label style={{ color: '#da1717e8' }}>
                    {errors.property_type}
                  </label>
                )}
              </Col>

              <Col xs={12} md={6}>
                <label>Subtipo de propiedad *</label>

                <Field
                  as="select"
                  className="form-select form-select-sm  mb-1"
                  name="sub_property_type"
                  disabled={
                    values.property_type !== 9 && values.property_type !== 13
                  }
                  onChange={e => {
                    if (
                      values.property_type === 9 ||
                      values.property_type === 13
                    )
                      setValues({
                        ...values,
                        sub_property_type: Number(e.target.value)
                      });
                  }}
                >
                  <option value={0} hidden>
                    Seleccione el subtipo de propiedad
                  </option>
                  {subpropertiesList &&
                    subpropertiesList.subproperties.map(subprop => {
                      return (
                        <option
                          key={subprop.id}
                          value={subprop.id}
                          /* selected={values.sub_property_type === subprop.id} */
                        >
                          {subprop.title}
                        </option>
                      );
                    })}
                </Field>
                {values.property_type !== 9 && values.property_type !== 13 && (
                  <h6 className="text-muted text-center">
                    Esta propiedad no tiene subtipo.
                  </h6>
                )}
              </Col>

              <Col xs={12}>
                <label>Título *</label>
                <Field
                  className="form-control form-control-sm mb-1"
                  name="title"
                  /* defaultValue={data.property_type} */
                />
                {errors.title && touched.title && (
                  <label style={{ color: '#da1717e8' }}>{errors.title}</label>
                )}
              </Col>
            </Row>

            <button hidden ref={yupSubmitRef}></button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default OperacionYPropiedad;
