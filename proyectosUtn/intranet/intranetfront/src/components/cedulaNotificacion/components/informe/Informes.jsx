import InformeModal from './InformeModal';
import React, { useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import InformeComponent from './InformeComponent';
import PropTypes from 'prop-types';

const Informes = ({ canAddInforme }) => {
  const { cedula } = useSelector(state => state.cedulaReducer);

  const [showInformeModal, setShowInformeModal] = useState(false);

  const handleOpenInformeModal = () => setShowInformeModal(true);
  const handleCloseInformeModal = () => setShowInformeModal(false);

  return (
    <>
      {canAddInforme() ? (
        <div className="d-flex justify-content-center mb-3">
          <Button onClick={handleOpenInformeModal}>Añadir informe</Button>
        </div>
      ) : null}

      {cedula.informes?.length ? (
        <Row>
          {cedula.informes.map(informe => (
            <InformeComponent
              key={informe.id}
              informe={informe}
              canAddInforme={canAddInforme()}
              cedula={cedula}
            />
          ))}
        </Row>
      ) : (
        <center>
          <h4>No hay informes</h4>
        </center>
      )}

      <InformeModal
        show={showInformeModal}
        handleClose={handleCloseInformeModal}
        cedula={cedula}
      />
    </>
  );
};

Informes.propTypes = {
  canAddInforme: PropTypes.func
};

export default Informes;
