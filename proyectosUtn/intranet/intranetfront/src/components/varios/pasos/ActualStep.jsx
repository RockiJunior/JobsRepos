import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Stepper from './Stepper';

const ActualStep = ({ className, tramiteExpediente, procesoLegal }) => {
  const ref = useRef();

  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(ref.current?.offsetWidth);
  }, [ref.current]);

  const handleResize = () => {
    setWidth(ref.current?.offsetWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={
        className /* + ' border border-3 border-primary rounded p-3' */
      }
      ref={ref}
    >
      {/* <h5>Paso actual:</h5>

      <h4 className="mb-3" style={{ textIndent: 20 }}>
        {
          tramiteExpediente?.tipo?.pasos[tramiteExpediente.pasoActual]
            .intraTitle
        }
      </h4> */}

      <div className="d-flex justify-content-center">
        {!!tramiteExpediente?.tipo?.pasos && (
          <Stepper
            steps={tramiteExpediente.tipo?.pasos.map(step => ({
              tooltip: step.intraTitle
            }))}
            actualStep={tramiteExpediente.pasoActual}
            fatherWidth={width - 22}
            status={
              tramiteExpediente.areas.some(
                area => area.status === 'rejected' && !area.deleted
              )
                ? 'rechazado'
                : tramiteExpediente.estado
            }
          />
        )}

        {!!procesoLegal?.pasos && (
          <Stepper
            steps={procesoLegal?.pasos.map(step => ({
              tooltip: step.intraTitle
            }))}
            actualStep={procesoLegal.pasoActual}
            fatherWidth={width - 22}
            status={procesoLegal.estado}
          />
        )}
      </div>
    </div>
  );
};

ActualStep.propTypes = {
  className: PropTypes.string,
  tramiteExpediente: PropTypes.object,
  procesoLegal: PropTypes.object
};

export default ActualStep;
