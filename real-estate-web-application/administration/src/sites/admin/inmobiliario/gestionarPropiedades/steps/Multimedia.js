import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import FalconDropzone from 'components/common/FalconDropzone';
import cloudUpload from 'assets/img/icons/cloud-upload.svg';
import Flex from 'components/common/Flex';
// import { Button, Col, Form, Image, Row } from 'react-bootstrap';
import FalconLightBoxGallery from 'components/common/FalconLightBoxGallery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { uploadImage } from 'redux/propsSlice';
import { useDispatch } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import messageHandler from 'utils/messageHandler';
import { MultimediaSchema } from '../validations/propertiesValidation';
import ButtonDelete from 'utils/buttonDelete';
import ImageDeleteModal from '../modals/imageDeleteModal';

const Multimedia = ({
  data,
  setData,
  handleSubmit,
  yupSubmitRef
}) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const [modalDelete, setModalDelete] = useState(false)
  const [imageToDelete, setImageToDelete] = useState(undefined)
  const [imageType, setImageType] = useState(undefined)
  const refImageUpload = useRef(null);
  const refHouseMapUpload = useRef(null);

  const [files, setFiles] = useState({
    image: null,
    houseMap: null
  });

  const handleImage = async (e, name) => {
    setFiles({
      ...files,
      [name]: e.target.files[0]
    });
  };

  useEffect(() => {
    files.image !== null && handleUploadImage();
  }, [files.image]);

  useEffect(() => {
    files.houseMap !== null && handleUploadHouseMap();
  }, [files.houseMap]);

  const handleHouseMap = async (e, name) => {
    setFiles({
      ...files,
      [name]: e.target.files[0]
    });
  };

  const handleUploadImage = async (e) => {
    try {
      let formData = new FormData();
      formData.append('file', files.image);
      formData.append('imageType', "image")
      const response = await dispatch(uploadImage(data._id, formData, token));
      if (response.status === 200) {
        messageHandler('success', 'Imagen cargada correctamente');
        setData({
          ...data,
          images: [...data.images, response.data]
        })
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadHouseMap = async (e) => {
    try {
      let formData = new FormData();
      formData.append('file', files.houseMap);
      formData.append('imageType', "houseMap")
      const response = await dispatch(uploadImage(data._id, formData, token));
      if (response.status === 200) {
        messageHandler('success', 'Plano cargado correctamente');
        setData({
          ...data,
          houseMap: [...data.houseMap, response.data]
        })
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = ({ url, imageType }) => {
    setModalDelete(true)
    setImageType(imageType)
    setImageToDelete(url)
  }

  return (
    <Formik
      initialValues={{
        video: data.video,
        video360: data.video360
      }}
      validationSchema={MultimediaSchema}
      onSubmit={(values) => handleSubmit(values)}
    >
      {({ errors, touched, values, setValues }) => {
        console.log("los values", values)
        return (
          <Form className="d-lg-flex flex-column align-items-center w-100">
            {modalDelete &&
              <ImageDeleteModal
                image={imageToDelete}
                imageType={imageType}
                setShow={setModalDelete}
                setData={setData}
                data={data}
              />
            }
            <div className="d-lg-flex flex-flex justify-content-center w-100 mb-3">
              <div className='d-lg-flex flex-column align-items-center w-100'>
                <button
                  type="button"
                  className="btn btn-sm btn-info mb-3 w-25"
                  onClick={e => refImageUpload.current.click()}
                  style={{ backgroundColor: '#485FFF', borderColor: '#485FFF' }}
                >
                  Carga una foto
                </button>
                <div className='d-lg-flex flex-wrap justify-content-center align-items-start'>
                  {data.images?.map((image, index) => {
                    return (
                      <div key={index} className='d-flex me-3 mb-3'>
                        <img src={image} className="rounded float-left mb-2" style={{ width: "350px", maxHeight: "190px" }} />
                        {ButtonDelete(handleDelete, { url: image, imageType: "image" })}
                      </div>
                    )
                  })}
                </div>
                <input
                  hidden
                  type="file"
                  name="image"
                  ref={refImageUpload}
                  multiple={true}
                  onChange={e => handleImage(e, 'image')}
                />

              </div>
              {/* <div className='d-lg-flex flex-column align-items-center w-50'>
                <button
                  type="button"
                  className="btn btn-sm btn-info mb-3 w-50"
                  onClick={e => refHouseMapUpload.current.click()}
                  style={{ backgroundColor: '#E1B307', borderColor: '#E1B307' }}
                >
                  Carga un plano
                </button>
                <div className='d-lg-flex flex-column justify-content-center align-items-start w-45'>
                  {data.houseMap?.map((image, index) => {
                    return (
                      <div key={index}>
                        <img src={image} className="rounded float-left mb-2" style={{ width: "350px", maxHeight: "190px" }} />
                      </div>
                    )
                  })}
                </div>
                <input
                  hidden
                  type="file"
                  name="houseMap"
                  ref={refHouseMapUpload}
                  multiple={true}
                  onChange={e => handleHouseMap(e, 'houseMap')}
                />
              </div> */}
            </div>
            <div className="d-flex flex-column align-items-center w-50 mb-4">
              <div className='w-100 pb-4'>
                <label className='text-center w-100'>Video</label>
                <Field
                  type="text"
                  name="video"
                  className="form-control-sm form-control"
                />
                {errors.video && touched.video && (
                  <label style={{ color: '#da1717e8' }}>{errors.video}</label>
                )}
              </div>
              <div className='w-100'>
                <label className='text-center w-100'>Video 360°</label>
                <Field
                  type="text"
                  name="video360"
                  className="form-control-sm form-control"
                />
                {errors.video360 && touched.video360 && (
                  <label style={{ color: '#da1717e8' }}>{errors.video360}</label>
                )}
              </div>
            </div>
            <button hidden ref={yupSubmitRef}></button>
          </Form>

        )
      }}
    </Formik>
  );
};

export default Multimedia;
