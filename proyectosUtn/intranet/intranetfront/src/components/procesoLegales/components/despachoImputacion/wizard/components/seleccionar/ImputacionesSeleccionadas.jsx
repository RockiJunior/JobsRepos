import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

const TreeviewListItem = ({
  imputaciones,
  titulo,
  id,
  setSelectedImputaciones,
  selectedImputaciones,
  esVistaPrevia
}) => {
  return (
    <li className="treeview-list-item">
      {imputaciones?.length ? (
        <>
          <div className="mt-1 px-2" style={{ width: 'fit-content' }}>
            <div className="d-flex">
              <p className="treeview-text text-dark">{titulo}</p>
            </div>
          </div>

          <ul
            className={classNames('treeview-list', {
              'collapse-hidden': !open,
              'collapse-show treeview-border': open
            })}
          >
            {imputaciones.map(nestedItem => (
              <TreeviewListItem
                key={nestedItem.id}
                imputaciones={nestedItem.imputaciones}
                titulo={nestedItem.titulo}
                id={nestedItem.id}
                setSelectedImputaciones={setSelectedImputaciones}
                selectedImputaciones={selectedImputaciones}
                esVistaPrevia={esVistaPrevia}
              />
            ))}
          </ul>
        </>
      ) : (
        <div
          className="treeview-item mt-1 px-2"
          style={{ width: 'fit-content' }}
        >
          <p className="treeview-text text-dark">
            {titulo}{' '}
            {!esVistaPrevia && (
              <FontAwesomeIcon
                icon="times"
                className="ms-2 cursor-pointer"
                onClick={() => {
                  setSelectedImputaciones(
                    selectedImputaciones.filter(
                      selectedImputacion => selectedImputacion !== id
                    )
                  );
                }}
              />
            )}
          </p>
        </div>
      )}
    </li>
  );
};

TreeviewListItem.propTypes = {
  imputaciones: PropTypes.array,
  titulo: PropTypes.string,
  id: PropTypes.number,
  current: PropTypes.bool,
  setSelectedImputaciones: PropTypes.func,
  selectedImputaciones: PropTypes.array,
  esVistaPrevia: PropTypes.bool
};

const ImputacionesSeleccionadas = ({
  selectedImputaciones,
  setSelectedImputaciones,
  imputaciones,
  esVistaPrevia,
  isAccordion
}) => {
  const [inputacionesConPadre, setInputacionesConPadre] = useState([]);

  useEffect(() => {
    const imputacionesConPadre = imputaciones
      .map(imputacion => ({
        ...imputacion,
        imputaciones: imputacion.imputaciones.filter(imputacion =>
          selectedImputaciones.includes(imputacion.id)
        )
      }))
      .filter(imputacion => imputacion.imputaciones.length);

    setInputacionesConPadre(imputacionesConPadre);
  }, [selectedImputaciones, imputaciones]);

  return (
    <div>
      {isAccordion ? (
        <h6 className="px-1">
          <strong>
            <FontAwesomeIcon icon="list-check" className="me-2" />
            Imputaciones seleccionadas:
          </strong>
        </h6>
      ) : (
        <h5 className="text-center mb-3">
          <FontAwesomeIcon icon="list-check" className="me-2" />
          Imputaciones seleccionadas
        </h5>
      )}
      <div
        style={{
          maxHeight: isAccordion ? '' : 'calc(100vh - 370px)',
          overflowY: 'auto'
        }}
      >
        <ul className="treeview">
          {inputacionesConPadre.map(imputacion => (
            <TreeviewListItem
              key={imputacion.id}
              imputaciones={imputacion.imputaciones}
              titulo={imputacion.titulo}
              id={imputacion.id}
              selectedImputaciones={selectedImputaciones}
              isPadre={true}
              setSelectedImputaciones={setSelectedImputaciones}
              esVistaPrevia={esVistaPrevia}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

ImputacionesSeleccionadas.propTypes = {
  selectedImputaciones: PropTypes.array.isRequired,
  setSelectedImputaciones: PropTypes.func.isRequired,
  imputaciones: PropTypes.array.isRequired,
  esVistaPrevia: PropTypes.bool,
  isAccordion: PropTypes.bool
};

export default ImputacionesSeleccionadas;
