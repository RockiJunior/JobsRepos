import AppContext from 'context/Context';
import React from 'react';
import { useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

export const DeleteModal = ({
  openDeleteModal,
  setOpenDeleteModal,
  element,
  setDeleting
}) => {
  const {
    config: { isDark }
  } = useContext(AppContext);
  const handleClose = () => {
    setOpenDeleteModal(false);
  };

  return (
    <Modal
      show={openDeleteModal}
      onHide={handleClose}
      contentClassName="border"
      centered
    >
      <Modal.Header
        closeButton
        closeVariant={isDark ? 'white' : undefined}
        className="bg-light px-card border-bottom-0"
      >
        <h5 className="mb-0">¿Está seguro que desea eliminar {element}?</h5>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center">
        <Button
          size="sm"
          variant="success"
          className="me-1"
          onClick={() => {
            setDeleting(openDeleteModal);
            setOpenDeleteModal(false);
          }}
        >
          <span>Si</span>
        </Button>
        <Button
          className="ms-1"
          size="sm"
          variant="danger"
          onClick={() => setOpenDeleteModal(false)}
        >
          <span>No</span>
        </Button>
      </Modal.Body>
    </Modal>
  );
};

DeleteModal.propTypes = {
  openDeleteModal: PropTypes.bool,
  setOpenDeleteModal: PropTypes.func,
  element: PropTypes.string,
  setDeleting: PropTypes.func
};
