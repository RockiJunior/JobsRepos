import React from 'react';
import { Button, Dropdown, Modal, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import SoftBadge from 'components/common/SoftBadge';
import { useEffect } from 'react';
import { getPartners } from 'redux/actions/area';
import { cedulaAsignarEmpleado, cedulaSinAsignar } from 'redux/actions/cedula';

const AsignarCedulaModal = ({ cedulaId, partners, setCedulaId }) => {
  const [empleado, setEmpleado] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    cedulaId && dispatch(getPartners());
  }, [cedulaId]);

  return (
    <Modal
      show={cedulaId}
      onHide={() => {
        setCedulaId(null);
        setEmpleado('');
      }}
    >
      <Modal.Header>
        <Modal.Title>Asignar cédula</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ overflow: 'visible' }}>
        <Dropdown navbar>
          <Dropdown.Toggle className="w-100">
            {empleado
              ? `${empleado.usuario.nombre} ${empleado.usuario.apellido}`
              : 'Seleccionar Responsable'}
          </Dropdown.Toggle>

          <Dropdown.Menu className="dropdown-menu-card  dropdown-menu-end w-100">
            <div className="bg-white rounded-2 py-2 dark__bg-1000">
              <Dropdown.Item
                style={{ cursor: 'default' }}
                className="py-1 d-flex align-items-center justify-content-between"
              >
                <h6 className="mb-0">Empleado</h6>
                <h6 className="mb-0">Cédulas asignadas</h6>
              </Dropdown.Item>
              <hr className="m-0 mb-2" />
              {partners.map((partner, index) => (
                <div key={partner.usuario.id}>
                  <Dropdown.Item
                    onClick={() => setEmpleado(partner)}
                    className="py-1 d-flex align-items-center justify-content-between"
                  >
                    <h5 className="m-0">
                      {partner.usuario.nombre} {partner.usuario.apellido}
                    </h5>
                    <SoftBadge variant="primary" className="fs--1">
                      {partner.numeroCedulas}
                    </SoftBadge>
                  </Dropdown.Item>
                  {index !== partners.length - 1 && <hr className="m-0 my-2" />}
                </div>
              ))}
            </div>
          </Dropdown.Menu>
        </Dropdown>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setCedulaId(null);
            setEmpleado(null);
          }}
        >
          Cancelar
        </Button>
        <Button
          size="sm"
          variant="success"
          onClick={async () => {
            if (!loading && empleado) {
              setLoading(true);

              setCedulaId(null);
              await dispatch(
                cedulaAsignarEmpleado(cedulaId, empleado.usuario.id)
              );
              await dispatch(cedulaSinAsignar());
              setEmpleado(null);

              setLoading(false);
            }
          }}
        >
          {loading ? <Spinner animation="border" size="sm" /> : 'Asignar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

AsignarCedulaModal.propTypes = {
  cedulaId: PropTypes.number,
  partners: PropTypes.array,
  setCedulaId: PropTypes.func.isRequired
};

export default AsignarCedulaModal;
