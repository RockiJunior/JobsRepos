import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { rechazarTramite, tramiteGetById } from 'redux/actions/tramite';
import DocumentModal from '../../document/DocumentModal';

const RejectProcedure = ({ tramite }) => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const dispatch = useDispatch();

  const handleConfirm = async () => {
    await dispatch(rechazarTramite(tramite.id));
    await dispatch(tramiteGetById(tramite.id));
  };

  return (
    <div>
      <Button variant="danger" size="sm" onClick={handleShow}>
        Generar dictamen y rechazar tramite
      </Button>

      <DocumentModal
        show={show}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        tramite={tramite}
        type="dictamen"
      />
    </div>
  );
};

RejectProcedure.propTypes = {
  tramite: PropTypes.object.isRequired
};

export default RejectProcedure;
