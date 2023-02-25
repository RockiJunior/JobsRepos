import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { updateInfo } from "../../redux/profileSlice";
import { contactInfoSchema } from "../../utlis/validations/validationSchema";

const ContactInfo = ({ userLogged, setUserLogged }) => {
  const [data, setData] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    setData({
      firstName: userLogged?.firstName,
      lastName: userLogged?.lastName,
      phoneNumber: userLogged?.phoneNumber,
    });
  }, [userLogged]);

  const handleProfile = async (values) => {
      dispatch(updateInfo(values, userLogged?.id, setUserLogged));
  };

  return (
    <>
      {data && (
        <Formik
          initialValues={data}
          validationSchema={contactInfoSchema}
          onSubmit={handleProfile}
        >
          {({ errors, touched }) => (
            <Form className="contact_form profile mb30">
              <div className="row">
                <div className="col-lg-12">
                  <h4 className="mb30 title">Información de contacto</h4>
                </div>
                <div className="col-lg-6">
                  <div className="form-group mb25">
                    <b>Nombre</b>
                    <Field
                      className="form-control"
                      style={{
                        borderColor:
                          errors.firstName && touched.firstName && "red",
                      }}
                      name="firstName"
                      type="text"
                    />
                    {errors.firstName && touched.firstName && (
                      <div className="error">{errors.firstName}</div>
                    )}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group mb30">
                    <b>Apellido</b>
                    <Field
                      className="form-control"
                      style={{
                        borderColor:
                          errors.lastName &&
                          touched.lastName &&
                          "red",
                      }}
                      name="lastName"
                      type="text"
                    />
                    {errors.lastName && touched.lastName && (
                      <div className="error">{errors.lastName}</div>
                    )}{" "}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group mb30">
                    <b>Email</b>
                    <Field
                      className="form-control"
                      disabled
                      name="email"
                      type="text"
                      value={userLogged?.email}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group mb30">
                    <b>Teléfono</b>
                    <Field
                      className="form-control"
                      style={{
                        borderColor:
                          errors.phoneNumber &&
                          touched.phoneNumber &&
                          "red",
                      }}
                      name="phoneNumber"
                      type="number"
                    />
                    {errors.phoneNumber && touched.phoneNumber && (
                      <div className="error">{errors.phoneNumber}</div>
                    )}{" "}
                  </div>
                </div>
                <div className="col-xl-12">
                  <div className="form-group mb0">
                    <button
                      className="btn btn-thm update_btn"
                      type="submit"
                    >
                      ACUTALIZAR PERFIL
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

export default ContactInfo;
