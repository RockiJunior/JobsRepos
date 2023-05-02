import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import updateLocale from 'dayjs/plugin/updateLocale';
import { months, weekdays } from 'dayjs/locale/es';
import SoftBadge from 'components/common/SoftBadge';
import classNames from 'classnames';
import { useEffect } from 'react';
import { eventosAceptarRechazar, eventosGetAll } from 'redux/actions/eventos';
import Flex from 'components/common/Flex';
import Calendar from 'components/common/Calendar';
import { capitalize } from 'utils/capitalize';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SectionTitle from 'components/common/SectionTitle';
import ConfirmarEvento from './ConfirmarEvento';

dayjs.extend(updateLocale);

dayjs.updateLocale('es', {
  months: months.map(m => m.charAt(0).toUpperCase() + m.slice(1)),
  weekdays: weekdays.map(w => w.charAt(0).toUpperCase() + w.slice(1))
});

const Events = () => {
  const { eventos } = useSelector(state => state.eventoReducer);
  const { user } = useSelector(state => state.authReducer);

  const dispatch = useDispatch();

  const acceptRejectEvent = async (id, estado) => {
    await dispatch(eventosAceptarRechazar(id, estado));
    await dispatch(eventosGetAll());
  };

  const [eventsFiltered, setEventsFiltered] = useState([]);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageArray, setPageArray] = useState([]);
  const [isAsc, setIsAsc] = useState(true);
  const [filterBy, setFilterBy] = useState('todo');

  const [show, setShow] = useState(false);

  useEffect(() => {
    user && dispatch(eventosGetAll());
  }, [user]);

  useEffect(() => {
    setEventsFiltered(
      eventos.filter(evento => {
        if (filterBy !== 'todo') {
          return evento.estado === filterBy;
        }
        return true;
      })
    );
  }, [filterBy, eventos]);

  useEffect(() => {
    if (eventos.length > 0) {
      const sortBy = 'fecha';

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

      setPageCount(Math.ceil(eventsFiltered.length / 10));
    }
  }, [pageIndex, eventos, isAsc, eventsFiltered]);

  return (
    <>
      <SectionTitle
        icon="stamp"
        title="Eventos"
        transform="shrink-2"
        className="pb-2"
      />

      <Card className="bg-white">
        <Card.Body className="pt-0">
          <Row className="mt-1 g-3 d-flex justify-content-center justify-content-lg-between">
            <Col xs={12} sm={8} md={6} lg={4} xl={3}>
              <InputGroup size="sm">
                <InputGroup.Text>Estado:</InputGroup.Text>

                <Form.Select
                  className="pe-5"
                  defaultValue="invitado"
                  onChange={({ target }) => setFilterBy(target.value)}
                >
                  <option value="todo">Todos</option>
                  <option value="invitado">Invitado</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="postergado">Postergado</option>
                  <option value="aprobado">Aprobado</option>
                </Form.Select>
              </InputGroup>
            </Col>

            <Col xs={12} sm={8} md={6} lg={4} xl={3}>
              <InputGroup size="sm" className="d-flex justify-content-end">
                <InputGroup.Text>Ordenar por fecha</InputGroup.Text>
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
          <Row>
            {eventsFiltered?.length ? (
              pageArray.map((event, index) => {
                const date = dayjs(event.fecha);
                const isOdd = pageArray.length % 2 === 0;

                return (
                  <Col
                    key={event.id}
                    lg={6}
                    className="d-flex flex-column justify-content-between"
                  >
                    <div>
                      <Flex alignItems="center">
                        <Calendar
                          month={capitalize(date.format('MMM'))}
                          day={date.format('DD')}
                          year={date.format('YYYY')}
                        />

                        <div className="flex-1 position-relative ps-3">
                          <h6 className="fs-0 mb-0">
                            <span className="me-1">{event.nombre}</span>
                          </h6>

                          {/* <p className="text-700 ps-1">
                    {event.tipoEvento.descripcion}
                  </p> */}

                          <p className="text-700 ps-1 m-0">
                            Hora: <strong>{date.format('HH:mm')} hs</strong>
                          </p>
                        </div>

                        <SoftBadge
                          className={classNames(
                            'mt-2',
                            event.estado === 'invitado' &&
                              'bg-primary text-white',
                            event.estado === 'confirmado' && 'bg-success',
                            event.estado === 'postergado' && 'bg-warning'
                          )}
                        >
                          {event.estado[0].toUpperCase() +
                            event.estado.slice(1)}
                        </SoftBadge>
                      </Flex>

                      {event.estado === 'invitado' && (
                        <>
                          <hr className="m-0 mt-2" />
                          <div className="d-flex justify-content-between align-items-center p-2">
                            <Button
                              size="sm"
                              variant="danger"
                              className="me-2"
                              onClick={() =>
                                acceptRejectEvent(event.id, 'postergado')
                              }
                            >
                              Esperar al próximo evento
                            </Button>

                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => setShow(event.id)}
                            >
                              Confirmar Asistencia
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                    {(isOdd
                      ? !(eventos.length - 3 < index)
                      : !(eventos.length - 2 < index)) && (
                      <div className="border-dashed-bottom my-3"></div>
                    )}
                  </Col>
                );
              })
            ) : (
              <h5>No tenés eventos</h5>
            )}

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
          </Row>
        </Card.Body>
      </Card>

      <ConfirmarEvento show={show} setShow={setShow} />
    </>
  );
};

export default Events;
