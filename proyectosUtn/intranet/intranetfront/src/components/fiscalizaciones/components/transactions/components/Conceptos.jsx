import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Collapse } from 'react-bootstrap';

const TreeviewListItem = ({
  conceptos,
  nombre,
  id,
  current,
  selectedConceptos,
  setSelectedConceptos,
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
      {conceptos?.length ? (
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
                    <p className="treeview-text text-dark">{nombre}</p>
                  </a>
                </>
              ) : (
                <p className="treeview-text text-dark">{nombre}</p>
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
              {conceptos.map(nestedItem => (
                <TreeviewListItem
                  key={nestedItem.id}
                  conceptos={nestedItem.conceptos}
                  nombre={`${nestedItem.nombre} - %${nestedItem.porcentaje}`}
                  id={nestedItem.id}
                  current={selectedConceptos.includes(nestedItem.id)}
                  selectedConceptos={selectedConceptos}
                  setSelectedConceptos={setSelectedConceptos}
                  openedItems={openedItems}
                  setOpenedItems={setOpenedItems}
                />
              ))}
            </ul>
          </Collapse>
        </>
      ) : (
        <div
          className="treeview-item mt-1 px-2"
          style={{ width: 'fit-content' }}
        >
          <p className="treeview-text text-dark">
            {nombre}{' '}
            <FontAwesomeIcon
              icon="plus"
              className="ms-2 cursor-pointer"
              onClick={() => {
                setSelectedConceptos([...selectedConceptos, id]);
              }}
            />
          </p>
        </div>
      )}
    </li>
  );
};

TreeviewListItem.propTypes = {
  conceptos: PropTypes.array,
  nombre: PropTypes.string,
  id: PropTypes.number,
  current: PropTypes.bool,
  selectedConceptos: PropTypes.array,
  setSelectedConceptos: PropTypes.func,
  openedItems: PropTypes.array,
  setOpenedItems: PropTypes.func
};

const Conceptos = ({ selectedConceptos, setSelectedConceptos, conceptos }) => {
  const [openedItems, setOpenedItems] = useState([]);

  return (
    <div>
      <h5 className="text-center mb-3">
        <FontAwesomeIcon icon="list" className="me-2" />
        Conceptos
      </h5>
      <div>
        <ul className="treeview">
          {conceptos.map((concepto, index) => (
            <TreeviewListItem
              key={index}
              conceptos={concepto.conceptos}
              nombre={concepto.nombre}
              id={index}
              selectedConceptos={selectedConceptos}
              isPadre={true}
              setSelectedConceptos={setSelectedConceptos}
              openedItems={openedItems}
              setOpenedItems={setOpenedItems}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

Conceptos.propTypes = {
  selectedConceptos: PropTypes.array,
  setSelectedConceptos: PropTypes.func,
  conceptos: PropTypes.array
};

export default Conceptos;
