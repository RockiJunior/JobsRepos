import React, { useEffect, useState } from 'react';
import { Button, Dropdown, ListGroup, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  eventoGetAllPending,
  getWaitList,
  inviteUsers
} from 'redux/actions/eventos';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CreateEventModal from './EventModal';

const InviteModal = ({ show, onHide, usuarios, tipoEventoId }) => {
  const { eventos } = useSelector(state => state.eventoReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(eventoGetAllPending());
  }, []);

  useEffect(() => {
    if (tipoEventoId && eventos) {
      setFilteredEventos(
        eventos.filter(evento => evento.tipoEventoId === tipoEventoId)
      );
    }
  }, [eventos, tipoEventoId]);

  const [filteredEventos, setFilteredEventos] = useState(eventos);

  const [evento, setEvento] = useState(null);

  const [showCreate, setShowCreate] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    setEvento(null);
    onHide();
  };

  const handleInvite = async () => {
    if (evento && !loading) {
      setLoading(true);
      const usuarioEventos = usuarios.map(usuario => ({
        usuarioEventoId: usuario.usuarioEventoId,
        usuarioId: usuario.usuarioId,
        email: usuario.email
      }));

      await dispatch(inviteUsers(evento.id, usuarioEventos));
      await dispatch(getWaitList());
      handleCancel();
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      style={{ filter: showCreate ? 'blur(3px)' : '' }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Invitar a evento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Modal.Title className="fs-1 mb-2">Matriculados a invitar:</Modal.Title>
        <ListGroup>
          {usuarios.map(usuario => (
            <ListGroup.Item
              className="d-flex justify-content-between"
              key={usuario.usuarioEventoId}
            >
              <strong>
                {usuario.nombre} {usuario.apellido}
              </strong>
              <strong>DNI: {usuario.dni}</strong>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Body>
        <Dropdown navbar>
          <Dropdown.Toggle className="w-100 bg-light text-dark">
            {evento
              ? `${evento.tipoEvento.nombre} ${dayjs(evento.fecha).format(
                  'DD/MM/YYYY [a las] HH:mm [hs]'
                )}`
              : 'Seleccionar evento'}
          </Dropdown.Toggle>

          <Dropdown.Menu className="dropdown-menu-card dropdown-menu-end w-100">
            <div className="bg-white rounded-2 p-1 dark__bg-1000">
              {filteredEventos.map((evento, index) => (
                <div key={evento.id}>
                  <Dropdown.Item
                    onClick={() => setEvento(evento)}
                    className="py-1 d-flex align-items-center justify-content-between"
                  >
                    <h5 className="m-0">{evento.tipoEvento.nombre}</h5>
                    <h5>
                      {dayjs(evento.fecha).format(
                        'DD/MM/YYYY [a las] HH:mm [hs]'
                      )}
                    </h5>
                  </Dropdown.Item>
                  {index !== filteredEventos.length - 1 && (
                    <hr className="m-0 my-2" />
                  )}
                </div>
              ))}
              <hr className="m-0 mb-2" />
              <Dropdown.Item
                style={{ cursor: 'default' }}
                className="p-0 d-flex align-items-center justify-content-between"
              >
                <Button
                  size="sm"
                  className="w-100"
                  onClick={() => setShowCreate(true)}
                >
                  Crear evento <FontAwesomeIcon icon="plus" />
                </Button>
              </Dropdown.Item>
            </div>
          </Dropdown.Menu>
        </Dropdown>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" size="sm" onClick={handleCancel}>
          Cancelar
        </Button>

        <Button
          variant="success"
          size="sm"
          disabled={!evento}
          onClick={handleInvite}
        >
          Invitar
        </Button>
      </Modal.Footer>

      <CreateEventModal show={showCreate} setShow={setShowCreate} />
    </Modal>
  );
};

InviteModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  usuarios: PropTypes.array.isRequired,
  tipoEventoId: PropTypes.number.isRequired
};

export default InviteModal;
