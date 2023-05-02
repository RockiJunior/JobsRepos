import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Flex from 'components/common/Flex';
import IconButton from 'components/common/IconButton';
import { AuthWizardContext } from 'context/Context';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Breadcrumb, Card, Col, Nav, ProgressBar, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProp, physicDelete } from 'redux/propsSlice';
import StepsStatus from 'sites/admin/inmobiliario/gestionarPropiedades/common/StepsStatus';
import {
  allCharacteristics,
  allExtras
} from 'sites/admin/inmobiliario/gestionarPropiedades/mockup/extrasMockup';
import {
  OperacionYPropiedad,
  Ubicacion
} from 'sites/admin/inmobiliario/gestionarPropiedades/steps';
import messageHandler from 'utils/messageHandler';

const WizardLayout = ({ variant, progressBar }) => {
  const { step, setStep } = useContext(AuthWizardContext);
  const [firstJoin, setFirstJoin] = useState(true);

  useEffect(() => {
    if (firstJoin) {
      setStep(1);
      setFirstJoin(false);
    }
  }, []);

  const yupSubmitRef = useRef(null);
  const [action, setAction] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const [data, setData] = useState({
    real_estate: 0,
    branch_office: 0,
    operation_type: 0,
    property_type: 0,
    sub_property_type: 0,
    title: '',
    location: {
      street: '',
      number: '',
      barrio: 0,
      lat: null,
      lng: null
    },
    surface: {
      totalSurface: '',
      coveredSurface: ''
    },
    antiquity: {
      type: '0',
      years: 0
    },
    price: {
      currency: 0,
      total: '',
      expenses: 0
    },
    status: 'pending',
    description: '',
    images: [],
    video: '',
    video360: ''
  });

  const [stepStatus, setStepStatus] = useState({
    real_estate: 0,
    branch_office: 0,
    operation_type: 0,
    property_type: 0,
    sub_property_type: 0,
    title: '',
    location: {
      street: '',
      number: '',
      barrio: 0,
      lat: null,
      lng: null
    },
    surface: {
      totalSurface: '',
      coveredSurface: ''
    },
    antiquity: {
      type: '0',
      years: 0
    },
    price: {
      currency: 0,
      total: '',
      expenses: 0
    },
    status: 'pending',
    description: '',
    images: [],
    video: '',
    video360: ''
  });

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

  const handleSubmit = async values => {
    setData({ ...data, ...values });
    const response = await handleData({ ...data, ...values });

    if (response && action === 'next') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setStep(step + 1);
    } else if (response.type && action === 'exit') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      messageHandler(response.type, response.message);
      navigate('/propiedades');
    }
  };

  const handleData = async props => {
    try {
      if (step === 1 && propertyId === '') {
        return true;
      } else if (step === 2 && propertyId === '') {
        const response = await handlePost({
          ...props,
          extras: { ...allExtras },
          characteristics: { ...allCharacteristics }
        });
        if (response) {
          setData({
            ...data,
            ...props,
            _id: response,
            extras: { ...allExtras },
            characteristics: { ...allCharacteristics }
          });
          return true;
        }
      }
    } catch (e) {
      return false;
    }
  };

  const handlePost = async props => {
    const id = await dispatch(createProp(props, token, navigate));
    id && navigate(`/propiedades/editar/${id}`);
    setPropertyId(id);
    return id;
  };

  const handleNext = () => {
    setAction('next');
    yupSubmitRef.current.click();
  };

  const handleExit = () => {
    setAction('exit');
    yupSubmitRef.current.click();
  };

  const handlePhysicDelete = () => {
    if (step > 2 || propertyId) {
      dispatch(physicDelete(propertyId, token));
    }
    navigate('/propiedades');
  };

  const handleNavs = async targetStep => {
    if (targetStep < step) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setStep(targetStep);
    } else if (step !== 5 && targetStep > step) {
      handleNext();
    }
  };

  return (
    <>
      <Card size="xl" noValidate className="theme-wizard mb-5">
        <Card.Header className="bg-white" style={{ padding: '20px 20px' }}>
          <div className="d-flex w-100 align-items-center justify-content-between mb-3">
            <h4 className="m-0">
              <FontAwesomeIcon
                icon="fa-plus"
                className="text-success"
                style={{ marginRight: 10 }}
              />
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
                  variant="outline-primary"
                  icon={'chevron-left'}
                  iconAlign="left"
                  transform="shrink-3"
                  buttonSize="sm"
                  style={{ width: 230 }}
                  onClick={() => {
                    setStep(step - 1);
                  }}
                >
                  Atrás
                </IconButton>
              )}

              <IconButton
                variant="danger"
                icon={'xmark'}
                iconAlign="left"
                buttonSize="sm"
                style={{ width: 230 }}
                onClick={handlePhysicDelete}
              >
                {step < 2 ? 'Salir' : 'Salir sin guardar'}
              </IconButton>
            </Col>

            <Col
              xs={{ span: 12, order: 1 }}
              md={{ span: 6, order: 2 }}
              className="d-flex justify-content-center justify-content-md-end gap-2"
            >
              {step > 1 && (
                <IconButton
                  variant="warning"
                  className={classNames('ms-auto')}
                  style={{ width: 230 }}
                  buttonSize="sm"
                  icon={faFloppyDisk}
                  onClick={handleExit}
                >
                  Guardar y salir
                </IconButton>
              )}

              <IconButton
                variant="success"
                buttonSize="sm"
                transform="shrink-3"
                icon={'chevron-right'}
                iconAlign="right"
                style={{ width: 230 }}
                onClick={handleNext}
              >
                {step === 1 ? 'Siguiente' : 'Guardar y seguir'}
              </IconButton>
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

WizardLayout.propTypes = {
  variant: PropTypes.oneOf(['pills']),
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
