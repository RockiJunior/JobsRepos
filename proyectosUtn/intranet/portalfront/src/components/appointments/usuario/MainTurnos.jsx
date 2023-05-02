import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import Calendar from 'components/common/Calendar';
import { CustomCard } from 'components/common/CustomCard';
import Flex from 'components/common/Flex';
import SoftBadge from 'components/common/SoftBadge';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { capitalize } from 'utils/capitalize';

const stateNames = {
  pending: 'Pendiente',
  rejected: 'Rechazado',
  approved: 'Aprobado'
};

const MainTurnos = () => {
  const { user } = useSelector(state => state.authReducer);

  const [turnosFiltered, setTurnosFiltered] = useState([]);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageArray, setPageArray] = useState([]);
  const [isAsc, setIsAsc] = useState(true);
  const [filterBy, setFilterBy] = useState('todo');

  useEffect(() => {
    setTurnosFiltered(
      user.turnos.filter(turno => {
        if (filterBy !== 'todo') {
          return turno.estado === filterBy;
        }
        return true;
      })
    );
  }, [filterBy, user.turnos]);

  useEffect(() => {
    if (user.turnos.length > 0) {
      const sortBy = 'inicio';

      setPageArray(
        turnosFiltered
          .sort((a, b) => {
            if (sortBy === 'inicio') {
              const dateA = dayjs(a[sortBy]);
              const dateB = dayjs(b[sortBy]);

              return isAsc ? dateA.diff(dateB) : dateB.diff(dateA);
            } else {
              return isAsc ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
            }
          })
          .slice((pageIndex - 1) * 10, pageIndex * 10)
      );

      setPageCount(Math.ceil(turnosFiltered.length / 10));
    }
  }, [pageIndex, user.turnos, isAsc, turnosFiltered]);

  return (
    <CustomCard title="Mis Turnos" icon="calendar-alt">
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
                <option value="pending">Pendiente</option>
                <option value="rejected">Reprogramado</option>
                <option value="approved">Finalizado</option>
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
          {turnosFiltered?.length ? (
            pageArray.map((turno, index) => {
              const date = dayjs(turno.inicio);
              const isOdd = pageArray.length % 2 === 0;

              return (
                <Col
                  key={turno.id}
                  lg={6}
                  className="d-flex flex-column justify-content-between pb-3"
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
                          <span className="me-1">
                            Área: {turno?.area?.nombre}
                          </span>
                        </h6>

                        <p className="text-700 m-0">
                          Hora: <strong>{date.format('HH:mm')} hs</strong>
                        </p>
                      </div>

                      <SoftBadge
                        className={classNames(
                          'mt-2',
                          turno.estado === 'approved' && 'bg-success',
                          turno.estado === 'rejected' && 'bg-warning'
                        )}
                      >
                        {stateNames[turno.estado]}
                      </SoftBadge>
                    </Flex>
                  </div>
                  {(isOdd
                    ? !(user.turnos.length - 3 < index)
                    : !(user.turnos.length - 2 < index)) && (
                    <div className="border-dashed-bottom my-3"></div>
                  )}
                </Col>
              );
            })
          ) : (
            <h5 className="text-center mb-3">No tenés turnos</h5>
          )}

          <hr />

          {turnosFiltered?.length > 10 && (
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
    </CustomCard>
  );
};

export default MainTurnos;
