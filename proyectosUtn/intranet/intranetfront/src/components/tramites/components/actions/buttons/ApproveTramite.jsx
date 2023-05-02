import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { tramiteGetById, tramiteGotoPaso } from 'redux/actions/tramite';
import { canApproveTramite } from 'components/tramites/TramiteCheckers';

const ApproveTramite = ({ tramite }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  return (
    <>
      <Button
        size="sm"
        variant="success"
        className="d-flex align-items-center justify-content-center"
        disabled={loading}
        onClick={() => setShow(true)}
      >
        {loading ? <Spinner animation="border" size="sm" /> : 'Aprobar Trámite'}
      </Button>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        contentClassName="border"
        centered
      >
        <Modal.Header closeButton className="bg-light px-card border-bottom-0">
          <h5 className="mb-0">¿Está seguro que desea aprobar el trámite?</h5>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center">
          <Button
            size="sm"
            variant="success"
            className="me-1"
            onClick={async () => {
              if (!loading) {
                setLoading(true);
                await dispatch(
                  tramiteGotoPaso(tramite.id, canApproveTramite(tramite)[1])
                );
                await dispatch(tramiteGetById(tramite.id));
                setLoading(false);
              }
            }}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Si'}
          </Button>
          <Button
            className="ms-1"
            size="sm"
            variant="danger"
            onClick={() => setShow(false)}
          >
            <span>No</span>
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

ApproveTramite.propTypes = {
  tramite: PropTypes.object
};

export default ApproveTramite;
