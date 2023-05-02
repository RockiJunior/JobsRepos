import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import CedulaModal from './generarCedula/CedulaModal';
import ArchivoModal from './archivos/ArchivoModal';
import DocumentModal from './document/DocumentModal';

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

const ActionsContent = ({
  tramite,
  canAddDictamen,
  canAddInforme,
  canAddIntimacion,
  canGenerateCedula,
  goToSection,
  setKey,
  cedulaType,
  canAddArchivo,
  archivoTitle,
  canAddResolucion
}) => {
  const [showDictamenModal, setShowDictamenModal] = useState(false);
  const handleOpenDictamenModal = () => setShowDictamenModal(true);
  const handleCloseDictamenModal = () => setShowDictamenModal(false);

  const [showInformeModal, setShowInformeModal] = useState(false);
  const handleOpenInformeModal = () => setShowInformeModal(true);
  const handleCloseInformeModal = () => setShowInformeModal(false);

  const [showIntimacionModal, setShowIntimacionModal] = useState(false);
  const handleOpenIntimacionModal = () => setShowIntimacionModal(true);
  const handleCloseIntimacionModal = () => setShowIntimacionModal(false);

  const [showCedulaModal, setShowCedulaModal] = useState(false);
  const handleOpenCedulaModal = () => setShowCedulaModal(true);
  const handleCloseCedulaModal = () => setShowCedulaModal(false);

  const [showArchivoModal, setShowArchivoModal] = useState(false);
  const handleOpenArchivoModal = () => setShowArchivoModal(true);
  const handleCloseArchivoModal = () => setShowArchivoModal(false);

  const [showResolucionModal, setShowResolucionModal] = useState(false);
  const handleOpenResolucionModal = () => setShowResolucionModal(true);
  const handleCloseResolucionModal = () => setShowResolucionModal(false);

  const getFlexPosition = () => {
    const arr = [
      canAddArchivo,
      canAddDictamen,
      canAddInforme,
      canAddIntimacion,
      canGenerateCedula,
      canAddResolucion
    ];

    const length = arr.filter(item => item).length;

    if (length === 1) {
      return 'justify-content-center';
    }
  };

  return (
    <>
      <div
        className={`d-flex flex-wrap ${getFlexPosition()}`}
        style={{ width: '100%' }}
      >
        {canAddIntimacion && (
          <Action title="Intimación" handler={handleOpenIntimacionModal} />
        )}

        {canAddDictamen && (
          <Action title="Dictamen" handler={handleOpenDictamenModal} />
        )}

        {canAddInforme && (
          <Action title="Informe" handler={handleOpenInformeModal} />
        )}

        {canAddResolucion && (
          <Action title="Resolución" handler={handleOpenResolucionModal} />
        )}

        {canAddArchivo && (
          <Action
            title={archivoTitle || 'Archivo'}
            handler={handleOpenArchivoModal}
          />
        )}

        {canGenerateCedula && (
          <Action title="Cédula" handler={handleOpenCedulaModal} />
        )}
      </div>

      <DocumentModal
        show={showDictamenModal}
        handleClose={handleCloseDictamenModal}
        tramite={tramite}
        goToSection={goToSection}
        setKey={setKey}
        type="dictamen"
      />

      <DocumentModal
        show={showInformeModal}
        handleClose={handleCloseInformeModal}
        tramite={tramite}
        goToSection={goToSection}
        setKey={setKey}
        type="informe"
      />

      <DocumentModal
        show={showIntimacionModal}
        handleClose={handleCloseIntimacionModal}
        tramite={tramite}
        goToSection={goToSection}
        setKey={setKey}
        type="intimacion"
      />

      <DocumentModal
        show={showResolucionModal}
        handleClose={handleCloseResolucionModal}
        tramite={tramite}
        goToSection={goToSection}
        setKey={setKey}
        type="resolucion"
      />

      <CedulaModal
        show={showCedulaModal}
        handleClose={handleCloseCedulaModal}
        tipo={cedulaType}
        tramite={tramite}
      />

      <ArchivoModal
        show={showArchivoModal}
        handleClose={handleCloseArchivoModal}
        title={archivoTitle}
        tramite={tramite}
        goToSection={goToSection}
        setKey={setKey}
      />
    </>
  );
};

ActionsContent.propTypes = {
  tramite: PropTypes.object,
  canAddDictamen: PropTypes.bool,
  canAddInforme: PropTypes.bool,
  canAddIntimacion: PropTypes.bool,
  canGenerateCedula: PropTypes.bool,
  goToSection: PropTypes.func,
  setKey: PropTypes.func,
  cedulaType: PropTypes.string,
  canAddArchivo: PropTypes.bool,
  archivoTitle: PropTypes.string,
  expedienteType: PropTypes.string,
  canAddResolucion: PropTypes.bool
};

export default ActionsContent;
