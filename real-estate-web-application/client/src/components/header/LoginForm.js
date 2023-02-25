import React, {useState} from "react";
import { Formik, Form, Field } from "formik";
import { loginSchema } from "../../utlis/validations/validationSchema";
import { loginClient } from "../../redux/loginSlice";
import { GoogleLoginButton } from "react-social-login-buttons";
import { useDispatch } from "react-redux";
import RecoveryToken from "./RecoveryToken";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(true);

  //handlers
  const handleSubmit = (values) => {
    dispatch(loginClient(values));
  };

  const handleGoogle = async () => {
    window.location.replace("http://localhost:3001/clients/login/google");
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
          <div className="sign_up_form">
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={loginSchema}
              onSubmit={(e) => handleSubmit(e, "login")}
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
                  <button
                    type="submit"
                    className="btn btn-signup btn-block btn-dark mt30 mb10"
                  >
                    INICIAR SESIÓN
                  </button>
                </Form>
              )}
            </Formik>
            <div>
              <GoogleLoginButton onClick={handleGoogle}>
                <span>Iniciar sesión con Google</span>
              </GoogleLoginButton>
            </div>
            {/* <div className="text-center" onClick={()=>setShowModal(true)}>
              Olvidé mi contraseña
            </div> */}
          </div>
        </div>
      </div>
      {/* {showModal &&
      <RecoveryToken showModal={showModal} setShowModal={setShowModal} />
      } */}
    </>
  );
};

export default LoginForm;
