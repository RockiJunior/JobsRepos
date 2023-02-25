import React from "react";
import { Formik, Form, Field } from "formik";
import { emailSchema } from "../../utlis/validations/validationSchema";
import { useDispatch } from "react-redux";
import { sendRecoveryToken } from "../../redux/loginSlice";

const RecoveryToken = () => {
  const dispatch = useDispatch();
  const handleSubmit = (email) => {
    dispatch(sendRecoveryToken(email));
  };
  return (
    <Formik
      initialValues={{
        email: "",
      }}
      validationSchema={emailSchema}
      onSubmit={(values) => handleSubmit(values.email)}
    >
      {({ errors, touched }) => (
        <Form>
          <div className="form-group mt-5">
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
            className="btn btn-signup btn-block btn-dark mt30 mb10"
          >
            Recuperar contraseña
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default RecoveryToken;
