import React, { useEffect, useState } from 'react';
import CambiarContraseña from './CambiarContraseña';
import FalconComponentCard from 'components/common/FalconComponentCard';
import MisRoles from './MisRoles';
import { useDispatch, useSelector } from 'react-redux';
import { editProfile } from 'redux/colabsSlice';
import { Breadcrumb, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { profileSchema } from '../gestionarUsuarios/validations/UserValidation';
import { Field, Form, Formik } from 'formik';
import ButtonSuccessSubmit from 'utils/buttonSuccessSubmit';
import { updateUser } from 'redux/loginSlice';

const MiPerfil = () => {
  const dispatch = useDispatch()
  const [data, setData] = useState()
  const [passwordModal, setPasswordModal] = useState(false)
  /* const [errors, setErrors] = useState({
    isValidForm: false,
    phoneNumber: null,
    email: null
  }) */

  const token = localStorage.getItem("token")

  //Check session
  const userLogged = useSelector((state) => state.login.currentUser)
  useEffect(() => {
    if (userLogged) {
      const { id, firstName, lastName, phoneNumber, dni, email } = userLogged
      setData({ id, firstName, lastName, phoneNumber, dni, email })
    }
  }, [userLogged])

  const handleSubmit = async (values) => {
    const cleanData = {
      phoneNumber: values.phoneNumber,
      email: values.email
    }
    const response = await dispatch(editProfile(values.id, cleanData, token))
    if (response.status < 400){
      dispatch(updateUser({...userLogged, ...values}))
      localStorage.setItem("token", response.data.token)
    }
  }


  return (
    <div className='ms-4'>
      <FalconComponentCard>
        <FalconComponentCard.Body>
          <div className='d-flex w-100 align-items-center justify-content-between px-3 mt-4 mb-7'>
            <h4 className='m-0'>
              <FontAwesomeIcon icon='fa-user' className='text-primary' style={{ marginRight: 10 }} />
              Información personal
            </h4>
            <Breadcrumb>
              <Breadcrumb.Item href="#" active>
                Información personal
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="my-3">
            <div className='d-flex flex-row align-items-center align-text-center justify-content-between align-text-center mb-4 w-100 px-3' >
              <h5 className='text-start m-0'>Datos personales</h5>
            </div>
            {data &&
              <Formik
                initialValues={data}
                validationSchema={profileSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched }) => (
                  <Form className="px-5 py-3 mb-3">
                    <div className='w-100 d-flex flex-row flex-wrap'>
                      <div  className="mb-3 me-4 w-25">
                        <Field className="form-control form-control-sm" disabled name="firstName" />
                      </div>
                      <div  className="mb-3 me-4 w-25">
                        <Field className="form-control form-control-sm" disabled name="lastName" />
                      </div>
                      <div  className="mb-3 me-4 w-25">
                        <Field className="form-control form-control-sm" name="email" type="email" />
                        {errors.email && touched.email ? <div>{errors.email}</div> : null}
                      </div>
                      <div  className="mb-3 me-4 w-25">
                        <Field className="form-control form-control-sm" disabled name="dni" type="dni" />
                      </div>
                      <div  className="mb-3 me-4 w-25">
                        <Field className="form-control form-control-sm" name="phoneNumber" type="number" />
                        {errors.phoneNumber && touched.phoneNumber ? <div>{errors.phoneNumber}</div> : null}
                      </div>
                      <div className="mb-3 me-4 w-25 d-flex align-items-end justify-content-center">
                        {ButtonSuccessSubmit("Guardar cambios", (!!errors.email || !!errors.phoneNumber))}
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>}
            
            {userLogged?.typeOfUser !== "admin" &&
              <MisRoles
                roles={userLogged?.roles}
                sucursales={userLogged?.branchOffices}
              />}
            <div
              className="px-3 mb-3"
            >
              <h5>Contraseña</h5>
              <Button
                className="btn btn-primary size-sm mt-3"
                size='sm'
                onClick={() => setPasswordModal(true)}
              >
                Cambiar contraseña
              </Button>
            </div>
            {passwordModal && (
              <CambiarContraseña id={data.id} show={passwordModal} setShow={setPasswordModal} />
            )}
          </div>
        </FalconComponentCard.Body>
      </FalconComponentCard>
    </div>
  );
};

export default MiPerfil;