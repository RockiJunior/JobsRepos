import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  ListGroup,
  OverlayTrigger,
  Row,
  Spinner,
  Tooltip
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  eventoApproveReject,
  eventoFinalizar,
  eventoGetById
} from 'redux/actions/eventos';
import updateLocale from 'dayjs/plugin/updateLocale';
import { months, weekdays } from 'dayjs/locale/es';
import ConfirmacionModal from 'components/tramites/components/actions/buttons/ConfirmacionModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  months: months.map(m => m.charAt(0).toUpperCase() + m.slice(1)),
  weekdays: weekdays.map(w => w.charAt(0).toUpperCase() + w.slice(1))
});

const Event = () => {
  const { id } = useParams();

  const { evento } = useSelector(state => state.eventoReducer);
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(eventoGetById(id));
  }, [id]);

  const handleAceptarRechazar = async (usuarioId, usuarioEventoId, estado) => {
    await dispatch(eventoApproveReject(usuarioId, usuarioEventoId, estado));
    await dispatch(eventoGetById(id));
  };

  return evento ? (
    <Card className="bg-white">
      <Card.Header>
        <Card.Title>{evento.tipoEvento.nombre}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {dayjs(evento.fecha).format('dddd D [de] MMMM [de] YYYY')} a las{' '}
          {dayjs(evento.fecha).format('hh:mm a')}
        </Card.Subtitle>
        <Card.Body>
          <Row>
            <Col xs={12} lg={6}>
              <Card.Text>{evento.tipoEvento.descripcion}</Card.Text>
              {dayjs().isAfter(dayjs(evento.fecha).startOf('day')) &&
                evento.estado !== 'finalizado' && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="me-2"
                    disabled={loading}
                    onClick={() => setOpenModal(true)}
                  >
                    {loading ? (
                      <Spinner as="span" animation="border" size="sm" />
                    ) : (
                      'Finalizar evento'
                    )}
                  </Button>
                )}
            </Col>
            <Col xs={12} lg={6}>
              <h5 className="mb-2">
                Matriculados que{' '}
                {evento.estado === 'finalizado' ? 'asistieron' : 'asistirán'}:
              </h5>
              <ListGroup>
                {evento.Usuario_Evento.map((usuarioEvento, index) =>
                  usuarioEvento.usuario.matricula[0].tomo ? (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col xs={12}>
                          <strong>
                            {usuarioEvento.usuario.nombre}{' '}
                            {usuarioEvento.usuario.apellido}
                          </strong>
                          {' - '}
                          Matrícula nro.{' '}
                          {usuarioEvento.usuario.matricula[0]?.id}
                          {usuarioEvento.estado === 'aprobado' && (
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id="tooltip-top">
                                  El matriculado juró
                                </Tooltip>
                              }
                            >
                              <FontAwesomeIcon
                                icon="check-circle"
                                className="text-success ms-2"
                              />
                            </OverlayTrigger>
                          )}
                        </Col>
                        {dayjs().isAfter(dayjs(evento.fecha).startOf('day')) &&
                          usuarioEvento.estado === 'confirmado' && (
                            <Col xs={12} className="d-flex justify-content-end">
                              <Button
                                size="sm"
                                variant="success"
                                className="me-2"
                                onClick={() =>
                                  handleAceptarRechazar(
                                    usuarioEvento.usuarioId,
                                    usuarioEvento.id,
                                    'aprobado'
                                  )
                                }
                              >
                                Juró
                              </Button>

                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() =>
                                  handleAceptarRechazar(
                                    usuarioEvento.usuarioId,
                                    usuarioEvento.id,
                                    'postergado'
                                  )
                                }
                              >
                                Reprogramar
                              </Button>
                            </Col>
                          )}
                      </Row>
                    </ListGroup.Item>
                  ) : null
                )}
              </ListGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card.Header>

      <ConfirmacionModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        setLoading={setLoading}
        loading={loading}
        handleAccept={async () => {
          await dispatch(eventoFinalizar(evento.id));
          await dispatch(eventoGetById(id));
        }}
        title="finalizar el evento"
      />
    </Card>
  ) : (
    <Card className="bg-white">
      <Card.Header>
        <Card.Title>Cargando...</Card.Title>
      </Card.Header>
    </Card>
  );
};

export default Event;
