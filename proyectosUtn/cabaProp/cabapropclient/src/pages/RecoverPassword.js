import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { sendRecoveryPassword } from "../redux/loginSlice";
import { createPassSchema } from "../utils/validations/validationSchema";
import loaderIcon from "../assets/img/spinner.png";
import messageHandler from "../utils/messageHandler";
import celebImg from "../assets/img/celebration2.png";

const RecoverPassword = () => {
  // * States
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState();
  const params = useParams();
  const dispatch = useDispatch();

  // * Methods
  const HandleSubmit = async (values) => {
    setIsLoading(true);
    const data = {
      password: values.password,
      confirmPassword: values.confirmPassword,
      recoveryToken: params.token,
    };
    const res = await dispatch(sendRecoveryPassword(data));
    setResponse(res);
    setIsLoading(false);
    if (res) {
      messageHandler(
        "success",
        "¡Tu contraseña fue actualizada con éxito! Ahora te redirigimos para que inicies sesión."
      );
      setTimeout(() => window.location.replace("/?iniciar-sesion"), 5000);
    }
  };

  // * Life Cycle
  useEffect(() => {
    document.querySelector("html").classList.toggle("overflow-y-hidden");
    return () =>
      document.querySelector("html").classList.toggle("overflow-y-hidden");
  }, []);

  return (
    <>
      <div
        className={`confirmation-page ${response ? "align-items-start" : ""}`}
      >
        {!response ? (
          <div className="col-sm-8 col-md-6">
            <h1 className="mb-4">Crear nueva contraseña</h1>
            <div className="col-12">
              <div className="sign_up_form">
                <Formik
                  initialValues={{
                    password: "",
                    confirmPassword: "",
                  }}
                  validationSchema={createPassSchema}
                  onSubmit={HandleSubmit}
                >
                  {({ errors, touched }) => (
                    <Form>
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
                        {errors.password && touched.password && (
                          <div className="error">{errors.password}</div>
                        )}
                      </div>
                      <div className="form-group">
                        <Field
                          className="form-control"
                          style={{
                            borderColor:
                              errors.confirmPassword &&
                              touched.confirmPassword &&
                              "red",
                          }}
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirmar contraseña"
                        />
                        {errors.confirmPassword && touched.confirmPassword && (
                          <div className="error">{errors.confirmPassword}</div>
                        )}
                      </div>
                      <button
                        type={isLoading ? "button" : "submit"}
                        className="btn btn-signup btn-block btn-dark mt30 mb0 d-flex justify-content-center align-items-center"
                        disabled={isLoading}
                      >
                        {!isLoading ? (
                          "Enviar"
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
        ) : (
          <div className="col-12 d-flex align-items-center flex-column">
            <div className="celebration">
              <img
                src={celebImg}
                className="celebration-img"
                alt="celebracion"
              />
            </div>
            <h1 className="celebration-message">¡Felicitaciones!</h1>
          </div>
        )}
      </div>
    </>
  );
};

export default RecoverPassword;
