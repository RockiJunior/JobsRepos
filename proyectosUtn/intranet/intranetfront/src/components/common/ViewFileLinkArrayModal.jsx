import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RenderPreview from './RenderPreview';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

const ViewFileLinkArrayModal = ({ previews, alt }) => {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState(0);

  return (
    <>
      <a onClick={() => setShow(true)} className="p-0 m-0 cursor-pointer">
        Ver archivos <FontAwesomeIcon icon="file" />
      </a>

      <Modal show={show} onHide={() => setShow(false)} size="sm" centered>
        <FontAwesomeIcon
          icon="xmark"
          onClick={() => setShow(false)}
          style={{
            top: 0,
            right: -50,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.7)'
          }}
          className="position-absolute p-0 px-2 m-0 fs-5 text-danger cursor-pointer"
        />

        <RenderPreview preview={previews[current]} alt={alt} />

        <div
          className={classNames('d-flex px-4', {
            'justify-content-start': current === previews.length - 1,
            'justify-content-between':
              current !== previews.length - 1 && current !== 0,
            'justify-content-end': current === 0
          })}
        >
          {current !== 0 && (
            <div
              onClick={() => setCurrent(current - 1)}
              style={{
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                aspectRatio: '1/1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              className="p-0 px-2 m-0 fs-4 text-primary cursor-pointer"
            >
              <FontAwesomeIcon icon="arrow-left" />
            </div>
          )}

          {current !== previews.length - 1 && (
            <div
              onClick={() => setCurrent(current + 1)}
              style={{
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                aspectRatio: '1/1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              className="p-0 px-2 m-0 fs-4 text-primary cursor-pointer"
            >
              <FontAwesomeIcon icon="arrow-right" />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

ViewFileLinkArrayModal.propTypes = {
  previews: PropTypes.array.isRequired,
  alt: PropTypes.string.isRequired
};

export default ViewFileLinkArrayModal;
