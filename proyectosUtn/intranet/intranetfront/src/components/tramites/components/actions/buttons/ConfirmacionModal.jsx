import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ConfirmacionModal = ({
  openModal,
  setOpenModal,
  handleAccept,
  title,
  setLoading,
  loading
}) => {
  return (
    <Modal
      show={openModal}
      onHide={() => setOpenModal(false)}
      contentClassName="border"
      centered
    >
      <Modal.Header
        closeButton
        className="bg-light px-card border-bottom-0 d-flex align-items-start"
      >
        <Modal.Title as="h5">¿Estás seguro que deseas {title}?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center">
          <Button
            size="sm"
            variant="success"
            className="me-1"
            onClick={async () => {
              if (!loading) {
                setOpenModal(false);
                setLoading(true);
                await handleAccept();
                setLoading(false);
              }
            }}
          >
            <span>Si</span>
          </Button>
          <Button
            className="ms-1"
            size="sm"
            variant="danger"
            onClick={() => setOpenModal(false)}
          >
            <span>No</span>
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

ConfirmacionModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  handleAccept: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  setLoading: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default ConfirmacionModal;
