import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Flex from 'components/common/Flex';
import IconButton from 'components/common/IconButton';
import AppContext, { AuthWizardContext } from 'context/Context';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Breadcrumb, Card, Col, Nav, ProgressBar, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Extras from 'sites/admin/inmobiliario/gestionarPropiedades/steps/Extras';
import Multimedia from 'sites/admin/inmobiliario/gestionarPropiedades/steps/Multimedia';
import OperacionYPropiedad from 'sites/admin/inmobiliario/gestionarPropiedades/steps/OperacionYPropiedad';
import Ubicacion from 'sites/admin/inmobiliario/gestionarPropiedades/steps/Ubicacion';
import messageHandler from 'utils/messageHandler';
import {
  editBasicData,
  getPropById,
  setPropActive,
  uploadCharacteristics,
  uploadImage
} from '../../redux/propsSlice';
import StepsStatus from 'sites/admin/inmobiliario/gestionarPropiedades/common/StepsStatus';
import { CharacteristicsForm } from '../../sites/admin/inmobiliario/gestionarPropiedades/steps/propiedades/CharacteristicsForm';

const PropiedadesWizardEdit = ({ variant, progressBar }) => {
  const { isRTL } = useContext(AppContext);
  const { step, setStep } = useContext(AuthWizardContext);

  const yupSubmitRef = useRef(null);
  const [action, setAction] = useState('');
  const [data, setData] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const id = location.pathname.split('/')[3];
  const [stepStatus, setStepStatus] = useState();

  const fetchData = async () => {
    const propiedad = await dispatch(getPropById(id, token));
    setData(propiedad);
    setStepStatus(propiedad);
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleSubmit = async (values, noChanges) => {
    setData({ ...data, ...values });

    const response = !noChanges && (await handleData({ ...data, ...values }));

    if ((noChanges || response) && action === 'next' && step !== 5) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setStep(step + 1);
    } else if ((noChanges || response) && action === 'next' && step === 5) {
      await handleActivate();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/propiedades');
    } else if ((noChanges || response) && action === 'exit') {
      messageHandler('success', response.data.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/propiedades');
    } else {
      messageHandler('error', 'Algo salió mal, por favor intente nuevamente.');
    }
  };

  const handleData = async props => {
    try {
      if (step === 1 || step === 2 || step === 3 || step === 5) {
        const response = await handlePatch(props);
        setData(props);
        return response;
      } else if (step === 4) {
        const response = await handleVideos(props);
        setData(props);
        return response;
      }
    } catch (e) {
      return false;
    }
  };

  const handlePatch = async props => {
    if (step === 1 || step === 2) {
      const edicion = await dispatch(editBasicData(props, id, token));
      return edicion;
    } else if (step === 3) {
      const edicion = await dispatch(uploadCharacteristics(props, id, token));
      return edicion;
    } else if (step === 5) {
      const edicion = await dispatch(uploadCharacteristics(props, id, token));
      return edicion;
    }
  };

  const handleNavs = async targetStep => {
    window.scrollTo({ top: 50, behavior: 'smooth' });
    setStep(targetStep);
  };

  const handleVideos = async props => {
    let formData = new FormData();
    formData.append('video', props.video);
    formData.append('video360', props.video360);
    formData.append('imageType', 'ninguno');
    const response = await dispatch(uploadImage(props._id, formData, token));
    return response;
  };

  const handleActivate = async () => {
    const response = await dispatch(setPropActive(data._id, token));
    if (response < 400) return response;
  };

  const handleNext = () => {
    setAction('next');
    yupSubmitRef.current.click();
  };

  const handleExit = () => {
    setAction('exit');
    yupSubmitRef.current.click();
  };

  const handleExitWithoutSave = () => {
    navigate('/propiedades');
  };

  return (
    <>
      <Card size="xl" noValidate className="theme-wizard mb-5">
        <Card.Header className="bg-white">
          <div className="d-flex w-100 align-items-center justify-content-between px-3 mb-3">
            <h4 className="m-0">
              <FontAwesomeIcon
                icon="fa-pen-to-square"
                style={{ marginRight: 10, fontSize: 20, color: '#fd7e14' }}
              />
              Editar una propiedad
            </h4>
            <Breadcrumb>
              <Breadcrumb.Item onClick={() => navigate('/propiedades')}>
                Gestionar Propiedades
              </Breadcrumb.Item>
              <Breadcrumb.Item href="#" active>
                Editar una propiedad
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

        {data && (
          <Card.Body className="fw-normal px-md-6">
            {step === 1 && (
              <OperacionYPropiedad
                data={data}
                setData={setData}
                yupSubmitRef={yupSubmitRef}
                handleSubmit={handleSubmit}
                setStepStatus={setStepStatus}
              />
            )}
            {step === 2 && (
              <Ubicacion
                data={data}
                setData={setData}
                yupSubmitRef={yupSubmitRef}
                handleSubmit={handleSubmit}
                setStepStatus={setStepStatus}
              />
            )}
            {step === 3 && (
              <CharacteristicsForm
                data={data}
                handleSubmit={handleSubmit}
                setData={setData}
                setStepStatus={setStepStatus}
                yupSubmitRef={yupSubmitRef}
              />
            )}
            {step === 4 && (
              <Multimedia
                data={data}
                setData={setData}
                yupSubmitRef={yupSubmitRef}
                handleSubmit={handleSubmit}
                setStepStatus={setStepStatus}
              />
            )}
            {step === 5 && (
              <Extras
                data={data}
                setData={setData}
                yupSubmitRef={yupSubmitRef}
                handleSubmit={handleSubmit}
                setStepStatus={setStepStatus}
              />
            )}
          </Card.Body>
        )}
        <Card.Footer className="bg-white">
          <StepsStatus property={stepStatus} />

          <Row className="g-2">
            <Col
              xs={{ span: 12, order: 2 }}
              md={{ span: 6, order: 1 }}
              className="d-flex justify-content-center justify-content-md-start gap-2"
            >
              {step > 1 && (
                <IconButton
                  variant="outline-primary "
                  icon="chevron-left"
                  iconAlign="left"
                  transform="shrink-3"
                  buttonSize="sm"
                  style={{ width: 230 }}
                  onClick={() => {
                    if (step > 1) setStep(step - 1);
                  }}
                >
                  Atrás
                </IconButton>
              )}

              <IconButton
                variant="danger"
                icon="xmark"
                iconAlign="left"
                buttonSize="sm"
                style={{ width: 230 }}
                onClick={handleExitWithoutSave}
              >
                Salir sin guardar
              </IconButton>
            </Col>

            <Col
              xs={{ span: 12, order: 1 }}
              md={{ span: 6, order: 2 }}
              className="d-flex justify-content-center justify-content-md-end gap-2"
            >
              <IconButton
                variant="warning"
                className={classNames('ms-auto ', {
                  'd-none': step === 1
                })}
                style={{ width: 230 }}
                buttonSize="sm"
                icon="floppy-disk"
                onClick={handleExit}
              >
                Guardar y salir
              </IconButton>

              {(step !== 5 || data?.status !== 'published') && (
                <IconButton
                  variant="success"
                  buttonSize="sm"
                  transform="shrink-3"
                  icon={isRTL ? 'chevron-left' : 'chevron-right'}
                  iconAlign="right"
                  style={{ width: 230 }}
                  onClick={handleNext}
                >
                  {step !== 5
                    ? 'Guardar y seguir'
                    : data?.status !== 'published'
                    ? 'Publicar aviso'
                    : null}
                </IconButton>
              )}
            </Col>
          </Row>
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

PropiedadesWizardEdit.propTypes = {
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

export default PropiedadesWizardEdit;
