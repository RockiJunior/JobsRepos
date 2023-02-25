// import React from 'react'
// import { Dropdown, DropdownButton, Form, FormControl, InputGroup } from 'react-bootstrap'
// import './styles.css'
// const Cochera = ({ data, setData }) => {

//     //handlers
//     const handleSwitch = e => {
//         setData({
//             ...data,
//             characteristics: {
//                 ...data.characteristics,
//                 [e.target.id]: e.target.checked
//             }
//         })
//     }

//     const handleRadio = e => {
//         setData({
//             ...data,
//             antiquity: {
//                 ...data.antiquity, type: e.target.value
//             }
//         })
//     }

//     const handleYears = e => {
//         setData({
//             ...data,
//             antiquity: {
//                 ...data.antiquity, years: e.target.value
//             }
//         })
//     }

//     return (
//         <>
//             <p className='fw-bold'>Characteristics principales</p>
//             <div className='pb-4'>
//                 <Form.Check
//                     type='switch'
//                     label='Cubierto'
//                     id='covered'
//                     onChange={handleSwitch}
//                     checked={data.characteristics.covered}
//                 />
//                 <Form.Check
//                     type='switch'
//                     label='Con montacargas'
//                     id='lift'
//                     onChange={handleSwitch}
//                     checked={data.characteristics.lift}
//                 />
//                 <Form.Check
//                     type='switch'
//                     label='Subsuelo'
//                     id='underground'
//                     onChange={handleSwitch}
//                     checked={data.characteristics.underground}
//                 />
//                 <Form.Check
//                     type='switch'
//                     label='Dentro de un edificio'
//                     id='building'
//                     onChange={handleSwitch}
//                     checked={data.characteristics.building}
//                 />
//             </div>

//             <div className='pb-5'>
//                 <p className='fw-bold'>Superficie</p>
//                 <div className='d-flex'>
//                     <InputGroup style={{ width: 120 }}
//                     >
//                         <InputGroup.Text id="basic-addon1">m2</InputGroup.Text>
//                         <FormControl
//                             placeholder="0"
//                             aria-label="supTotal"
//                             aria-describedby="basic-addon1"
//                         />
//                     </InputGroup>
//                 </div>
//             </div>

//             <div className='pb-5'>
//                 <p className='fw-bold'>Antigüedad</p>
//                 <Form.Check
//                     type='radio'
//                     id='antiguedad1'
//                     label='A estrenar'
//                     name='radio'
//                     value={1}
//                     onClick={handleRadio}
//                     defaultChecked
//                 />
//                 <div className='d-flex align-items-center'>
//                     <Form.Check
//                         type='radio'
//                         id='antiguedad2'
//                         label='Años de antigüedad'
//                         name='radio'
//                         value={2}
//                         onClick={handleRadio}
//                     />
//                     {
//                         data.antiquity.type === "2" && (
//                             <input type="" name="" value="" placeholder='0' onChange={handleYears}
//                                 style={{ marginTop: '-5px', marginLeft: 10, border: 'none', width: 60 }} />
//                         )
//                     }
//                 </div>
//                 <Form.Check
//                     type='radio'
//                     id='antiguedad3'
//                     label='En construcción'
//                     name='radio'
//                     value={3}
//                     onClick={handleRadio}
//                 />
//             </div>

//             <div>
//                 <p className='fw-bold'>Precio</p>
//                 <div>
//                     <p>Precio de la propiedad</p>
//                     <InputGroup style={{ width: 200 }}>
//                         <DropdownButton
//                             variant="outline-secondary"
//                             title="USD"
//                             id="input-group-dropdown-1"
//                         >
//                             <Dropdown.Item href="#">USD</Dropdown.Item>
//                             <Dropdown.Item href="#">$</Dropdown.Item>
//                         </DropdownButton>
//                         <FormControl aria-label="Text input with dropdown button"
//                             type="number" value={data.price.total}
//                             onChange={(e) => setData({ ...data, price: { ...data.price, total: e.target.value } })} />
//                     </InputGroup>
//                 </div>
//             </div>

//         </>
//     )
// }

// export default Cochera

import React from 'react';
import {
  Button,
  Dropdown,
  DropdownButton,
  FormControl,
  InputGroup,
  Form as Formo
} from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import './styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ApartmentSchema, GarageSchema } from '../../validations/propertiesValidation';

const Cochera = ({
  data,
  setData,
  yupSubmitRef,
  handleSubmit
}) => {
  //handlers
    const handleSwitch = e => {
        setData({
            ...data,
            characteristics: {
                ...data.characteristics,
                [e.target.id]: e.target.checked
            }
        })
    }


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
        validationSchema={GarageSchema}
        onSubmit={values =>
          handleSubmit({
            surface: {
              totalSurface: values.totalSurface,
            },
            antiquity: { type: values.type, years: values.years },
            price: { total: values.total, expenses: values.expenses, currency: data.price.currency },
            description: values.description
          })
        }
      >
        {({ errors, touched, values, setValues }) => {
            console.log(errors)
          return (
            <Form>
              <div className="w-100">
                <p className="fw-bold">Caracteristicas principales</p>
                <div className="pb-3">
                <Formo.Check
                    type='switch'
                    label='Cubierto'
                    id='covered'
                    onChange={handleSwitch}
                    checked={data.characteristics.covered}
                />
                <Formo.Check
                    type='switch'
                    label='Con montacargas'
                    id='lift'
                    onChange={handleSwitch}
                    checked={data.characteristics.lift}
                />
                <Formo.Check
                    type='switch'
                    label='Subsuelo'
                    id='underground'
                    onChange={handleSwitch}
                    checked={data.characteristics.underground}
                />
                <Formo.Check
                    type='switch'
                    label='Dentro de un edificio'
                    id='building'
                    onChange={handleSwitch}
                    checked={data.characteristics.building}
                />
                </div>

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

export default Cochera;