import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import React, { useEffect } from 'react';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usersGetMatriculados } from 'redux/actions/users';

const NroMatricula = ({ row }) => {
  return (
    <span>
      {row.original.matricula?.find(matricula => matricula.estado === 'activo')
        ?.id || 'Sin matricula'}
    </span>
  );
};

NroMatricula.propTypes = {
  row: PropTypes.object
};

const columns = [
  {
    accessor: 'id',
    Header: '',
    disableSortBy: true,
    Cell: () => <Form.Check type="radio" name="radio" className="me-3" />
  },
  {
    accessor: 'nombre',
    Header: 'Nombre'
  },
  {
    accessor: 'apellido',
    Header: 'Apellido'
  },
  {
    accessor: 'dni',
    Header: 'DNI'
  },
  {
    accessor: 'email',
    Header: 'Email'
  },
  {
    accessor: 'nroMatricula',
    Header: 'Nro Matricula',
    Cell: NroMatricula,
    disableSortBy: true
  }
];

const WizardMatriculados = ({ setUser }) => {
  const { matriculados } = useSelector(state => state.usersReducer);
  const [search, setSearch] = useState('');
  const [flagSearch, setFlagSearch] = useState(false);
  const [limit, setLimit] = useState(10);

  const dispatch = useDispatch();

  useEffect(() => {
    setLimit(matriculados.limite);
  }, [matriculados.limite]);

  return (
    <Col>
      <Row>
        <Col xs={12}>
          <AdvanceTableWrapper
            columns={columns}
            data={matriculados.usuarios || []}
            perPage={limit}
            sortable
            manualSortBy
            onChangeSort={sortBy => {
              const {
                // eslint-disable-next-line no-unused-vars
                usuarios: u,
                // eslint-disable-next-line no-unused-vars
                paginasTotales,
                // eslint-disable-next-line no-unused-vars
                count,
                ...queries
              } = matriculados;
              if (sortBy.length) {
                dispatch(
                  usersGetMatriculados({
                    ...queries,
                    pagina: 1,
                    columna: sortBy[0].id,
                    orden: sortBy[0].desc ? 'desc' : 'asc'
                  })
                );
              } else {
                dispatch(
                  usersGetMatriculados({
                    ...queries,
                    pagina: 1,
                    columna: 'id',
                    orden: 'asc'
                  })
                );
              }
            }}
            pagination
          >
            <div className="d-flex justify-content-center pb-3">
              <InputGroup size="sm" style={{ width: 'auto' }}>
                <Form.Control
                  type="text"
                  placeholder="Buscar..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  disabled={flagSearch}
                />

                <InputGroup.Text className="p-0" style={{ overflow: 'hidden' }}>
                  {flagSearch ? (
                    <Button
                      size="sm"
                      className="rounded-0"
                      variant="danger"
                      onClick={() => {
                        const {
                          // eslint-disable-next-line no-unused-vars
                          usuarios: u,
                          // eslint-disable-next-line no-unused-vars
                          paginasTotales,
                          // eslint-disable-next-line no-unused-vars
                          count,
                          ...queries
                        } = matriculados;

                        dispatch(
                          usersGetMatriculados({
                            ...queries,
                            pagina: 1,
                            busqueda: ''
                          })
                        );

                        setFlagSearch(false);
                        setSearch('');
                      }}
                    >
                      <FontAwesomeIcon icon="circle-xmark" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="rounded-0"
                      onClick={() => {
                        const {
                          // eslint-disable-next-line no-unused-vars
                          usuarios: u,
                          // eslint-disable-next-line no-unused-vars
                          paginasTotales,
                          // eslint-disable-next-line no-unused-vars
                          count,
                          ...queries
                        } = matriculados;

                        dispatch(
                          usersGetMatriculados({
                            ...queries,
                            pagina: 1,
                            busqueda: search
                          })
                        );

                        setFlagSearch(true);
                      }}
                    >
                      <FontAwesomeIcon icon="search" />
                    </Button>
                  )}
                </InputGroup.Text>
              </InputGroup>
            </div>

            {matriculados.usuarios?.length ? (
              <AdvanceTable
                table
                headerClassName="bg-white text-900 text-nowrap align-middle"
                rowClassName="align-middle white-space-nowrap"
                tableProps={{
                  className: 'fs--1 mb-0 overflow-hidden'
                }}
                rowOnClick={row => setUser(row)}
                noPadding
              />
            ) : (
              <Card.Title className="text-center py-3">
                No se encontraron matriculados
              </Card.Title>
            )}

            {!!matriculados.usuarios?.length &&
            matriculados.paginasTotales > 1 ? (
              <AdvanceTablePagination
                canPreviousPage={matriculados.pagina !== 1}
                canNextPage={
                  matriculados.pagina !== matriculados.paginasTotales
                }
                pageCount={matriculados.paginasTotales}
                pageIndex={matriculados.pagina}
                limit={matriculados.limite}
                onChangeLimit={limit => {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    usuarios: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    ...queries
                  } = matriculados;

                  dispatch(
                    usersGetMatriculados({
                      ...queries,
                      pagina: 1,
                      limite: limit
                    })
                  );
                }}
                nextPage={() => {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    usuarios: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    pagina,
                    ...queries
                  } = matriculados;

                  dispatch(
                    usersGetMatriculados({
                      ...queries,
                      pagina: pagina + 1
                    })
                  );
                }}
                previousPage={() => {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    usuarios: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    pagina,
                    ...queries
                  } = matriculados;

                  dispatch(
                    usersGetMatriculados({
                      ...queries,
                      pagina: pagina - 1
                    })
                  );
                }}
                gotoPage={value => {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    usuarios: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    // eslint-disable-next-line no-unused-vars
                    pagina,
                    ...queries
                  } = matriculados;

                  dispatch(
                    usersGetMatriculados({
                      ...queries,
                      pagina: value + 1
                    })
                  );
                }}
              />
            ) : (
              <div />
            )}
          </AdvanceTableWrapper>
        </Col>
      </Row>
    </Col>
  );
};

WizardMatriculados.propTypes = {
  setUser: PropTypes.func,
  tramite: PropTypes.object
};

export default WizardMatriculados;
