import classNames from 'classnames';
import IconButton from 'components/common/IconButton';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getImputaciones } from 'redux/actions/procesoLegales';
import WizardDatos from './components/WizardDatos';
import { WizardImputaciones } from './components/WizardImputaciones';
import { WizardNavItem } from './components/WizardNavItem';
import Success from './components/WizardSuccess';

const WizardDespachoImputacion = ({
  step,
  setStep,
  procesoLegalId,
  expedienteId,
  handleClose,
  goToSection,
  setKey,
  despachoImputacion
}) => {
  const [formData, setFormData] = useState({ titulo: '', motivo: '' });
  const [errors, setErrors] = useState({ titulo: '', motivo: '' });
  const [selectedImputaciones, setSelectedImputaciones] = useState([]);

  const dispatch = useDispatch();
  const { imputaciones } = useSelector(state => state.expedienteReducer);

  useEffect(() => {
    dispatch(getImputaciones());
  }, []);

  useEffect(() => {
    if (despachoImputacion) {
      setFormData({
        titulo: despachoImputacion.titulo,
        motivo: despachoImputacion.motivo
      });
      setSelectedImputaciones(
        despachoImputacion.imputaciones.map(i => i.imputacionId)
      );
    } else {
      setFormData({ titulo: '', motivo: '' });
      setSelectedImputaciones([]);
    }
  }, [despachoImputacion]);

  const navItems = [
    {
      icon: 'file-text',
      label: despachoImputacion ? 'Editar Datos' : 'Agregar Datos'
    },
    {
      icon: 'list',
      label: despachoImputacion ? 'Editar Imputaciones' : 'Añadir Imputaciones'
    },

    {
      icon: 'check',
      label: 'Listo'
    }
  ];

  const reset = () => {
    if (despachoImputacion) {
      setFormData({
        titulo: despachoImputacion.titulo,
        motivo: despachoImputacion.motivo
      });
      setSelectedImputaciones(
        despachoImputacion.imputaciones.map(i => i.imputacionId)
      );
    } else {
      setFormData({ titulo: '', motivo: '' });
      setSelectedImputaciones([]);
    }
    setStep(1);
  };

  const handleNavs = targetStep => {
    if (targetStep < step) {
      setStep(targetStep);
    } else {
      if (step === 1 && formData.titulo && formData.motivo) {
        setStep(targetStep);
      } else if (step === 2 && selectedImputaciones.length) {
        setStep(targetStep);
      }
    }
  };

  return (
    <>
      <div className="theme-wizard">
        <div>
          <Nav className="justify-content-center">
            {navItems.map((item, index) => (
              <WizardNavItem
                key={item.label}
                index={index + 1}
                step={step}
                handleNavs={handleNavs}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </Nav>
        </div>
        <div
          className={classNames(
            'fw-normal px-md-6  d-flex justify-content-center',
            { 'py-4': step !== 3, 'py-0': step === 3 }
          )}
        >
          {step === 1 && (
            <WizardDatos
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
            />
          )}

          {step === 2 && (
            <WizardImputaciones
              selectedImputaciones={selectedImputaciones}
              setSelectedImputaciones={setSelectedImputaciones}
              imputaciones={imputaciones}
            />
          )}

          {step === 3 && (
            <Success
              reset={reset}
              selectedImputaciones={selectedImputaciones}
              formData={formData}
              imputaciones={imputaciones}
              procesoLegalId={procesoLegalId}
              expedienteId={expedienteId}
              handleClose={handleClose}
              goToSection={goToSection}
              setKey={setKey}
              despachoImputacion={despachoImputacion}
            />
          )}
        </div>

        <div className="d-flex justify-content-between">
          {step === 1 ? (
            <div />
          ) : (
            <IconButton
              variant="link"
              icon="chevron-left"
              iconAlign="left"
              transform="down-1 shrink-4"
              className="px-md-6 fw-semi-bold"
              onClick={() => setStep(step => step - 1)}
              size="sm"
            >
              Anterior
            </IconButton>
          )}

          <IconButton
            variant="link"
            icon="chevron-right"
            iconAlign="right"
            transform="down-1 shrink-4"
            className={classNames('px-md-6 fw-semi-bold', {
              'd-none': step === 3
            })}
            onClick={() => {
              setStep(step => {
                if (step === 1) {
                  const errors = {
                    titulo: !formData.titulo ? 'El título es requerido' : '',
                    motivo: !formData.motivo
                      ? 'La descripción es requerida'
                      : ''
                  };

                  setErrors(errors);

                  if (errors.titulo || errors.motivo) return step;

                  return step + 1;
                } else if (step === 2 && selectedImputaciones.length) {
                  return step + 1;
                }
                return step;
              });
            }}
            size="sm"
          >
            Siguiente
          </IconButton>
        </div>
      </div>
    </>
  );
};

WizardDespachoImputacion.propTypes = {
  setStep: PropTypes.func.isRequired,
  step: PropTypes.number.isRequired,
  procesoLegalId: PropTypes.number.isRequired,
  expedienteId: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired,
  goToSection: PropTypes.func.isRequired,
  setKey: PropTypes.func.isRequired,
  despachoImputacion: PropTypes.object
};

export default WizardDespachoImputacion;
