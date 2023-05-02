import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Nav } from 'react-bootstrap';
import classNames from 'classnames';
import Success from './WizardNuevoTramiteSuccess';
import IconButton from 'components/common/IconButton';
import { WizardTipoTramites } from './WizardTipoTramites';
import WizardMatriculados from './WizardMatriculados';
import { WizardNavItem } from './WizardNavItem';
import tramites from 'assets/json/tramites';

const navItemsInitial = [
  {
    icon: 'file',
    label: 'Elegir Trámite'
  },
  {
    icon: 'thumbs-up',
    label: 'Listo'
  }
];

const WizardNuevoTramite = ({ step, setStep }) => {
  const [tramite, setTramite] = useState(null);
  const [user, setUser] = useState(null);
  const [navItems, setNavItems] = useState(navItemsInitial);

  useEffect(() => {
    if (tramite) {
      if (
        tramite.tipo === 'denuncia' &&
        tramite.id !== tramites.denunciaMesaEntrada
      ) {
        setStep(3);
      } else {
        setNavItems([
          {
            icon: 'file',
            label: 'Elegir Trámite'
          },
          {
            icon: 'user',
            label: 'Elegir Matriculado'
          },
          {
            icon: 'thumbs-up',
            label: 'Listo'
          }
        ]);
        setStep(2);
      }
    } else {
      setNavItems(navItemsInitial);
    }
  }, [tramite]);

  useEffect(() => {
    user && setStep(3);
  }, [user]);

  const reset = () => {
    setTramite(null);
    setUser(null);
    setStep(1);
  };

  const handleNavs = targetStep => {
    if (targetStep < step) {
      setStep(targetStep);
      targetStep === 1 && setTramite(null);
      setUser(null);
    } else {
      if (step === 1 && tramite) {
        setStep(targetStep);
      } else if (step === 2 && user) {
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
        <div className="fw-normal px-md-6 py-4 d-flex justify-content-center">
          {step === 1 && <WizardTipoTramites setTramite={setTramite} />}

          {step === 2 && <WizardMatriculados setUser={setUser} />}

          {step === 3 && (
            <Success reset={reset} tramite={tramite} user={user} />
          )}
        </div>

        <div className="d-flex justify-content-between">
          <IconButton
            variant="link"
            icon="chevron-left"
            iconAlign="left"
            transform="down-1 shrink-4"
            className={classNames('px-md-6 fw-semi-bold', {
              'd-none': step === 1
            })}
            onClick={() => {
              setStep(step => {
                step === 2 && setTramite(null);
                step === 3 && setUser(null);

                return step - 1;
              });
            }}
            size="sm"
          >
            Anterior
          </IconButton>

          {tramite?.tipo === 'denuncia' && (
            <IconButton
              variant="link"
              icon="chevron-right"
              iconAlign="right"
              transform="down-1 shrink-4"
              className={classNames('px-md-6 fw-semi-bold', {
                'd-none': step !== 2
              })}
              onClick={() => {
                setStep(step => step + 1);
              }}
              size="sm"
            >
              Continuar sin matriculado
            </IconButton>
          )}
        </div>
      </div>
    </>
  );
};

WizardNuevoTramite.propTypes = {
  validation: PropTypes.bool,
  progressBar: PropTypes.bool,
  setStep: PropTypes.func.isRequired,
  step: PropTypes.number.isRequired
};

export default WizardNuevoTramite;
