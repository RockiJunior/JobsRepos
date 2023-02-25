import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Field, Formik, Form } from 'formik';
import React, { useState } from 'react';
import { InputGroup, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { changePassword } from 'redux/colabsSlice';
import ButtonAccept from 'utils/buttonAccept';
import { updatePasswordSchema } from '../gestionarUsuarios/validations/UserValidation';

const CambiarContraseña = ({ id, show, setShow }) => {

  const dispatch = useDispatch()

  const token = localStorage.getItem("token")
  const [showPassword, setShowPassword] = useState({
    actualPassword: false,
    newPassword: false,
    confirmPassword: false
  })

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Cambiar contraseña</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {token &&
          <Formik
            initialValues={{
              actualPassword: "",
              newPassword: "",
              confirmPassword: ""
            }}
            validationSchema={updatePasswordSchema}
            onSubmit={async (values) => {
              const response = await dispatch(changePassword(id, values, token))
              if (response < 400) setShow(false)
            }}
          >
            {({ errors, touched }) => (
              <Form className='d-flex flex-column align-items-center'>
                <div className="mb-3 w-75 d-flex flex-column align-items-center">
                  <label>Contraseña actual</label>
                  <InputGroup className='d-flex align-items-center' >
                    <Field className="form-control form-control-sm px-3" name="actualPassword" type={showPassword.actualPassword ? "text" : "password"} />
                    <FontAwesomeIcon style={{cursor: "pointer"}} className="ms-2" icon={`fa-solid ${showPassword.actualPassword ? "fa-eye" : "fa-eye-slash"}`}
                      onClick={() => setShowPassword({ ...showPassword, actualPassword: !showPassword.actualPassword })} />
                  </InputGroup>
                  {errors.actualPassword && touched.actualPassword ? <label style={{ color: "#da1717e8" }}>{errors.actualPassword}</label> : null}
                </div>
                <div className="mb-3 w-75 d-flex flex-column align-items-center">
                  <label>Nueva contraseña</label>
                  <InputGroup className='d-flex align-items-center' >
                    <Field className="form-control form-control-sm" name="newPassword" type={showPassword.newPassword ? "text" : "password"} />
                    <FontAwesomeIcon style={{cursor: "pointer"}} className="ms-2" icon={`fa-solid ${showPassword.newPassword ? "fa-eye" : "fa-eye-slash"}`}
                      onClick={() => setShowPassword({ ...showPassword, newPassword: !showPassword.newPassword })} />
                  </InputGroup>
                  {errors.newPassword && touched.newPassword ? <label style={{ color: "#da1717e8" }}>{errors.newPassword}</label> : null}
                </div>
                <div className="mb-4 w-75 d-flex flex-column align-items-center">
                  <label>Confirmar contraseña</label>
                  <InputGroup className='d-flex align-items-center' >
                    <Field className="form-control form-control-sm" name="confirmPassword" type={showPassword.confirmPassword ? "text" : "password"} />
                    <FontAwesomeIcon style={{cursor: "pointer"}} className="ms-2" icon={`fa-solid ${showPassword.confirmPassword ? "fa-eye" : "fa-eye-slash"}`}
                      onClick={() => setShowPassword({ ...showPassword, confirmPassword: !showPassword.confirmPassword })} />
                  </InputGroup>
                  {errors.confirmPassword && touched.confirmPassword ? <label style={{ color: "#da1717e8" }}>{errors.confirmPassword}</label> : null}
                </div>
                <div className="mt-2 mb-3 w-50 d-flex align-items-end justify-content-center">
                  {ButtonAccept("Reestablecer contraseña", null, null, (!!errors.actualPassword || !!errors.newPassword || !!errors.confirmPassword))}
                </div>
              </Form>
            )}
          </Formik>}
      </Modal.Body>
    </Modal>
  );
};

export default CambiarContraseña;
