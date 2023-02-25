import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import moment from 'moment'
moment.locale('es')
import 'moment/locale/es'
import { useDispatch } from 'react-redux';
import { createColab, getColabs } from 'redux/colabsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createUserSchema } from '../validations/UserValidation'
import ButtonSuccessSubmit from 'utils/buttonSuccessSubmit';
import ButtonClose from 'utils/buttonClose';
import { useSelector } from 'react-redux';
import { Field, Form, Formik } from 'formik';


const CreateModal = ({ setModalShow, modalShow, roles, branchOffices, switchNewUser, setSwitchNewUser }) => {
  const userLogged = useSelector((state) => state.login.currentUser)
  const token = localStorage.getItem("token")
  const tablaSucursales = []
  for (let i = 0; i < branchOffices?.length; i++) {
    tablaSucursales.push({ ...branchOffices[i], active: false, roleId: null })
  }
  let sucursalesId = {}

  const dispatch = useDispatch()
  const [errorMsg, setErrorMsg] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingButton, setLoadingButton] = useState(false)
  const [newUser, setNewUser] = useState(sucursalesId)

  useEffect(() => {
    branchOffices.length > 0 && branchOffices.map((office) => (
      sucursalesId[office.id] = { branchOfficeId: office.id, active: false, role: null }
    ))
    setNewUser(sucursalesId)
    setIsLoading(false)
  }, [branchOffices])

  const handleSubmit = async (values) => {
    if (loadingButton) {return null
    } else {
      setLoadingButton(true)
      let userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        dni: values.dni,
        branchOffices: Object.values(newUser)
      }
      const response = await dispatch(createColab(userData, token))
      if (response?.status < 400) {
        setErrorMsg(false)
        setModalShow(false)
        setLoadingButton(false)
        setNewUser(sucursalesId)
        dispatch(getColabs(token))
      } else {
        setLoadingButton(false)
      }
    }
  }


  const handleSwitch = (e) => {
    setNewUser({
      ...newUser,
      [e.target.id]: { ...newUser[e.target.id], active: !newUser[e.target.id].active }
    })
  }

  const handleSelect = (e, branchOfficeId) => {
    setNewUser({
      ...newUser,
      [branchOfficeId]: { ...newUser[branchOfficeId], roleId: Number(e.target.value) }
    })
  }

  return (
    <Modal
      show={modalShow}
      onHide={() => setModalShow(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Crear nuevo usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            dni: "",
            phoneNumber: ""
          }}
          validationSchema={createUserSchema}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ errors, touched }) => (
            <Form>
              <div className='d-flex flex-row justify-content-around w-100'>
                <div style={{ maxWidth: 400, minWidth: 300 }} className="mb-4 d-flex flex-column">
                  <h5 className="mb-4">Información personal</h5>
                  <div style={{ maxWidth: 250 }}>
                    <label>Nombre*</label>
                    <Field className="form-control form-control-sm" name="firstName" />
                    {errors.firstName && touched.firstName ? (
                      <label style={{ color: "#da1717e8" }}>{errors.firstName}</label>
                    ) : null}
                  </div>
                  <div style={{ maxWidth: 250 }}>
                    <label>Apellido*</label>
                    <Field className="form-control form-control-sm" name="lastName" />
                    {errors.lastName && touched.lastName ? (
                      <label style={{ color: "#da1717e8" }}>{errors.lastName}</label>
                    ) : null}
                  </div>
                  <div style={{ maxWidth: 250 }}>
                    <label>Email*</label>
                    <Field className="form-control form-control-sm" name="email" type="email" />
                    {errors.email && touched.email ?
                      <label style={{ color: "#da1717e8" }}>{errors.email}</label> : null}
                  </div>
                  <div style={{ maxWidth: 250 }}>
                    <label>DNI*</label>
                    <Field className="form-control form-control-sm" name="dni" type="number" />
                    {errors.dni && touched.dni ?
                      <label style={{ color: "#da1717e8" }}>{errors.dni}</label> : null}
                  </div>
                  <div style={{ maxWidth: 250 }}>
                    <label>Teléfono</label>
                    <Field className="form-control form-control-sm" name="phoneNumber" type="number" />
                    {errors.phoneNumber && touched.phoneNumber ?
                      <label style={{ color: "#da1717e8" }}>{errors.phoneNumber}</label> : null}
                  </div>
                </div>
                <div style={{ maxWidth: 400, minWidth: 250 }}>
                  <h5 className="mb-4">Seleccionar Roles:</h5>
                  {!isLoading && newUser && tablaSucursales.length > 0 && tablaSucursales.map((sucursal, index) => {
                    return (
                      <div key={index} className="form-check form-switch">
                        <div>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={sucursal.id}
                            onChange={handleSwitch}
                            checked={newUser[sucursal.id] ? newUser[sucursal.id].active : false}
                          />
                          <label className="form-check-label" htmlFor="sucursal1">
                            {sucursal.branch_office_name}
                          </label>
                        </div>
                        {newUser[sucursal.id] && newUser[sucursal.id].active && (
                          <select
                            id={sucursal.id}
                            onChange={(e) => handleSelect(e, sucursal.id)}
                            style={{ maxWidth: 300 }} className="form-select form-select-sm mb-3" aria-label="Default select example">
                            <option defaultValue value={0}>Seleccionar un rol</option>
                            {
                              roles.map((role, index) => (
                                <option key={index} value={role.id}>{role.name}</option>
                              ))
                            }
                          </select>
                        )
                        }
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className='d-flex justify-content-end mt-5' style={{ gap: 30 }}>
                {ButtonClose('Cancelar', () => setModalShow(false))}
                {ButtonSuccessSubmit(loadingButton ? "Cargando..." : "Crear usuario", (!!errors.firstName || !!errors.lastName || !!errors.email || !!errors.dni || !!errors.phoneNumber || loadingButton))}
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default CreateModal;