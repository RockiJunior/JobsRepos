import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { capitalize } from 'utils/capitalize';
import PropTypes from 'prop-types';
import DocumentComponent from '../document/DocumentComponent';
import RenderPreview from 'components/common/RenderPreview';
import { Link } from 'react-router-dom';
import DespachoImputacion from 'components/procesoLegales/components/despachoImputacion/DespachoImputacion';

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

export const getInfo = (info, expediente) => {
  const { tipo, id, procesoLegalId, fiscalizacionId } = info;

  let procesoLegal;
  let fiscalizacion;

  if (procesoLegalId) {
    procesoLegal = expediente.procesosLegales.find(
      procesoLegal => procesoLegal.id === procesoLegalId
    );
  }

  if (fiscalizacionId) {
    fiscalizacion = expediente.fiscalizaciones.find(
      fiscalizacion => fiscalizacion.id === fiscalizacionId
    );
  }

  switch (tipo) {
    case 'fiscalizacion':
      return (
        <div className="mt-2">
          <Link
            to={`/expedientes/${expediente.id}/fiscalizaciones/${fiscalizacionId}`}
            target="_blank"
          >
            Ver fiscalización
          </Link>
        </div>
      );

    case 'informeFiscalizacion':
      const informeFiscalizacion = fiscalizacion?.informeFiscalizacion;

      if (informeFiscalizacion) {
        return (
          <>
            <h6 className="m-0 mt-2">
              <strong>Informe: </strong>
              {informeFiscalizacion.titulo}
            </h6>
            <InfoComponent type="informe">
              <DocumentComponent
                document={informeFiscalizacion}
                type="informe"
                noPadding
                noEdit
              />
            </InfoComponent>
          </>
        );
      }
      return <strong className="text-danger">Fallo eliminado</strong>;

    case 'informe':
      let informe;

      if (procesoLegal) {
        informe = procesoLegal.informes.find(informe => informe.id === id);
      } else {
        informe = expediente.informes.find(informe => informe.id === id);
      }

      if (informe) {
        return (
          <>
            <h6 className="m-0 mt-2">
              <strong>Informe:</strong> {informe.titulo}
            </h6>
            <InfoComponent type="informe">
              <DocumentComponent
                document={informe}
                type="informe"
                noPadding
                noEdit
              />
            </InfoComponent>
          </>
        );
      }
      return <strong className="text-danger">Informe eliminado</strong>;

    case 'fallo':
      const fallo = procesoLegal?.fallos.find(fallo => fallo.id === id);

      if (fallo) {
        return (
          <>
            <h6 className="m-0 mt-2">
              <strong>Fallo: </strong>
              {fallo.titulo}
            </h6>
            <InfoComponent type="fallo">
              <DocumentComponent
                document={fallo}
                type="fallo"
                noPadding
                noEdit
              />
            </InfoComponent>
          </>
        );
      }
      return <strong className="text-danger">Fallo eliminado</strong>;

    case 'resolucion':
      const resolucion = procesoLegal?.resoluciones.find(
        resolucion => resolucion.id === id
      );

      if (resolucion) {
        return (
          <>
            <h6 className="m-0 mt-2">
              <strong>Resolución: </strong>
              {resolucion.titulo}
            </h6>
            <InfoComponent type="resolucion">
              <DocumentComponent
                document={resolucion}
                type="resolucion"
                noPadding
                noEdit
              />
            </InfoComponent>
          </>
        );
      }
      return <strong className="text-danger">Resolución eliminada</strong>;

    case 'dictamen':
      const dictamen = procesoLegal?.dictamen.find(
        dictamen => dictamen.id === id
      );

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
                noEdit
              />
            </InfoComponent>
          </>
        );
      }
      return <strong className="text-danger">Dictamen eliminado</strong>;

    case 'archivo':
      let archivo;

      if (procesoLegal) {
        archivo = procesoLegal.archivos.find(archivo => archivo.id === id);
      } else {
        archivo = expediente.archivos.find(archivo => archivo.id === id);
      }

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

    case 'procesoLegal':
      return (
        <Link
          to={`/expedientes/${expediente.id}/procesos_legales/${info.id}`}
          target="_blank"
        >
          Ir a proceso legal
        </Link>
      );

    case 'despachoImputacion':
      const despachoImputacion = procesoLegal?.despachoImputacion;

      if (despachoImputacion) {
        return (
          <>
            <h6 className="m-0 mt-2">
              <strong>Resolución: </strong>
              {despachoImputacion.titulo}
            </h6>
            <InfoComponent type="imputaciones">
              <DespachoImputacion
                despachoImputacion={despachoImputacion}
                noEdit
              />
            </InfoComponent>
          </>
        );
      }
      return <strong className="text-danger">Dictamen eliminada</strong>;

    default:
      return null;
  }
};
