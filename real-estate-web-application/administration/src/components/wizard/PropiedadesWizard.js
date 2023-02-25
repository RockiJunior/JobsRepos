import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, Card, Form, Nav, ProgressBar } from 'react-bootstrap';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext, { AuthWizardContext } from 'context/Context';
import IconButton from 'components/common/IconButton';
import Flex from 'components/common/Flex';
import OperacionYPropiedad from 'sites/admin/inmobiliario/gestionarPropiedades/steps/OperacionYPropiedad';
import Ubicacion from 'sites/admin/inmobiliario/gestionarPropiedades/steps/Ubicacion';
import Multimedia from 'sites/admin/inmobiliario/gestionarPropiedades/steps/Multimedia';
import Departamento from 'sites/admin/inmobiliario/gestionarPropiedades/steps/propiedades/Departamento';
import Casa from 'sites/admin/inmobiliario/gestionarPropiedades/steps/propiedades/Casa';
import Cochera from 'sites/admin/inmobiliario/gestionarPropiedades/steps/propiedades/Cochera';
import Ph from 'sites/admin/inmobiliario/gestionarPropiedades/steps/propiedades/Ph';
import Consultorio from 'sites/admin/inmobiliario/gestionarPropiedades/steps/propiedades/Consultorio';
import Extras from 'sites/admin/inmobiliario/gestionarPropiedades/steps/Extras';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { uploadCharacteristics, uploadImage, createProp, setPropActive, physicDelete, editBasicData } from 'redux/propsSlice';
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';
import FondoDeComercio from 'sites/admin/inmobiliario/gestionarPropiedades/steps/propiedades/FondoDeComercio';
import Local from 'sites/admin/inmobiliario/gestionarPropiedades/steps/propiedades/Local';
import Bodega from 'sites/admin/inmobiliario/gestionarPropiedades/steps/propiedades/Bodega';
import Terreno from 'sites/admin/inmobiliario/gestionarPropiedades/steps/propiedades/Terreno';
import { allCharacteristics, allExtras } from 'sites/admin/inmobiliario/gestionarPropiedades/mockup/extrasMockup';
import messageHandler from 'utils/messageHandler';

const WizardLayout = ({ variant, validation, progressBar }) => {
  const { isRTL } = useContext(AppContext);
  const { step, setStep } = useContext(AuthWizardContext)
  const [firstJoin, setFirstJoin] = useState(true)

  useEffect(() => {
    if (firstJoin) {
      setStep(1)
      setFirstJoin(false)
    }
  }, [])

  const yupSubmitRef = useRef(null);
  const [action, setAction] = useState("")
  const [propertyId, setPropertyId] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = localStorage.getItem("token")
  const [data, setData] = useState({
    branch_office: 0,
    operation_type: 0,
    property_type: 0,
    title: "",
    location: {
      street: "",
      number: "",
      barrio: 0,
      lat: null,
      lng: null
    },
    surface: {
      totalSurface: "",
      coveredSurface: ""
    },
    antiquity: {
      type: "0",
      years: 0
    },
    price: {
      currency: 0,
      total: "",
      expenses: 0
    },
    status: "pending",
    description: "",
    images: [],
    video: "",
    video360: ""
  })

  const navItems = [
    {
      icon: '1',
      label: 'Operación y propiedad'
    },
    {
      icon: '2',
      label: 'Ubicación'
    },
    {
      icon: '3',
      label: 'Características'
    },
    {
      icon: '4',
      label: 'Multimedia'
    },
    {
      icon: '5',
      label: 'Extras'
    }
  ];

  const handleSubmit = async (values) => {
    setData({ ...data, ...values })
    const response = await handleData({ ...data, ...values })
    if (response && action === "next" && step !== 5) {
      setStep(step + 1)
    } else if (response && action === "next" && step === 5) {
      const response = await handleActivate()
      if (response < 400) navigate('/propiedades')
    } else if (response.type && action === "exit") {
      messageHandler(response.type, response.message)
      navigate('/propiedades');
    }
  }

  const handleData = async (props) => {
    try {
      if (step === 1 && propertyId === "") {
        return true
      } else if (step === 2 && propertyId === "") {
        const response = await handlePost({ ...props, extras: { ...allExtras }, characteristics: { ...allCharacteristics } })
        if (response) {
          setData({ ...data, ...props, _id: response, extras: { ...allExtras }, characteristics: { ...allCharacteristics } })
          return true
        }
      } else if ((step === 1 && propertyId !== "") || (step === 2 && propertyId !== "") || step === 3 || step === 5) {
        const response = await handlePatch(props)
        setData(props)
        return response
      } else if (step === 4) {
        const response = await handleVideos(props)
        setData(props)
        return response
      }
    } catch (e) {
      return false
    }
  }

  const handlePost = async (props) => {
    const id = await dispatch(createProp(props, token))
    setPropertyId(id)
    return id
  }

  const handlePatch = async (props) => {
    if (step === 1 || step === 2) {
      const edicion = await dispatch(editBasicData(props, propertyId, token));
      return edicion.status < 400
        ? { type: 'success', message: edicion.data.message }
        : { type: 'error', message: edicion.data.message };
    } else if (step === 3) {
      const edicion = await dispatch(uploadCharacteristics(props, propertyId, token));
      return edicion.status < 400
        ? { type: 'success', message: edicion.data.message }
        : { type: 'error', message: edicion.data.message };
    } else if (step === 5) {
      const edicion = await dispatch(uploadCharacteristics(props, propertyId, token));
      return edicion.status < 400
        ? { type: 'success', message: edicion.data.message }
        : { type: 'error', message: edicion.data.message };
    }
  };

  const handleVideos = async (props) => {
    let formData = new FormData();
    formData.append('video', props.video);
    formData.append('video360', props.video360);
    const response = await dispatch(uploadImage(props._id, formData, token));
    return response.status < 400
      ? { type: 'success', message: "Propiedad actualizada con éxito" }
      : { type: 'error', message: "Propiedad actualizada con éxito" };
  };

  const handleActivate = async () => {
    const response = await dispatch(setPropActive(propertyId, token));
    if (response < 400) return response
  };

  const handleNext = () => {
    setAction("next")
    yupSubmitRef.current.click()
  }

  const handleExit = () => {
    setAction("exit")
    yupSubmitRef.current.click()
  }

  const handlePhysicDelete = () => {
    if (step > 2 || propertyId) {
      dispatch(physicDelete(propertyId, token))
    }
    navigate("/propiedades")
  }


  const handleNavs = async (targetStep) => {
    if (targetStep < step) {
      setStep(targetStep);
    } else if (step !== 5 && targetStep > step) {
      handleNext();
    }
  };

  return (
    <>
      <Card
        size="xl"
        noValidate
        className="theme-wizard mb-5"
      >
        <Card.Header
          className={classNames('bg-light'/* , {
            'px-4 py-3': variant !== 'pills',
            'pb-2': !variant
          } */)}
          style={{ padding: '20px 20px' }}
        >
          <div className='d-flex w-100 align-items-center justify-content-between px-3 mt-4 mb-5'>
            <h4 className='m-0'>
              <FontAwesomeIcon icon='fa-plus' className='text-success' style={{ marginRight: 10 }} />
              Cargar una propiedad
            </h4>
            <Breadcrumb>
              <Breadcrumb.Item onClick={() => navigate('/propiedades')}>
                Gestionar Propiedades
              </Breadcrumb.Item>
              <Breadcrumb.Item href="#" active>
                Cargar una propiedad
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <Nav className="justify-content-center" variant={variant}>
            {variant === 'pills'
              ? navItems.map((item, index) => (
                <NavItemPill
                  key={item.label}
                  index={index + 1}
                  step={step}
                  handleNavs={handleNavs}
                  icon={item.icon}
                  label={item.label}
                />
              ))
              : navItems.map((item, index) => (
                <NavItem
                  key={item.label}
                  index={index + 1}
                  step={step}
                  handleNavs={handleNavs}
                  icon={item.icon}
                  label={item.label}
                />
              ))}
          </Nav>
        </Card.Header>
        {progressBar && <ProgressBar now={step * 25} style={{ height: 2 }} />}
        {data &&
          <Card.Body className="fw-normal px-md-6 py-4">
            {step === 1 && (
              <OperacionYPropiedad
                data={data}
                setData={setData}
                yupSubmitRef={yupSubmitRef}
                handleSubmit={handleSubmit} />
            )}
            {step === 2 && (
              <Ubicacion
                data={data}
                setData={setData}
                yupSubmitRef={yupSubmitRef}
                handleSubmit={handleSubmit} />
            )}
            {step === 3 && (
              data.property_type === 1 ?
                <Departamento
                  data={data}
                  setData={setData}
                  propertyId={propertyId}
                  yupSubmitRef={yupSubmitRef}
                  handleSubmit={handleSubmit} />
                : data.property_type === 2 ?
                  <Casa
                    data={data}
                    setData={setData}
                    yupSubmitRef={yupSubmitRef}
                    handleSubmit={handleSubmit} />
                  : data.property_type === 3 ?
                    <Ph
                      data={data}
                      setData={setData}
                      yupSubmitRef={yupSubmitRef}
                      handleSubmit={handleSubmit} />
                    : data.property_type === 4 ? <Cochera
                      data={data}
                      setData={setData}
                      yupSubmitRef={yupSubmitRef}
                      handleSubmit={handleSubmit} />
                      : data.property_type === 5 ? <Consultorio
                        data={data}
                        setData={setData}
                        yupSubmitRef={yupSubmitRef}
                        handleSubmit={handleSubmit} />
                        : data.property_type === 6 ? <FondoDeComercio
                          data={data}
                          setData={setData}
                          yupSubmitRef={yupSubmitRef}
                          handleSubmit={handleSubmit} />
                          : data.property_type === 7 ? <Local
                            data={data}
                            setData={setData}
                            yupSubmitRef={yupSubmitRef}
                            handleSubmit={handleSubmit} />
                            : data.property_type === 8 ? <Bodega
                              data={data}
                              setData={setData}
                              yupSubmitRef={yupSubmitRef}
                              handleSubmit={handleSubmit} />
                              : data.property_type === 9 && <Terreno
                                data={data}
                                setData={setData}
                                yupSubmitRef={yupSubmitRef}
                                handleSubmit={handleSubmit} />
            )}
            {step === 4 &&
              <Multimedia
                data={data}
                setData={setData}
                yupSubmitRef={yupSubmitRef}
                handleSubmit={handleSubmit} />
            }
            {step === 5 &&
              <Extras
                data={data}
                setData={setData}
                yupSubmitRef={yupSubmitRef}
                handleSubmit={handleSubmit} />
            }
          </Card.Body>
        }
        <Card.Footer
          className={classNames('px-6 bg-light', {
            'd-none': step === 6,
            ' d-flex justify-content-between align-items-start': step < 6
          })}
        >
          <div className='d-flex flex-row w-25 justify-content-start'>
            {step > 1 &&
              <div className='me-3'>
                <IconButton
                  variant="outline-primary px-2"
                  icon={'chevron-left'}
                  iconAlign="left"
                  transform="shrink-3"
                  buttonSize='sm'
                  style={{ width: 100 }}
                  onClick={() => {
                    setStep(step - 1);
                  }}
                >
                  Atrás
                </IconButton>
              </div>}
            <div>
              <IconButton
                variant="danger px-2"
                icon={'xmark'}
                iconAlign="left"
                buttonSize='sm'
                style={{ width: 170 }}
                onClick={handlePhysicDelete}
              >
                {step < 2 ? 'Salir' : 'Salir sin guardar'}
              </IconButton>
            </div>
          </div>
          <div className='d-flex flex-row w-25 justify-content-end align-items-center'>
            {step > 1 &&
              <div>
                <IconButton
                  variant="warning"
                  className={classNames('ms-auto px-1')}
                  style={{ width: 200 }}
                  buttonSize='sm'
                  icon={faFloppyDisk}
                  onClick={handleExit}
                >
                  Guardar y salir
                </IconButton>
              </div>}
            {data.status !== 'published' &&
              <div className='ms-3'>
                <IconButton
                  variant="success"
                  className="px-5"
                  buttonSize='sm'
                  transform="shrink-3"
                  icon={isRTL ? 'chevron-left' : 'chevron-right'}
                  iconAlign="right"
                  style={{ width: 200 }}
                  onClick={handleNext}
                >
                  {step === 1 ? 'Siguiente' : step !== 5 ? "Guardar y seguir" : "Publicar aviso"}
                </IconButton>
              </div>}
          </div>
        </Card.Footer>
      </Card>
    </>
  );
};

const NavItem = ({ index, step, handleNavs, icon, label }) => {
  return (
    <Nav.Item>
      <Nav.Link
        className={classNames('fw-semi-bold', {
          done: index < 6 ? step > index : step > 5,
          active: step === index
        })}
        onClick={() => handleNavs(index)}
      >
        <span className="nav-item-circle-parent">
          <span className="nav-item-circle">
            <FontAwesomeIcon icon={icon} />
          </span>
        </span>
        <span className="d-none d-md-block mt-1 fs--1">{label}</span>
      </Nav.Link>
    </Nav.Item>
  );
};

const NavItemPill = ({ index, step, handleNavs, icon, label }) => {
  return (
    <Nav.Item>
      <Nav.Link
        className={classNames('fw-semi-bold', {
          done: step > index,
          active: step === index
        })}
        onClick={() => handleNavs(index)}
      >
        <Flex alignItems="center" justifyContent="center">
          <FontAwesomeIcon icon={icon} />
          <span className="d-none d-md-block mt-1 fs--1 ms-2">{label}</span>
        </Flex>
      </Nav.Link>
    </Nav.Item>
  );
};

WizardLayout.propTypes = {
  variant: PropTypes.oneOf(['pills']),
  validation: PropTypes.bool,
  progressBar: PropTypes.bool
};

NavItemPill.propTypes = {
  index: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  handleNavs: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

NavItem.propTypes = NavItemPill.propTypes;

export default WizardLayout;
