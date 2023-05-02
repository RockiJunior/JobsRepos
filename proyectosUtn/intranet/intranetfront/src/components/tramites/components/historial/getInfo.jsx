import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { capitalize } from 'utils/capitalize';
import PropTypes from 'prop-types';
import DocumentComponent from '../document/DocumentComponent';
import RenderPreview from 'components/common/RenderPreview';

const InfoComponent = ({ children, type }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="mt-2">
      <Button
        variant="link"
        className="text-primary p-0"
        onClick={() => setShow(true)}
      >
        Ver {type}
      </Button>
      <Modal size="xl" show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{capitalize(type)}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">{children}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

InfoComponent.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string.isRequired
};

export const getInfo = (info, tramite) => {
  const { tipo, id } = info;

  switch (tipo) {
    case 'informe':
      const informe = tramite.informe.find(informe => informe.id === id);

      if (informe) {
        return (
          <>
            <h6 className="m-0 mt-2">
              <strong>Informe:</strong> {informe.titulo}
            </h6>
            <InfoComponent type="informe">
              <DocumentComponent document={informe} type="informe" noPadding />
            </InfoComponent>
          </>
        );
      }
      return <strong className="text-danger">Informe eliminado</strong>;

    case 'dictamen':
      const dictamen = tramite.dictamen.find(dictamen => dictamen.id === id);

      if (dictamen) {
        return (
          <>
            <h6 className="m-0 mt-2">
              <strong>Dictamen: </strong>
              {dictamen.titulo}
            </h6>
            <InfoComponent type="dictamen">
              <DocumentComponent
                document={dictamen}
                type="dictamen"
                noPadding
              />
            </InfoComponent>
          </>
        );
      }
      return <strong className="text-danger">Dictamen eliminado</strong>;

    case 'intimacion':
      const intimacion = tramite.intimacion.find(
        intimacion => intimacion.id === id
      );

      if (intimacion) {
        return (
          <>
            <h6 className="m-0 mt-2">
              <strong>Intimación: </strong>
              {intimacion.titulo}
            </h6>
            <InfoComponent type="intimacion">
              <DocumentComponent
                document={intimacion}
                type="intimacion"
                noPadding
              />
            </InfoComponent>
          </>
        );
      }
      return <strong className="text-danger">Intimación eliminada</strong>;

    case 'archivo':
      const archivo = tramite.archivos.find(archivo => archivo.id === id);

      if (archivo) {
        return (
          <>
            <h6 className="m-0 mt-2">
              <strong>Archivo: </strong>
              {archivo.titulo}
            </h6>
            <InfoComponent type="archivo">
              <RenderPreview
                preview={archivo.archivoUbicacion}
                alt={archivo.titulo}
                noBorder={true}
              />
            </InfoComponent>
          </>
        );
      }
      return <strong className="text-danger">Archivo eliminado</strong>;

    default:
      return null;
  }
};
