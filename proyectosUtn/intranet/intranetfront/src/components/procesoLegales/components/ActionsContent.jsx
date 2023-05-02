import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import ArchivoModal from './archivos/ArchivoModal';
import DespachoImputacionModal from './despachoImputacion/DespachoImputacionModal';
import DocumentModal from './document/DocumentModal';
import CedulaModal from './generarCedula/CedulaModal';

const Action = ({ title, handler, isEdit }) => (
  <div className="p-1 w-100 w-md-50">
    <Button style={{ width: '100%', height: '50px' }} onClick={handler}>
      {title === 'Expediente' ? 'Iniciar' : isEdit ? 'Editar' : 'Añadir'}{' '}
      {title}
    </Button>
  </div>
);

Action.propTypes = {
  title: PropTypes.string.isRequired,
  handler: PropTypes.func.isRequired,
  isEdit: PropTypes.bool
};

const ActionsContent = ({
  expediente,
  goToSection,
  setKey,
  procesoLegalId,
  canAddArchivo,
  canAddFallos,
  canAddDictamen,
  canAddResolucion,
  canAddImputaciones,
  canAddInforme,
  canGenerateCedula,
  archivoTitle,
  cedulaType,
  despachoImputacion
}) => {
  const [showCedulaModal, setShowCedulaModal] = useState(false);
  const handleOpenCedulaModal = () => setShowCedulaModal(true);
  const handleCloseCedulaModal = () => setShowCedulaModal(false);

  const [showArchivoModal, setShowArchivoModal] = useState(false);
  const handleOpenArchivoModal = title => setShowArchivoModal(title);
  const handleCloseArchivoModal = () => setShowArchivoModal(false);

  const [showFalloModal, setShowFalloModal] = useState(false);
  const handleOpenFalloModal = () => setShowFalloModal(true);
  const handleCloseFalloModal = () => setShowFalloModal(false);

  const [showResolucionModal, setShowResolucionModal] = useState(false);
  const handleOpenResolucionModal = () => setShowResolucionModal(true);
  const handleCloseResolucionModal = () => setShowResolucionModal(false);

  const [showDictamenModal, setShowDictamenModal] = useState(false);
  const handleOpenDictamenModal = () => setShowDictamenModal(true);
  const handleCloseDictamenModal = () => setShowDictamenModal(false);

  const [showInformeModal, setShowInformeModal] = useState(false);
  const handleOpenInformeModal = () => setShowInformeModal(true);
  const handleCloseInformeModal = () => setShowInformeModal(false);

  const [showDespachoImputacionModal, setShowDespachoImputacionModal] =
    useState(false);
  const handleOpenDespachoInputacionModal = () =>
    setShowDespachoImputacionModal(true);
  const handleCloseDespachoImputacionModal = () =>
    setShowDespachoImputacionModal(false);

  const getFlexPosition = () => {
    const arr = [
      canAddArchivo,
      canAddFallos,
      canAddDictamen,
      canAddResolucion,
      canAddImputaciones,
      canGenerateCedula,
      canAddInforme
    ];

    const length = arr.filter(item => item).length;

    if (length === 1) {
      return 'justify-content-center';
    }
  };
  console.log(archivoTitle);
  return (
    <>
      <div
        className={`d-flex flex-wrap ${getFlexPosition()}`}
        style={{ width: '100%' }}
      >
        {canAddInforme && (
          <Action title="Informe" handler={handleOpenInformeModal} />
        )}

        {canAddDictamen && (
          <Action title="Dictamen" handler={handleOpenDictamenModal} />
        )}

        {canAddFallos && (
          <Action title="Fallo" handler={handleOpenFalloModal} />
        )}

        {canAddResolucion && (
          <Action title="Resolución" handler={handleOpenResolucionModal} />
        )}

        {canAddImputaciones && (
          <Action
            title="Imputaciones"
            handler={handleOpenDespachoInputacionModal}
            isEdit={!!despachoImputacion}
          />
        )}

        {canAddArchivo && archivoTitle ? (
          archivoTitle.map(title => (
            <Action
              key={title}
              title={title}
              handler={() => handleOpenArchivoModal(title)}
            />
          ))
        ) : (
          <Action title="Archivo" handler={handleOpenArchivoModal} />
        )}

        {canGenerateCedula && (
          <Action title="Cédula" handler={handleOpenCedulaModal} />
        )}
      </div>

      <DocumentModal
        show={showInformeModal}
        handleClose={handleCloseInformeModal}
        expediente={expediente}
        goToSection={goToSection}
        setKey={setKey}
        type="informe"
        procesoLegalId={procesoLegalId}
      />

      <DocumentModal
        show={showFalloModal}
        handleClose={handleCloseFalloModal}
        expediente={expediente}
        goToSection={goToSection}
        setKey={setKey}
        type="fallo"
        procesoLegalId={procesoLegalId}
      />

      <DocumentModal
        show={showResolucionModal}
        handleClose={handleCloseResolucionModal}
        expediente={expediente}
        goToSection={goToSection}
        setKey={setKey}
        type="resolucion"
        procesoLegalId={procesoLegalId}
      />

      <DocumentModal
        show={showDictamenModal}
        handleClose={handleCloseDictamenModal}
        expediente={expediente}
        goToSection={goToSection}
        setKey={setKey}
        type="dictamen"
        procesoLegalId={procesoLegalId}
      />

      {canGenerateCedula && (
        <CedulaModal
          show={showCedulaModal}
          handleClose={handleCloseCedulaModal}
          expediente={expediente}
          setKey={setKey}
          tipo={cedulaType}
        />
      )}

      <ArchivoModal
        show={showArchivoModal}
        handleClose={handleCloseArchivoModal}
        expediente={expediente}
        procesoLegalId={procesoLegalId}
        goToSection={goToSection}
        setKey={setKey}
        title={showArchivoModal}
      />

      <DespachoImputacionModal
        show={showDespachoImputacionModal}
        handleClose={handleCloseDespachoImputacionModal}
        procesoLegalId={procesoLegalId}
        expedienteId={expediente.id}
        goToSection={goToSection}
        setKey={setKey}
        despachoImputacion={despachoImputacion}
      />
    </>
  );
};

ActionsContent.propTypes = {
  expediente: PropTypes.object.isRequired,
  goToSection: PropTypes.func.isRequired,
  setKey: PropTypes.func.isRequired,
  procesoLegalId: PropTypes.number.isRequired,
  canAddArchivo: PropTypes.bool.isRequired,
  canAddFallos: PropTypes.bool.isRequired,
  canAddDictamen: PropTypes.bool.isRequired,
  canAddResolucion: PropTypes.bool.isRequired,
  canAddImputaciones: PropTypes.bool.isRequired,
  canGenerateCedula: PropTypes.bool.isRequired,
  canAddInforme: PropTypes.bool.isRequired,
  archivoTitle: PropTypes.array,
  cedulaType: PropTypes.string,
  despachoImputacion: PropTypes.object
};

export default ActionsContent;
