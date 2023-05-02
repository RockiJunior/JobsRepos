import React, { useState, useRef } from "react";
import { registerSchema } from "../../utils/validations/validationSchema";
import { Formik, Form, Field } from "formik";
import { registerClient } from "../../redux/loginSlice";
import { useDispatch } from "react-redux";
import loaderIcon from "../../assets/img/spinner.png";
import ReCAPTCHA from "react-google-recaptcha";

const RegisterForm = ({ setTabs }) => {
  // * States
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const dispatch = useDispatch();
  const captchaRef = useRef(null);

  // * Methods
  const HandleSubmit = async (values) => {
    setIsLoading(true);
    await dispatch(registerClient(values, setTabs));
    setIsLoading(false);
  };

  const HandleChange = () => {
    if (captchaRef.current.getValue()) {
      setIsValid(true);
    } else setIsValid(false);
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
            }}
            validationSchema={registerSchema}
            onSubmit={HandleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="form-group">
                  <Field
                    className="form-control"
                    style={{
                      borderColor:
                        errors.firstName && touched.firstName && "red",
                    }}
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
                    style={{
                      borderColor: errors.lastName && touched.lastName && "red",
                    }}
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
                    style={{
                      borderColor: errors.email && touched.email && "red",
                    }}
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
                    style={{
                      borderColor:
                        errors.phoneNumber && touched.phoneNumber && "red",
                    }}
                    name="phoneNumber"
                    type="number"
                    placeholder="Teléfono"
                  />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <div className="error">{errors.phoneNumber}</div>
                  )}
                </div>
                <div className="form-group">
                  <ReCAPTCHA
                    sitekey={process.env.REACT_APP_GOOGLE_CAPTCHA_KEY}
                    onChange={HandleChange}
                    ref={captchaRef}
                  />
                </div>
                <button
                  type={isLoading || !isValid ? "button" : "submit"}
                  className="btn btn-signup btn-block btn-dark mt30 mb0 d-flex justify-content-center align-items-center"
                  disabled={isLoading || !isValid}
                >
                  {!isLoading ? (
                    "REGISTRARME"
                  ) : (
                    <img
                      src={loaderIcon}
                      className="loading-spinner"
                      alt="loading"
                    />
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
