import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Field, Form, Formik } from 'formik';
import lodash from 'lodash';
import { Card, Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { uploadImage } from 'redux/propsSlice';
import ButtonDelete from 'utils/buttons/buttonDelete';
import messageHandler from 'utils/messageHandler';
import ImageDeleteModal from '../modals/imageDeleteModal';
import { MultimediaSchema } from '../validations/propertiesValidation';
import { getIdYoutube } from './utils/getIdYoutube';

const Multimedia = ({
  data,
  setData,
  handleSubmit,
  yupSubmitRef,
  setStepStatus
}) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const [modalDelete, setModalDelete] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(undefined);
  const [imageType, setImageType] = useState(undefined);
  const refImageUpload = useRef(null);
  const refHouseMapUpload = useRef(null);
  const [initialValues, setInitialValues] = useState({
    video: data.video,
    video360: data.video360
  });

  useEffect(() => {
    setInitialValues({
      video: data.video,
      video360: data.video360
    });
  }, [data]);

  const [files, setFiles] = useState({
    image: null,
    houseMap: null
  });

  useEffect(() => {
    files.image !== null && handleUploadImage();
  }, [files.image]);

  useEffect(() => {
    files.houseMap !== null && handleUploadHouseMap();
  }, [files.houseMap]);

  const handleHouseMap = async (e, name) => {
    setFiles({
      ...files,
      [name]: e.target.files
    });
  };

  const handleImage = async (e, name) => {
    setFiles({
      ...files,
      [name]: e.target.files
    });
  };

  const handleUploadImage = async e => {
    let uploadSuccessfully = true;
    let newImages = [];

    for (let img of files.image) {
      let formData = new FormData();
      formData.append('image', img);
      formData.append('imageType', 'image');
      try {
        const response = await dispatch(uploadImage(data._id, formData, token));
        console.log('handleUploadImage -> response', response);
        if (response.status > 299) {
          uploadSuccessfully = false;
        }
        if (response.status === 200 && response.data) {
          newImages.push(response.data[0]);
        }
      } catch (e) {
        console.log('Error: ', e);
      }
    }

    setData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));

    setStepStatus(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));

    if (uploadSuccessfully) {
      messageHandler('success', 'Imágenes cargadas correctamente.');
      setFiles({
        ...files,
        image: null
      });
    } else if (!uploadSuccessfully) {
      messageHandler(
        'error',
        'Error al cargar las imágenes. Por favor, inténtelo nuevamente.'
      );
      setFiles({
        ...files,
        image: null
      });
    }
  };

  const handleUploadHouseMap = async e => {
    let uploadSuccessfully = true;
    let newImages = [];
    for (let img of files.houseMap) {
      let formData = new FormData();
      formData.append('houseMap', img);
      formData.append('imageType', 'houseMap');
      try {
        const response = await dispatch(uploadImage(data._id, formData, token));
        console.log('handleUploadHouseMap -> response', response);
        if (response.status > 299) {
          uploadSuccessfully = false;
        }
        if (response.status === 200 && response.data) {
          newImages.push(response.data[0]);
        }
      } catch (e) {
        console.log('Error: ', e);
      }
    }

    setData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));

    setStepStatus(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));

    if (uploadSuccessfully) {
      messageHandler('success', 'Planos cargados correctamente.');
      setFiles({
        ...files,
        houseMap: null
      });
    } else if (!uploadSuccessfully) {
      messageHandler(
        'error',
        'Error al cargar las imágenes. Por favor, inténtelo nuevamente.'
      );
      setFiles({
        ...files,
        houseMap: null
      });
    }
  };

  const handleDelete = ({ filename, imageType }) => {
    setModalDelete(true);
    setImageType(imageType);
    setImageToDelete(filename);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={MultimediaSchema}
      onSubmit={values =>
        handleSubmit(values, lodash.isEqual(values, initialValues))
      }
    >
      {({ errors, values }) => {
        useEffect(() => {
          setStepStatus(prev => ({
            ...prev,
            ...values
          }));
        }, [values]);

        return (
          <Form>
            {modalDelete && (
              <ImageDeleteModal
                image={imageToDelete}
                imageType={imageType}
                setShow={setModalDelete}
                setData={setData}
                setStepStatus={setStepStatus}
                data={data}
              />
            )}

            <Card.Title className="mb-3 fs-3">Fotos</Card.Title>

            <Row className="g-3">
              {/* Imagenes */}
              <Col xs={12} lg={6}>
                <Card className="bg-white">
                  <Card.Body className="text-center">
                    <button
                      type="button"
                      className="btn btn-sm btn-info w-100"
                      onClick={e => refImageUpload.current.click()}
                      style={{
                        backgroundColor: '#485FFF',
                        borderColor: '#485FFF'
                      }}
                    >
                      Cargá una foto <FontAwesomeIcon icon="plus" />
                    </button>

                    <input
                      hidden
                      type="file"
                      name="image"
                      ref={refImageUpload}
                      multiple={true}
                      onChange={e => handleImage(e, 'image')}
                      accept="image/*"
                    />

                    {data.images && (
                      <Row className="g-3 mt-1">
                        {data.images?.map((image, index) => {
                          if (image?.type === 'image')
                            return (
                              <Col
                                xs={12}
                                sm={6}
                                md={4}
                                lg={6}
                                xxl={4}
                                key={index}
                                className="d-flex justify-content-between position-relative"
                              >
                                <img
                                  src={
                                    image.url !== ''
                                      ? image.url
                                      : `${process.env.REACT_APP_CLIENT}/uploads/properties/${image.filename}`
                                  }
                                  className="rounded w-100"
                                  style={{
                                    aspectRatio: '1/1',
                                    objectFit: 'cover'
                                  }}
                                />

                                <ButtonDelete
                                  funcion={handleDelete}
                                  data={{
                                    filename:
                                      image.url !== ''
                                        ? image.url
                                        : image.filename,
                                    imageType: 'image'
                                  }}
                                  className="position-absolute"
                                  style={{
                                    borderRadius: '50%',
                                    aspectRatio: '1/1',
                                    top: 4,
                                    right: 12
                                  }}
                                />
                              </Col>
                            );
                        })}
                      </Row>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* Planos */}
              <Col xs={12} lg={6}>
                <Card className="bg-white">
                  <Card.Body className="text-center">
                    <button
                      type="button"
                      className="btn btn-sm btn-info w-100"
                      onClick={e => refHouseMapUpload.current.click()}
                      style={{
                        backgroundColor: '#E1B307',
                        borderColor: '#E1B307'
                      }}
                    >
                      Cargá un plano <FontAwesomeIcon icon="plus" />
                    </button>

                    {data.images && (
                      <Row className="g-3 mt-1">
                        {data.images?.map((image, index) => {
                          if (image?.type === 'houseMap')
                            return (
                              <Col
                                xs={12}
                                sm={6}
                                md={4}
                                lg={6}
                                xxl={4}
                                key={index}
                                className="d-flex justify-content-between position-relative"
                              >
                                <img
                                  src={
                                    image.url !== ''
                                      ? image.url
                                      : `${process.env.REACT_APP_CLIENT}/uploads/properties/${image.filename}`
                                  }
                                  style={{
                                    aspectRatio: '1/1',
                                    objectFit: 'cover'
                                  }}
                                  className="rounded w-100"
                                />

                                <ButtonDelete
                                  funcion={handleDelete}
                                  data={{
                                    filename:
                                      image.url !== ''
                                        ? image.url
                                        : image.filename,
                                    imageType: 'houseMap'
                                  }}
                                  className="position-absolute"
                                  style={{
                                    borderRadius: '50%',
                                    aspectRatio: '1/1',
                                    top: 4,
                                    right: 12
                                  }}
                                />
                              </Col>
                            );
                        })}
                      </Row>
                    )}

                    <input
                      hidden
                      type="file"
                      name="houseMap"
                      ref={refHouseMapUpload}
                      multiple={true}
                      onChange={e => handleHouseMap(e, 'houseMap')}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card.Title className="mb-3 mt-4 fs-3">Videos</Card.Title>

            {/* Videos */}
            <Row className="g-3">
              <Col xs={12} lg={6}>
                <div className="w-100 pb-4">
                  <label className="text-center w-100">Video</label>

                  <Field
                    type="text"
                    name="video"
                    className="form-control-sm form-control"
                  />

                  {!errors.video && !values.video && (
                    <label>
                      <small>
                        El video debe ser de <strong>Youtube</strong>
                      </small>
                    </label>
                  )}

                  {errors.video && (
                    <label style={{ color: '#da1717e8' }}>{errors.video}</label>
                  )}

                  {/* Embebed youtube render*/}
                  {values.video && !errors.video && (
                    <div
                      className="w-100 mt-2 p-1 border"
                      style={{ aspectRatio: '16/9' }}
                    >
                      <iframe
                        width="100%"
                        height="100%"
                        src={`//www.youtube.com/embed/${getIdYoutube(
                          values.video
                        )}`}
                        title="Reproductor de Youtube"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              </Col>

              <Col xs={12} lg={6}>
                <div className="w-100">
                  <label className="text-center w-100">Video 360°</label>

                  <Field
                    type="text"
                    name="video360"
                    className="form-control-sm form-control"
                  />

                  {!errors.video360 && !values.video360 && (
                    <label>
                      <small>
                        El video debe ser de <strong>Youtube</strong>
                      </small>
                    </label>
                  )}

                  {errors.video360 && (
                    <label style={{ color: '#da1717e8' }}>
                      {errors.video360}
                    </label>
                  )}

                  {/* Embebed youtube render*/}
                  {values.video360 && !errors.video360 && (
                    <div
                      className="w-100 mt-2 p-1 border"
                      style={{ aspectRatio: '16/9' }}
                    >
                      <iframe
                        width="100%"
                        height="100%"
                        src={`//www.youtube.com/embed/${getIdYoutube(
                          values.video360
                        )}`}
                        title="Reproductor de Youtube"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              </Col>
            </Row>

            <button hidden ref={yupSubmitRef}></button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default Multimedia;
