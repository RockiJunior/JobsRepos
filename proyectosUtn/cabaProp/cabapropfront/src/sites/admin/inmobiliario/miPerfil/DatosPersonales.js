import FalconCardBody from 'components/common/FalconCardBody';
import FalconComponentCard from 'components/common/FalconComponentCard';
import { Field, Form, Formik } from 'formik';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editProfile, uploadProfilePicture } from 'redux/colabsSlice';
import { updateUser } from 'redux/loginSlice';
import ButtonSuccessSubmit from 'utils/buttons/buttonSuccessSubmit';
import messageHandler from 'utils/messageHandler';
import { profileSchema } from '../gestionarUsuarios/validations/UserValidation';

const DatosPersonales = ({ data }) => {
  const refImageUpload = useRef(null);
  const [newImage, setNewImage] = useState();
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const userLogged = useSelector(state => state.login.currentUser);

  const handleImage = e => {
    setNewImage(e.target.files[0]);
  };

  const handleSubmitData = async values => {
    try {
      await handleProfileData(values);
      await handleProfilePicture();
      messageHandler('success', 'Datos personales guardados correctamente.');
    } catch (e) {
      messageHandler('error', e);
    }
  };

  const handleProfileData = async values => {
    const cleanData = {
      phoneNumber: values.phoneNumber,
      email: values.email
    };

    const response = await dispatch(editProfile(values.id, cleanData, token));

    if (response.status < 400) {
      dispatch(updateUser(response.data.token));
      localStorage.setItem('token', response.data.token);
    } else {
      throw response.data.message;
    }
  };

  const handleProfilePicture = async () => {
    if (newImage) {
      let formData = new FormData();
      formData.append('photo', newImage);
      try {
        const response = await dispatch(
          uploadProfilePicture(userLogged.id, formData, token)
        );
        if (response && response.status === 200 && response.data) {
          setNewImage();
        }
      } catch (e) {
        messageHandler(
          'error',
          'Hubo un error cargando la imágen. Por favor, intente nuevamente.'
        );
      }
    }
  };

  return (
    <FalconComponentCard>
      <FalconComponentCard.Header noPreview={true}>
        <h5>Datos personales</h5>
      </FalconComponentCard.Header>

      <FalconCardBody className="bg-white" noLight={true}>
        {data && (
          <Formik
            initialValues={data}
            validationSchema={profileSchema}
            onSubmit={handleSubmitData}
          >
            {({ errors, touched }) => (
              <Form>
                <div
                  className="d-flex flex-column w-50"
                  style={{ minWidth: 270, maxWidth: 270 }}
                >
                  <div className="mb-2 w-100 d-flex flex-column">
                    <label>Email</label>

                    <Field
                      className="form-control form-control-sm"
                      name="email"
                      type="email"
                    />

                    {errors.email && touched.email ? (
                      <div>{errors.email}</div>
                    ) : null}
                  </div>

                  <div className="mb-2 w-100 d-flex flex-column">
                    <label>Teléfono</label>

                    <Field
                      className="form-control form-control-sm"
                      name="phoneNumber"
                      type="number"
                    />

                    {errors.phoneNumber && touched.phoneNumber ? (
                      <div>{errors.phoneNumber}</div>
                    ) : null}
                  </div>

                  <div className="mb-2 w-100 d-flex flex-column">
                    <label>Cambiar foto</label>

                    <div className="d-flex flex-row flex-nowrap justify-content-between align-items-center">
                      <button
                        type="button"
                        className="btn btn-sm px-0 btn-info w-50"
                        onClick={e => refImageUpload.current.click()}
                        style={{
                          backgroundColor: '#E1B307',
                          borderColor: '#E1B307',
                          maxWidth: 110
                        }}
                      >
                        Subir imágen
                      </button>

                      <label className="m-0">
                        {(newImage &&
                          newImage.name &&
                          (newImage.name.length > 20
                            ? `${newImage.name.slice(0, 15)}...`
                            : newImage.name)) ||
                          'No hay foto subida'}
                      </label>
                    </div>

                    <input
                      className="form-control form-control-sm"
                      name="photo"
                      type="file"
                      ref={refImageUpload}
                      multiple={false}
                      onChange={e => handleImage(e)}
                      hidden
                    />
                  </div>

                  <div className="my-3 d-flex align-items-end justify-content-center">
                    <ButtonSuccessSubmit
                      text="Guardar cambios"
                      disabled={!!errors.email || !!errors.phoneNumber}
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </FalconCardBody>
    </FalconComponentCard>
  );
};

export default DatosPersonales;
