import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const stepMaker = (step, index, i, stepsPerRow, actualStep, status) => {
  index = index + i * stepsPerRow;

  return (
    <div
      key={`${i}-${index}`}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
          alignItems: 'center'
        }}
      >
        {index !== 0 + i * stepsPerRow && (
          <div
            style={{
              height: '10px',
              width: '20px',
              backgroundColor: 'var(--falcon-dark)',
              margin: '-5px'
            }}
          />
        )}

        <div
          style={{
            height: '24px',
            width: '24px',
            borderRadius: '50%',
            backgroundColor: 'var(--falcon-dark)'
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
          alignItems: 'center',
          position: 'absolute',
          marginLeft: '2px'
        }}
      >
        {index !== 0 + i * stepsPerRow && (
          <div
            style={{
              height: '6px',
              width: '20px',
              margin: '-5px',
              transition: 'background-color 0.5s ease',
              backgroundColor:
                actualStep >= index
                  ? 'var(--falcon-success)'
                  : 'var(--falcon-white)'
            }}
          />
        )}
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tooltip-top">{step.tooltip}</Tooltip>}
        >
          <div
            style={{
              height: '20px',
              width: '20px',
              zIndex: '1',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'background-color 0.5s ease',
              backgroundColor:
                actualStep > index ||
                (actualStep === index &&
                  (status === 'aprobado' || status === 'finalizado'))
                  ? 'var(--falcon-success)'
                  : actualStep === index &&
                    status !== 'aprobado' &&
                    status !== 'rechazado' &&
                    status !== 'archivado' &&
                    status !== 'finalizado' &&
                    status !== 'cancelado' &&
                    status !== 'desestimado' &&
                    status !== 'no_ratificado'
                  ? 'var(--falcon-warning)'
                  : actualStep === index &&
                    (status === 'rechazado' ||
                      status === 'cancelado' ||
                      status === 'desestimado' ||
                      status === 'no_ratificado')
                  ? 'var(--falcon-danger)'
                  : actualStep === index && status === 'archivado'
                  ? 'var(--falcon-info)'
                  : 'var(--falcon-white)'
            }}
          >
            {actualStep > index && (
              <FontAwesomeIcon icon="check-circle" className="text-white" />
            )}

            {actualStep === index && (
              <FontAwesomeIcon
                icon={
                  status === 'rechazado' ||
                  status === 'cancelado' ||
                  status === 'desestimado' ||
                  status === 'no_ratificado'
                    ? 'xmark-circle'
                    : status === 'archivado'
                    ? 'check-circle'
                    : status === 'aprobado' || status === 'finalizado'
                    ? 'check-circle'
                    : 'clock'
                }
                className="text-white"
              />
            )}
          </div>
        </OverlayTrigger>
      </div>
    </div>
  );
};

const Stepper = ({ steps, actualStep, fatherWidth, status }) => {
  const [stepsPerRow, setStepsPerRow] = useState(2);
  const [rows, setRows] = useState([]);

  const [step, setStep] = useState(actualStep);

  useEffect(() => {
    if (
      status === 'aprobado' ||
      status === 'archivado' ||
      status === 'finalizado'
    ) {
      setStep(steps.length);
    } else {
      setStep(actualStep);
    }
  }, [status, actualStep]);

  useEffect(() => {
    if (fatherWidth > 0) {
      setStepsPerRow(Math.floor(fatherWidth / 34));
    }
  }, [fatherWidth]);

  useEffect(() => {
    const rows = [];
    let row = [];
    steps.forEach((step, index) => {
      if (index % stepsPerRow === 0 && index !== 0) {
        rows.push(row);
        row = [];
      }
      row.push(step);
    });

    rows.push(row);

    setRows(rows);
  }, [stepsPerRow, steps]);

  return (
    <div style={{ width: 'fit-content' }}>
      {rows.map((row, i) => (
        <div key={`${i}-row`}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: i % 2 === 0 ? 'start' : 'end'
            }}
          >
            {i % 2 === 0
              ? row.map((row, index) =>
                  stepMaker(row, index, i, stepsPerRow, step, status)
                )
              : row
                  .map((row, index) =>
                    stepMaker(row, index, i, stepsPerRow, step, status)
                  )
                  .reverse()}
          </div>

          {rows[i + 1] && (
            <div
              style={{
                display: 'flex',
                justifyContent: i % 2 === 0 ? 'end' : 'start'
              }}
            >
              <div
                style={{
                  height: '20px',
                  width: '10px',
                  backgroundColor: 'black',
                  marginTop: '-5px',
                  marginBottom: '-5px',
                  marginRight: '7px',
                  marginLeft: '7px'
                }}
              />

              <div
                style={{
                  height: '20px',
                  width: '6px',
                  margin: '-5px',
                  position: 'absolute',
                  marginRight: '9px',
                  marginLeft: '9px',
                  transition: 'background-color 0.5s ease',
                  backgroundColor:
                    actualStep >= rows[i].length + i * stepsPerRow
                      ? 'var(--falcon-success)'
                      : 'var(--falcon-white)'
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

Stepper.propTypes = {
  steps: PropTypes.array.isRequired,
  actualStep: PropTypes.number.isRequired,
  column: PropTypes.bool,
  fatherWidth: PropTypes.number,
  status: PropTypes.string
};

export default Stepper;
