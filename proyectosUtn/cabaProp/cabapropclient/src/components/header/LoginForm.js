import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import {
  emailSchema,
  loginSchema,
} from "../../utils/validations/validationSchema";
import { loginClient, sendRecoveryToken } from "../../redux/loginSlice";
import { GoogleLoginButton } from "react-social-login-buttons";
import { useDispatch } from "react-redux";
import loaderIcon from "../../assets/img/spinner.png";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [forgottenPass, setForgottenPass] = useState(false);
  const captchaRef = useRef(null);
  const [isValid, setIsValid] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // * Methods
  const HandleSubmit = async (values) => {
    setIsLoading(true);
    await dispatch(loginClient(values));
    setIsLoading(false);
    setAttempts(attempts + 1);
  };

  const HandleChange = () => {
    if (captchaRef.current.getValue()) {
      setIsValid(true);
    } else setIsValid(false);
  };

  const HandleGoogle = async () => {
    window.location.replace(
      `${process.env.REACT_APP_SERVER}/clients/login/google`
    );
  };

  const HandleRecoveryPass = async ({ email }) => {
    setIsLoading(true);
    await dispatch(sendRecoveryToken({ email }));
    setIsLoading(false);
  };

  const EnableSubmit = () => {
    if (isLoading) return false;
    if (attempts >= 3 && !isValid) return false;
    return true;
  };

  return (
    <>
      <div
        className="row mt30 tab-pane fade show active pl20 pr20"
        id="home"
        role="tabpanel"
        aria-labelledby="home-tab"
      >
        <div className="col-lg-12">
          {forgottenPass ? (
            <div className="sign_up_form">
              <div>
                <p>
                  Ingresá el email con el que registraste tu cuenta. Te vamos a
                  enviar un correo para que puedas recuperar tu contraseña.
                </p>
              </div>
              <Formik
                initialValues={{
                  email: "",
                }}
                validationSchema={emailSchema}
                onSubmit={HandleRecoveryPass}
              >
                {({ errors, touched }) => (
                  <Form>
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
                      {errors.email && touched.email ? (
                        <div className="error">{errors.email}</div>
                      ) : null}
                    </div>
                    <button
                      type="submit"
                      className="btn btn-signup btn-block btn-dark mt10 mb30"
                      disabled={isLoading}
                    >
                      {!isLoading ? (
                        "ENVIAR"
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
              <div
                className="cursor-pointer"
                onClick={() => setForgottenPass(false)}
                style={{ width: "fit-content" }}
              >
                <h5>Volver atrás</h5>
              </div>
            </div>
          ) : (
            <div className="sign_up_form">
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                }}
                validationSchema={loginSchema}
                onSubmit={HandleSubmit}
              >
                {({ errors, touched }) => (
                  <Form>
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
                      {errors.email && touched.email ? (
                        <div className="error">{errors.email}</div>
                      ) : null}
                    </div>
                    <div className="form-group">
                      <Field
                        className="form-control"
                        style={{
                          borderColor:
                            errors.password && touched.password && "red",
                        }}
                        name="password"
                        type="password"
                        placeholder="Contraseña"
                      />
                      {errors.password && touched.password ? (
                        <div className="error">{errors.password}</div>
                      ) : null}
                    </div>
                    {attempts >= 3 && (
                      <div className="form-group">
                        <ReCAPTCHA
                          sitekey={process?.env?.REACT_APP_GOOGLE_CAPTCHA_KEY}
                          onChange={HandleChange}
                          ref={captchaRef}
                        />
                      </div>
                    )}
                    <button
                      type={!EnableSubmit() ? "button" : "submit"}
                      className="btn btn-signup btn-block btn-dark mt10 mb10"
                      disabled={!EnableSubmit()}
                    >
                      {!isLoading ? (
                        "INICIAR SESIÓN"
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

              <div>
                <GoogleLoginButton onClick={HandleGoogle}>
                  <span>Iniciar sesión con Google</span>
                </GoogleLoginButton>
              </div>
              <div
                className="d-flex align-items-center mt-4 cursor-pointer"
                onClick={() => setForgottenPass(true)}
                style={{ width: "fit-content" }}
              >
                <h5>Olvidé mi contraseña</h5>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginForm;
