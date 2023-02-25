import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { updatePassword } from "../../redux/profileSlice";
import { updatePasswordSchema } from "../../utlis/validations/validationSchema";

const Password = ({ userLogged, setUserLogged }) => {
  const [data, setData] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    setData({
      actualPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [userLogged]);

  const handlePassword = (values, resetForm) => {
    dispatch(updatePassword(values, userLogged?.id, resetForm, setUserLogged));
  };

  return (
    <>
      {data && (
        <Formik
          initialValues={data}
          validationSchema={updatePasswordSchema}
          onSubmit={(values, {resetForm})=>handlePassword(values, resetForm)}
        >
          {({ errors, touched }) => (
            <Form className="contact_form profile mb30">
              <div className="row">
                <div className="col-lg-12">
                  <h4 className="mb30 title">Cambiar contraseña</h4>
                </div>
                <div className="col-lg-12">
                  <div className="form-group mb25">
                    <b>
                      Contraseña actual
                    </b>
                    <Field
                      className="form-control"
                      style={{
                        borderColor:
                          errors.actualPassword &&
                          touched.actualPassword &&
                          "red",
                      }}
                      name="actualPassword"
                      type="password"
                    />
                    {errors.actualPassword && touched.actualPassword && (
                      <div className="error">{errors.actualPassword}</div>
                    )}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group mb25">
                    <b>Contraseña nueva</b>
                    <Field
                      className="form-control"
                      style={{
                        borderColor:
                          errors.newPassword && touched.newPassword && "red",
                      }}
                      name="newPassword"
                      type="password"
                    />
                    {errors.newPassword && touched.newPassword && (
                      <div className="error">{errors.newPassword}</div>
                    )}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group mb30">
                    <b>Confirmar contraseña nueva</b>
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
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <div className="error">{errors.confirmPassword}</div>
                    )}{" "}
                  </div>
                </div>
                <div className="col-xl-12">
                  <div className="form-group mb0">
                    <button
                      className="btn btn-thm update_btn"
                      type="submit"
                    >
                      CAMBIAR CONTRASEÑA
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default Password;
