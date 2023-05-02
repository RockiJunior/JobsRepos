import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FalconCardBody from 'components/common/FalconCardBody';
import FalconComponentCard from 'components/common/FalconComponentCard';
import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { changePassword } from 'redux/colabsSlice';
import ButtonPrimarySubmit from 'utils/buttons/buttonPrimarySubmit';
import { updatePasswordSchema } from '../gestionarUsuarios/validations/UserValidation';

const CambiarContraseña = ({ id }) => {
  const dispatch = useDispatch();

  const token = localStorage.getItem('token');
  const initialValue = {
    actualPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  const [showPassword, setShowPassword] = useState({
    actualPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const handleSubmit = async (values, resetForm) => {
    try {
      await dispatch(changePassword(id, values, token));
      resetForm();
    } catch (e) {
      return e;
    }
  };

  return (
    <FalconComponentCard>
      <FalconComponentCard.Header noPreview>
        <h5>Cambiar contraseña</h5>
      </FalconComponentCard.Header>

      <FalconCardBody className="bg-white" noLight={true}>
        {token && (
          <Formik
            initialValues={initialValue}
            validationSchema={updatePasswordSchema}
            onSubmit={(values, { resetForm }) =>
              handleSubmit(values, resetForm)
            }
          >
            {({ errors, touched }) => {
              return (
                <Form
                  className="d-flex flex-column align-items-center"
                  style={{ width: '50%', minWidth: 250, maxWidth: 350 }}
                >
                  <div className="mb-2 w-100 d-flex flex-column">
                    <label>Contraseña actual</label>

                    <InputGroup className="d-flex align-items-center">
                      <Field
                        className="form-control form-control-sm px-3"
                        name="actualPassword"
                        type={showPassword.actualPassword ? 'text' : 'password'}
                      />

                      <FontAwesomeIcon
                        style={{ cursor: 'pointer' }}
                        className="ms-2"
                        icon={`fa-solid ${
                          showPassword.actualPassword
                            ? 'fa-eye'
                            : 'fa-eye-slash'
                        }`}
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            actualPassword: !showPassword.actualPassword
                          })
                        }
                      />
                    </InputGroup>

                    {errors.actualPassword && touched.actualPassword ? (
                      <label style={{ color: '#da1717e8' }}>
                        {errors.actualPassword}
                      </label>
                    ) : null}
                  </div>

                  <div className="mb-2 w-100 d-flex flex-column">
                    <label>Nueva contraseña</label>

                    <InputGroup className="d-flex align-items-center">
                      <Field
                        className="form-control form-control-sm"
                        name="newPassword"
                        type={showPassword.newPassword ? 'text' : 'password'}
                      />

                      <FontAwesomeIcon
                        style={{ cursor: 'pointer' }}
                        className="ms-2"
                        icon={`fa-solid ${
                          showPassword.newPassword ? 'fa-eye' : 'fa-eye-slash'
                        }`}
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            newPassword: !showPassword.newPassword
                          })
                        }
                      />
                    </InputGroup>

                    {errors.newPassword && touched.newPassword ? (
                      <label style={{ color: '#da1717e8' }}>
                        {errors.newPassword}
                      </label>
                    ) : null}
                  </div>

                  <div className="mb-2 w-100 d-flex flex-column">
                    <label>Confirmar contraseña</label>

                    <InputGroup className="d-flex align-items-center">
                      <Field
                        className="form-control form-control-sm"
                        name="confirmPassword"
                        type={
                          showPassword.confirmPassword ? 'text' : 'password'
                        }
                      />

                      <FontAwesomeIcon
                        style={{ cursor: 'pointer' }}
                        className="ms-2"
                        icon={`fa-solid ${
                          showPassword.confirmPassword
                            ? 'fa-eye'
                            : 'fa-eye-slash'
                        }`}
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            confirmPassword: !showPassword.confirmPassword
                          })
                        }
                      />
                    </InputGroup>

                    {errors.confirmPassword && touched.confirmPassword ? (
                      <label style={{ color: '#da1717e8' }}>
                        {errors.confirmPassword}
                      </label>
                    ) : null}
                  </div>

                  <div className="my-3 w-100 d-flex align-items-end justify-content-center">
                    <ButtonPrimarySubmit
                      text="Restablecer contraseña"
                      disabled={
                        !!errors.actualPassword ||
                        !!errors.newPassword ||
                        !!errors.confirmPassword
                      }
                    />
                  </div>
                </Form>
              );
            }}
          </Formik>
        )}
      </FalconCardBody>
    </FalconComponentCard>
  );
};

export default CambiarContraseña;
