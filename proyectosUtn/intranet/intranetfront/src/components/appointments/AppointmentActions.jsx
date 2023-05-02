import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConfirmacionModal from 'components/expedientes/components/actions/buttons/ConfirmacionModal';
import React, { useState } from 'react';
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { turnosGetAllByAreaID, turnosUpdateStatus } from 'redux/actions/turnos';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

const AppointmentActions = ({ turnoId, areaId }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openReprogramModal, setOpenReprogramModal] = useState(false);

  return (
    <>
      <div>
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>Reprogramar turno</Tooltip>}
        >
          <Button
            size="lg"
            variant="danger"
            className="p-1 d-flex align-items-center me-2 mb-1"
            disabled={loading}
            onClick={() => {
              if (!loading) {
                setOpenReprogramModal(true);
              }
            }}
          >
            <FontAwesomeIcon icon="clock" />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>Aprobar Turno</Tooltip>}
        >
          <Button
            size="lg"
            variant="success"
            className="p-1 d-flex align-items-center mt-1"
            disabled={loading}
            onClick={async () => {
              if (!loading) {
                setOpenApproveModal(true);
              }
            }}
          >
            {loading ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              <FontAwesomeIcon icon="circle-check" />
            )}
          </Button>
        </OverlayTrigger>
      </div>

      <ConfirmacionModal
        handleAccept={async () => {
          await dispatch(turnosUpdateStatus('approved', turnoId));
          await dispatch(turnosGetAllByAreaID(areaId));
        }}
        loading={loading}
        openModal={openApproveModal}
        setOpenModal={setOpenApproveModal}
        title="aprobar el turno"
        setLoading={setLoading}
      />

      <ConfirmacionModal
        handleAccept={async () => {
          await dispatch(turnosUpdateStatus('rejected', turnoId));
          await dispatch(turnosGetAllByAreaID(areaId));
        }}
        loading={loading}
        openModal={openReprogramModal}
        setOpenModal={setOpenReprogramModal}
        title="reprogramar el turno"
        setLoading={setLoading}
      />
    </>
  );
};

AppointmentActions.propTypes = {
  turnoId: PropTypes.string.isRequired,
  areaId: PropTypes.number /*  */.isRequired
};

export default AppointmentActions;
