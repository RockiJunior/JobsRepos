import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';

const TreeviewListItem = ({ item }) => {
  return (
    <li className="treeview-list-item">
      {Object.prototype.hasOwnProperty.call(item, 'children') &&
      item.children?.length ? (
        <>
          <div
            className={classNames('mt-1 px-2', {
              'border border-primary': item.current,
              'bg-200': item.current
            })}
            style={{ width: 'fit-content' }}
          >
            <div className="d-flex">
              {!item.current ? (
                <>
                  <Link to={`/${item.tipo}/${item.id}`}>
                    <p className="treeview-text text-dark">{item.name}</p>
                  </Link>
                  <Link
                    to={`/${item.tipo}/${item.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="ms-2"
                  >
                    <FontAwesomeIcon icon="external-link" />
                  </Link>
                </>
              ) : (
                <p className="treeview-text text-dark">{item.name}</p>
              )}
            </div>
          </div>

          <ul
            className={classNames('treeview-list', {
              'collapse-hidden': !open,
              'collapse-show treeview-border': open
            })}
          >
            {item.children.map((nestedItem, index) => (
              <TreeviewListItem key={index} item={nestedItem} index={index} />
            ))}
          </ul>
        </>
      ) : (
        <div
          className={classNames('treeview-item mt-1 px-2', {
            'border border-primary': item.current,
            'bg-200': item.current
          })}
          style={{ width: 'fit-content' }}
        >
          {!item.current ? (
            <>
              <Link to={`/${item.tipo}/${item.id}`} className="flex-1">
                <p className="treeview-text text-dark">{item.name}</p>
              </Link>
              <Link
                to={`/${item.tipo}/${item.id}`}
                target="_blank"
                rel="noreferrer"
                className="ms-2"
              >
                <FontAwesomeIcon icon="external-link" />
              </Link>
            </>
          ) : (
            <p className="treeview-text text-dark no-selectable">{item.name}</p>
          )}
        </div>
      )}
    </li>
  );
};

const TreeviewRelations = ({ data }) => {
  return (
    <ul className="treeview treeview-select">
      {data.map((treeviewItem, index) => (
        <TreeviewListItem key={index} item={treeviewItem} />
      ))}
    </ul>
  );
};

TreeviewListItem.propTypes = {
  item: PropTypes.object
};

TreeviewRelations.propTypes = {
  data: PropTypes.array.isRequired
};

export default TreeviewRelations;
