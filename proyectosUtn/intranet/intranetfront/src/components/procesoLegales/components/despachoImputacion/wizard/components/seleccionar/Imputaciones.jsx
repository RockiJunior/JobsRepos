import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Collapse } from 'react-bootstrap';

const TreeviewListItem = ({
  imputaciones,
  titulo,
  id,
  current,
  selectedImputaciones,
  setSelectedImputaciones,
  openedItems,
  setOpenedItems
}) => {
  const [open, setOpen] = useState(openedItems.includes(`f${id}`));

  const handleOnExiting = () => {
    setOpenedItems(openedItems.filter(openedItem => openedItem !== `f${id}`));
  };

  const handleEntering = () => {
    setOpenedItems([...openedItems, `f${id}`]);
  };

  useEffect(() => {
    setOpen(openedItems.includes(`f${id}`));
  }, [openedItems]);

  return (
    <li className="treeview-list-item">
      {imputaciones?.length ? (
        <>
          <div
            className={classNames('mt-1 px-2', {
              'border border-primary': current,
              'bg-200': current
            })}
            style={{ width: 'fit-content' }}
          >
            <div className="d-flex">
              {!current ? (
                <>
                  <a
                    className={classNames('collapse-toggle', {
                      collapsed: open
                    })}
                    href="#!"
                    onClick={() => setOpen(!open)}
                  >
                    <p className="treeview-text text-dark">{titulo}</p>
                  </a>
                </>
              ) : (
                <p className="treeview-text text-dark">{titulo}</p>
              )}
            </div>
          </div>

          <Collapse
            in={open}
            onExiting={handleOnExiting}
            onEntering={handleEntering}
          >
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
                  current={selectedImputaciones.includes(nestedItem.id)}
                  selectedImputaciones={selectedImputaciones}
                  setSelectedImputaciones={setSelectedImputaciones}
                  openedItems={openedItems}
                  setOpenedItems={setOpenedItems}
                />
              ))}
            </ul>
          </Collapse>
        </>
      ) : (
        <div
          className={classNames('treeview-item mt-1 px-2', {
            'border border-primary': current,
            'bg-200': current
          })}
          style={{ width: 'fit-content' }}
        >
          {!current ? (
            <p className="treeview-text text-dark">
              {titulo}{' '}
              <FontAwesomeIcon
                icon="plus"
                className="ms-2 cursor-pointer"
                onClick={() => {
                  setSelectedImputaciones([...selectedImputaciones, id]);
                }}
              />
            </p>
          ) : (
            <p className="treeview-text text-dark">
              {titulo}{' '}
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
            </p>
          )}
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
  selectedImputaciones: PropTypes.array,
  setSelectedImputaciones: PropTypes.func,
  openedItems: PropTypes.array,
  setOpenedItems: PropTypes.func
};

const Imputaciones = ({
  selectedImputaciones,
  setSelectedImputaciones,
  imputaciones
}) => {
  const [openedItems, setOpenedItems] = useState([]);

  return (
    <div>
      <h5 className="text-center mb-3">
        <FontAwesomeIcon icon="list" className="me-2" />
        Imputaciones
      </h5>
      <div
        style={{
          maxHeight: 'calc(100vh - 370px)',
          overflowY: 'auto'
        }}
      >
        <ul className="treeview">
          {imputaciones.map(imputacion => (
            <TreeviewListItem
              key={imputacion.id}
              imputaciones={imputacion.imputaciones}
              titulo={imputacion.titulo}
              id={imputacion.id}
              selectedImputaciones={selectedImputaciones}
              isPadre={true}
              setSelectedImputaciones={setSelectedImputaciones}
              openedItems={openedItems}
              setOpenedItems={setOpenedItems}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

Imputaciones.propTypes = {
  selectedImputaciones: PropTypes.array,
  setSelectedImputaciones: PropTypes.func,
  imputaciones: PropTypes.array
};

export default Imputaciones;
