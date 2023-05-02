import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
const ActionsWrapper = ({ children, className }) => {
  const [hasChildren, setHasChildren] = useState(false);
  const [filteredChildrens, setFilteredChildrens] = useState([]);

  useEffect(() => {
    setHasChildren(children?.some(node => node !== false));
    setFilteredChildrens(children?.filter(child => child));
  }, [children]);

  return (
    <div className={'d-flex flex-column align-items-center ' + className}>
      {hasChildren && (
        <>
          <h5 className="text-primary m-0 mb-1">Acciones</h5>
          <div className="d-flex border border-3 border-primary bg-soft-primary p-1 rounded justify-content-center">
            {filteredChildrens.map((child, index) => (
              <div
                key={index}
                className={classNames({
                  'mx-1': index !== 0 && index !== filteredChildrens.length - 1,
                  'me-1': index === 0,
                  'ms-1': index === filteredChildrens.length - 1
                })}
              >
                {child}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

ActionsWrapper.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default ActionsWrapper;
