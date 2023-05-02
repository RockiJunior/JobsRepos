import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import Calendar from 'components/common/Calendar';
import Flex from 'components/common/Flex';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { eventoDelete, eventoGetAllPending } from 'redux/actions/eventos';
import { capitalize } from 'utils/capitalize';
import EventModal from './EventModal';
import permisosData from 'data/permisos';
import { checkPermissions } from 'utils/checkPermissionsArea';
import CustomMessage from 'components/varios/messages/CustomMessage';
import { BsCalendarCheck } from 'react-icons/bs';

export const EventsTable = () => {
  const { eventos } = useSelector(state => state.eventoReducer);
  const { user } = useSelector(state => state.authReducer);

  const [editEvento, setEditEvento] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageArray, setPageArray] = useState([]);
  const [isAsc, setIsAsc] = useState(true);
  const [sortBy, setSortBy] = useState('fecha');
  const [filterBy, setFilterBy] = useState('todo');

  const [eventsFiltered, setEventsFiltered] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(eventoGetAllPending());
  }, []);

  useEffect(() => {
    const eventsMap = eventos.map(evento => ({
      ...evento,
      invitados:
        evento.Usuario_Evento.filter(
          usuarioEvento => usuarioEvento.estado === 'invitado'
        ).length || 0,
      confirmados:
        evento.Usuario_Evento.filter(
          usuarioEvento => usuarioEvento.estado === 'confirmado'
        ).length || 0
    }));

    setEventsFiltered(
      eventsMap.filter(evento => {
        if (filterBy !== 'todo') {
          return evento.tipoEvento.nombre === filterBy;
        }
        return true;
      })
    );
  }, [filterBy, eventos]);

  useEffect(() => {
    if (eventos.length > 0) {
      setPageArray(
        eventsFiltered
          .sort((a, b) => {
            if (sortBy === 'fecha') {
              const dateA = dayjs(a[sortBy]);
              const dateB = dayjs(b[sortBy]);

              return isAsc ? dateA.diff(dateB) : dateB.diff(dateA);
            } else {
              return isAsc ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
            }
          })
          .slice((pageIndex - 1) * 10, pageIndex * 10)
      );

      setPageCount(Math.ceil(eventos.length / 10));
    }
  }, [pageIndex, eventos, sortBy, isAsc, eventsFiltered]);

  return eventos?.length ? (
    <>
      <Row className="mt-1 g-3 d-flex justify-content-center justify-content-lg-between">
        <Col xs={12} sm={8} md={6} lg={4} xl={3}>
          <InputGroup size="sm">
            <InputGroup.Text>Tipo de evento:</InputGroup.Text>

            <Form.Select
              className="pe-5"
              defaultValue="todo"
              onChange={({ target }) => setFilterBy(target.value)}
            >
              <option value="todo">Todos</option>
              <option value="Jura">Jura</option>
            </Form.Select>
          </InputGroup>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4} xl={3}>
          <InputGroup size="sm">
            <InputGroup.Text>Ordenar por:</InputGroup.Text>
            <Form.Select
              className="pe-5"
              defaultValue="fecha"
              onChange={({ target }) => setSortBy(target.value)}
            >
              <option value="fecha">Fecha</option>
              <option value="confirmados">Confirmados</option>
              <option value="invitados">Invitados</option>
            </Form.Select>
            <InputGroup.Text
              as={Button}
              variant="secondary"
              onClick={() => setIsAsc(!isAsc)}
            >
              <FontAwesomeIcon
                icon={isAsc ? 'sort-amount-up' : 'sort-amount-down'}
              />
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>

      <hr />

      <Row className="mt-3">
        {pageArray.map((event, index) => {
          const date = dayjs(event.fecha);
          const isOdd = pageArray.length % 2 === 0;

          return (
            <Col key={event.id} md={6} className="h-100">
              <Flex alignItems="center">
                <Link
                  to={`/eventos/${event.id}`}
                  style={{
                    textDecoration: 'none'
                  }}
                >
                  <Calendar
                    month={capitalize(date.format('MMM'))}
                    day={date.format('DD')}
                    year={date.format('YYYY')}
                  />
                </Link>

                <div className="flex-1 position-relative ps-3">
                  <h6 className="fs-0 mb-0">
                    <Link to={`/eventos/${event.id}`}>
                      <span className="me-1">{event.tipoEvento.nombre}</span>
                    </Link>
                  </h6>

                  <p className="text-700 ps-1 m-0">
                    Hora: <strong>{date.format('HH:mm')} hs</strong>
                  </p>

                  <p className="text-700 ps-1 m-0">
                    Invitados:
                    <strong>{event.invitados}</strong>
                  </p>

                  <p className="text-700 ps-1 m-0">
                    Confirmados:
                    <strong>{event.confirmados}</strong>
                  </p>
                </div>

                <div
                  className="d-flex flex-column align-items-end"
                  onClick={e => e.stopPropagation()}
                  style={{ cursor: 'default' }}
                >
                  {checkPermissions(
                    [permisosData.eventos.modificar_eventos],
                    user.empleado
                  ) && (
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={e => {
                        e.stopPropagation();
                        setEditEvento(event);
                      }}
                      disabled={
                        !!event.Usuario_Evento?.filter(
                          ue =>
                            ue.estado !== 'postergado' ||
                            ue.estado !== 'aprobado'
                        ).length
                      }
                    >
                      <FontAwesomeIcon icon="pencil" className="text-primary" />
                    </Button>
                  )}

                  {checkPermissions(
                    [permisosData.eventos.eliminar_eventos],
                    user.empleado
                  ) && (
                    <Button
                      variant="link"
                      className="p-0 mt-1"
                      onClick={e => {
                        e.stopPropagation();
                        setOpenDeleteModal(event);
                      }}
                      disabled={
                        !!event.Usuario_Evento?.filter(
                          ue =>
                            ue.estado !== 'postergado' ||
                            ue.estado !== 'aprobado'
                        ).length
                      }
                    >
                      <FontAwesomeIcon icon="trash" className="text-danger" />
                    </Button>
                  )}
                </div>
              </Flex>

              {(isOdd
                ? !(pageArray.length - 3 < index)
                : !(pageArray.length - 2 < index)) && (
                <div className="border-dashed-bottom my-3"></div>
              )}
            </Col>
          );
        })}
      </Row>

      <hr />

      {eventsFiltered?.length > 10 && (
        <AdvanceTablePagination
          pageIndex={pageIndex}
          pageCount={pageCount}
          limit={10}
          gotoPage={pageIndex => {
            setPageIndex(pageIndex + 1);
          }}
          canNextPage={pageIndex < pageCount}
          canPreviousPage={pageIndex > 1}
          nextPage={() => {
            setPageIndex(pageIndex + 1);
          }}
          previousPage={() => {
            setPageIndex(pageIndex - 1);
          }}
        />
      )}

      <EventModal
        editEvento={editEvento}
        show={!!editEvento}
        setShow={setEditEvento}
      />

      {openDeleteModal && (
        <Modal
          show={openDeleteModal}
          onHide={() => setOpenDeleteModal(false)}
          contentClassName="border"
          centered
        >
          <Modal.Header
            closeButton
            className="bg-light px-card border-bottom-0"
          >
            <h5 className="mb-0">¿Está seguro que desea eliminar el evento?</h5>
          </Modal.Header>
          <Modal.Body className="d-flex justify-content-center">
            <Button
              size="sm"
              variant="success"
              className="me-1"
              onClick={async () => {
                await dispatch(eventoDelete(openDeleteModal.id));
                await dispatch(eventoGetAllPending());
                setOpenDeleteModal(null);
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
      )}
    </>
  ) : (
    <CustomMessage
      ReactIcon={BsCalendarCheck}
      title="Atención!"
      message="En este momento no hay eventos agendados."
    />
  );
};
