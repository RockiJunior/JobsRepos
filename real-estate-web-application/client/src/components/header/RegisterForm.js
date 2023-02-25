import React from 'react'
import { registerSchema } from '../../utlis/validations/validationSchema'
import { Formik, Form, Field } from "formik";
import { registerClient } from '../../redux/loginSlice';
import { useDispatch } from 'react-redux';


const RegisterForm = ({setTabs}) => {
    const dispatch = useDispatch()
    const handleSubmit = (values) => {
          dispatch(registerClient(values, setTabs));
      };
  return (
    <div
    className="row mt30 pl20 pr20"
    // className="row mt30 tab-pane fade pl20 pr20"
    // id="profile"
    // role="tabpanel"
    // aria-labelledby="profile-tab"
  >
    <div className="col-lg-12">
      <div className="sign_up_form">
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",                        
          }}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="form-group">
                <Field
                  className="form-control"
                  style={{borderColor: errors.firstName && touched.firstName && "red"}}
                  name="firstName"
                  placeholder="Nombre"
                />
                {errors.firstName && touched.firstName && (
                  <div className="error">{errors.firstName}</div>
                )}
              </div>
              <div className="form-group">
                <Field
                  className="form-control"
                  style={{borderColor: errors.lastName && touched.lastName && "red"}}
                  name="lastName"
                  placeholder="Apellido"
                />
                {errors.lastName && touched.lastName && (
                  <div className="error">{errors.lastName}</div>
                )}
              </div>
              <div className="form-group">
                <Field
                  className="form-control"
                  style={{borderColor: errors.email && touched.email && "red"}}
                  name="email"
                  type="email"
                  placeholder="Email"
                />
                {errors.email && touched.email && (
                  <div className="error">{errors.email}</div>
                )}
              </div>
              <div className="form-group">
                <Field
                  className="form-control"
                  style={{borderColor: errors.phoneNumber && touched.phoneNumber && "red"}}
                  name="phoneNumber"
                  type="number"
                  placeholder="Teléfono"
                />
                {errors.phoneNumber && touched.phoneNumber && (
                  <div className="error">{errors.phoneNumber}</div>
                )}
              </div>
              <div className="form-group">
                <Field
                  className="form-control"
                  style={{borderColor: errors.password && touched.password && "red"}}
                  name="password"
                  type="password"
                  placeholder="Contraseña"
                />
                {errors.password && touched.password && (
                  <div className="error">{errors.password}</div>
                )}
              </div>
              <div className="form-group">
                <Field
                  className="form-control"
                  style={{borderColor: errors.confirmPassword && touched.confirmPassword && "red"}}
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirmar contraseña"
                />
                {errors.confirmPassword &&
                  touched.confirmPassword && (
                    <div className="error">{errors.confirmPassword}</div>
                  )}
              </div>
              <button
                type="submit"
                className="btn btn-signup btn-block btn-dark mt30 mb0"
              >
                REGISTRARME
              </button>
            </Form>         
          )}
        </Formik>
      </div>
    </div>
  </div>  )
}

export default RegisterForm