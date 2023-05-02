import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RenderPreview from './RenderPreview';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ViewFileLinkModal = ({ preview, alt }) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <a onClick={() => setShow(true)} className="p-0 m-0 cursor-pointer">
        Ver archivo{' '}
        <FontAwesomeIcon
          icon={
            preview.substring(preview.lastIndexOf('.')) === '.pdf'
              ? 'file-pdf'
              : 'image'
          }
        />
      </a>

      <Modal show={show} onHide={() => setShow(false)}>
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

        <RenderPreview preview={preview} alt={alt} />
      </Modal>
    </>
  );
};

ViewFileLinkModal.propTypes = {
  preview: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired
};

export default ViewFileLinkModal;
