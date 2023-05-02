import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ArchivoModal from './archivos/ArchivoModal';
import DocumentModal from './document/DocumentModal';
/* import CaratulaModal from './generateCaratula/CaratulaModal'; */

const Action = ({ title, handler }) => (
  <div className="p-1 w-100 w-md-50">
    <Button style={{ width: '100%', height: '50px' }} onClick={handler}>
      {title === 'Expediente' ? 'Iniciar' : 'Añadir'} {title}
    </Button>
  </div>
);

Action.propTypes = {
  title: PropTypes.string.isRequired,
  handler: PropTypes.func.isRequired
};

const ActionsContent = ({ expediente, goToSection, setKey }) => {
  const [showInformeModal, setShowInformeModal] = useState(false);
  const handleOpenInformeModal = () => setShowInformeModal(true);
  const handleCloseInformeModal = () => setShowInformeModal(false);

  const [showArchivoModal, setShowArchivoModal] = useState(false);
  const handleOpenArchivoModal = () => setShowArchivoModal(true);
  const handleCloseArchivoModal = () => setShowArchivoModal(false);

  /* const [showCaratulaModal, setShowCaratulaModal] = useState(false);
  const handleOpenCaratulaModal = () => setShowCaratulaModal(true);
  const handleCloseCaratulaModal = () => setShowCaratulaModal(false); */

  return (
    <>
      <div
        className={`d-flex flex-wrap justify-content-center`}
        style={{ width: '100%' }}
      >
        <Action title="Informe" handler={handleOpenInformeModal} />

        <Action title="Archivo" handler={handleOpenArchivoModal} />

        {/* <Action title="Carátula" handler={handleOpenCaratulaModal} /> */}
      </div>

      <DocumentModal
        show={showInformeModal}
        handleClose={handleCloseInformeModal}
        expediente={expediente}
        goToSection={goToSection}
        setKey={setKey}
        type="informe"
      />

      <ArchivoModal
        show={showArchivoModal}
        handleClose={handleCloseArchivoModal}
        expediente={expediente}
        goToSection={goToSection}
        setKey={setKey}
      />

      {/* <CaratulaModal
        expediente={expediente}
        handleClose={handleCloseCaratulaModal}
        setKey={setKey}
        show={showCaratulaModal}
      /> */}
    </>
  );
};

ActionsContent.propTypes = {
  expediente: PropTypes.object.isRequired,
  goToSection: PropTypes.func.isRequired,
  setKey: PropTypes.func.isRequired
};

export default ActionsContent;
