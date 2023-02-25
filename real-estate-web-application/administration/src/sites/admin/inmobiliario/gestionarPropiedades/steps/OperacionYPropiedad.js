import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { ButtonGroup, ToggleButton } from 'react-bootstrap'
import "./propiedades/styles.css"
import { useSelector } from 'react-redux'
import { Field, Form, Formik } from 'formik'
import { PropertieSchema } from '../validations/propertiesValidation'

const OperacionYPropiedad = ({ data, setData, yupSubmitRef, handleSubmit }) => {

  const operaciones = [
    { name: 'Venta', value: '1' },
    { name: 'Alquiler', value: '2' },
    { name: 'Temporario', value: '3' },
  ];

  const properties = [
    "Departamento",
    "Casa",
    "PH",
    "Cochera",
    "Consultorio",
    "Fondo de comercio",
    "Local",
    "Bodega",
    "Terreno"
  ]


  const userLogged = useSelector((state) => state.login.currentUser)
  const [branchOffices, setBranchOffices] = useState([])
  const officesArray = userLogged?.typeOfUser !== 'admin' ? userLogged?.branchOffices : userLogged?.realEstate.branchOffice

  useEffect(() => {
    let offices = []
    officesArray?.map((branchOffice) => {
      offices.push({ id: branchOffice.id, name: branchOffice.branch_office_name, role: (userLogged?.typeOfUser === 'admin' ? userLogged?.typeOfUser : branchOffice.role_id) })
    })
    setBranchOffices(offices)
  }, [userLogged, officesArray])


  //handlers
  const handleSelect = e => {
    setData({ ...data, property_type: Number(e.target.value) })
  }

  const handleSucursal = e => {
    setData({ ...data, branch_office: Number(e.target.value) })
  }

  const handleOperation = e => {
    setData({ ...data, operation_type: Number(e.currentTarget.value) })
  }

  return (
    <Formik
      initialValues={{
        branch_office: data.branch_office,
        operation_type: data.operation_type,
        property_type: data.property_type,
        title: data.title
      }}
      validationSchema={PropertieSchema}
      onSubmit={(values) => handleSubmit(values)}
    >
      {({ errors, touched, values, setValues }) => {
        return (
          <Form >
            <div className='pb-3'>
              <label>Seleccionar sucursal *</label>
              <Field
                as="select"
                className="form-select form-select-sm w-50 mb-1"
                name="branch_office"
                defaultValue={data.branch_office}
                onChange={(e) => setValues({...values, branch_office: Number(e.target.value)})}
              >
                <option value={0} key={0} hidden >Selecciona la sucursal</option>
                {
                  branchOffices.length > 0 && branchOffices.map((suc, index) => (
                    <option selected={data.branch_office === suc.id} key={index} value={suc.id}>
                      {suc.name}
                    </option>
                  ))
                }
              </Field>
              {errors.branch_office && touched.branch_office && (
                <label style={{ color: '#da1717e8' }}>{errors.branch_office}</label>
              )}
            </div>
            <div className='pb-3'>
              <label>Tipo de operación *</label>
              <Field
                as="select"
                className="form-select form-select-sm w-50 mb-1"
                name="operation_type"
                defaultValue={data.operation_type}
                onChange={(e) => { 
                  setData({...data, price: {...data.price, currency: Number(e.target.value)}})
                  setValues({...values, operation_type: Number(e.target.value)})
                }}
              >
                <option value={0} hidden >Seleccione la operación</option>
                {operaciones.map((radio, idx) => (
                  <option
                    key={radio.value}
                    id={`radio-${idx}`}
                    size='sm'
                    value={radio.value}
                    selected={data.operation_type === Number(radio.value)}
                  >
                    {radio.name}
                  </option>
                ))}
              </Field>
              {errors.operation_type && touched.operation_type && (
                <label style={{ color: '#da1717e8' }}>{errors.operation_type}</label>
              )}
            </div>
            <div className='pb-3'>
              <label>Tipo de propiedad *</label>
              <h6 style={{fontWeight:400, color: "grey"}}>-Esta característica no podrá modificarse luego.</h6>
              <Field
                as="select"
                className="form-select form-select-sm w-50 mb-1"
                name="property_type"
                disabled={data._id}
                defaultValue={data.property_type}
                onChange={(e) => {
                  if (!data._id) setValues({...values, property_type: Number(e.target.value)})}}
              >
                <option value={0} hidden >Seleccione el tipo de propiedad</option>
                {
                  properties && properties.map((prop, index) => (
                    <option
                      key={index}
                      value={index + 1}
                      selected={data.property_type === index + 1}>
                      {prop}
                    </option>
                  ))
                }
              </Field>
              {errors.property_type && touched.property_type && (
                <label style={{ color: '#da1717e8' }}>{errors.property_type}</label>
              )}
            </div>
            <div className='pb-3 d-flex flex-column'>
              <label>Título *</label>
              <Field
                className="form-control form-control-sm w-50 mb-1"
                name="title"
                defaultValue={data.property_type}
              >
              </Field>
              {errors.title && touched.title && (
                <label style={{ color: '#da1717e8' }}>{errors.title}</label>
              )}
            </div>
            <button
              hidden
              ref={yupSubmitRef
              }
            ></button>
          </Form >
        )
      }}
    </Formik >
  )
}

export default OperacionYPropiedad