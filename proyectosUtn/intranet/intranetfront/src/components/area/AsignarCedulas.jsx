import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import React, { useEffect } from 'react';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getPartners } from 'redux/actions/area';

import PropTypes from 'prop-types';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import { cedulaSinAsignar } from 'redux/actions/cedula';
import AsignarCedulaModal from './components/AsignarCedulaModal';
import { CustomCard } from 'components/common/CustomCard';
import CustomMessage from 'components/varios/messages/CustomMessage';
import { FaRegFileAlt } from 'react-icons/fa';

const AssignButton = ({
  handleClick,
  row: {
    original: { id }
  }
}) => (
  <Button size="sm" onClick={() => handleClick(id)}>
    Asignar responsable
  </Button>
);

AssignButton.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.number.isRequired
    })
  }),
  handleClick: PropTypes.func.isRequired
};

const AsignarCedulas = () => {
  const { cedulasSinAsignar } = useSelector(state => state.cedulaReducer);
  const { partners } = useSelector(state => state.areaReducer);

  const dispatch = useDispatch();

  const [cedulaId, setCedulaId] = useState(null);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [flagSearch, setFlagSearch] = useState(false);

  useEffect(() => {
    dispatch(cedulaSinAsignar());
    dispatch(getPartners());
  }, []);

  const handleClick = id => {
    setCedulaId(id);
  };

  const columns = [
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
      accessor: 'telefono',
      Header: 'Telefono',
      disableSortBy: true
    },
    {
      accessor: 'domicilio',
      Header: 'Domicilio',
      disableSortBy: true
    },
    {
      accessor: 'createdAt',
      Header: 'Fecha de creación',
      Cell: ({ value }) => {
        return new Date(value).toLocaleDateString();
      }
    },
    {
      accessor: 'action',
      Header: 'Acciones',
      Cell: props => <AssignButton {...props} handleClick={handleClick} />,
      disableSortBy: true
    }
  ];

  useEffect(() => {
    setLimit(cedulasSinAsignar.limite);
  }, [cedulasSinAsignar.limite]);

  return (
    <CustomCard icon="file-alt" title="Asignar cedulas">
      {!!cedulasSinAsignar.cedulas?.length && (
        <>
          <Card.Body className="d-flex justify-content-center pb-0">
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
                        cedulas: u,
                        // eslint-disable-next-line no-unused-vars
                        paginasTotales,
                        // eslint-disable-next-line no-unused-vars
                        count,
                        ...queries
                      } = cedulasSinAsignar;

                      dispatch(
                        cedulaSinAsignar({
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
                        cedulas: u,
                        // eslint-disable-next-line no-unused-vars
                        paginasTotales,
                        // eslint-disable-next-line no-unused-vars
                        count,
                        ...queries
                      } = cedulasSinAsignar;

                      dispatch(
                        cedulaSinAsignar({
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
          </Card.Body>
          <Card.Body>
            <AdvanceTableWrapper
              columns={columns}
              data={cedulasSinAsignar.cedulas || []}
              perPage={limit}
              sortable
              manualSortBy
              onChangeSort={sortBy => {
                const {
                  // eslint-disable-next-line no-unused-vars
                  cedulas: u,
                  // eslint-disable-next-line no-unused-vars
                  paginasTotales,
                  // eslint-disable-next-line no-unused-vars
                  count,
                  ...queries
                } = cedulasSinAsignar;
                if (sortBy.length) {
                  dispatch(
                    cedulaSinAsignar({
                      ...queries,
                      pagina: 1,
                      columna: sortBy[0].id,
                      orden: sortBy[0].desc ? 'desc' : 'asc'
                    })
                  );
                } else {
                  dispatch(
                    cedulaSinAsignar({
                      ...queries,
                      pagina: 1,
                      columna: 'createdAt',
                      orden: 'desc'
                    })
                  );
                }
              }}
              pagination
            >
              <AdvanceTable
                table
                headerClassName="bg-white text-900 text-nowrap align-middle"
                rowClassName="align-middle white-space-nowrap"
                tableProps={{
                  className: 'fs--1 mb-0 overflow-hidden bg-light'
                }}
              />
              <AdvanceTablePagination
                className="mt-4"
                canPreviousPage={cedulasSinAsignar.pagina !== 1}
                canNextPage={
                  cedulasSinAsignar.pagina !== cedulasSinAsignar.paginasTotales
                }
                pageCount={cedulasSinAsignar.paginasTotales}
                pageIndex={cedulasSinAsignar.pagina}
                limit={limit}
                onChangeLimit={limit => {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    cedulas: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    ...queries
                  } = cedulasSinAsignar;

                  dispatch(
                    cedulaSinAsignar({
                      ...queries,
                      pagina: 1,
                      limite: limit
                    })
                  );
                }}
                nextPage={() => {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    cedulas: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    pagina,
                    ...queries
                  } = cedulasSinAsignar;

                  dispatch(
                    cedulaSinAsignar({
                      ...queries,
                      pagina: pagina + 1
                    })
                  );
                }}
                previousPage={() => {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    cedulas: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    pagina,
                    ...queries
                  } = cedulasSinAsignar;

                  dispatch(
                    cedulaSinAsignar({
                      ...queries,
                      pagina: pagina - 1
                    })
                  );
                }}
                gotoPage={value => {
                  const {
                    // eslint-disable-next-line no-unused-vars
                    cedulas: u,
                    // eslint-disable-next-line no-unused-vars
                    paginasTotales,
                    // eslint-disable-next-line no-unused-vars
                    count,
                    // eslint-disable-next-line no-unused-vars
                    pagina,
                    ...queries
                  } = cedulasSinAsignar;

                  dispatch(
                    cedulaSinAsignar({
                      ...queries,
                      pagina: value + 1
                    })
                  );
                }}
              />
            </AdvanceTableWrapper>
          </Card.Body>
        </>
      )}
      {!cedulasSinAsignar.cedulas?.length && (
        <CustomMessage
          ReactIcon={FaRegFileAlt}
          title="Atención!"
          message="No hay cédulas sin asignar."
        />
      )}
      {partners && (
        <AsignarCedulaModal
          cedulaId={cedulaId}
          partners={partners}
          setCedulaId={setCedulaId}
        />
      )}
    </CustomCard>
  );
};

export default AsignarCedulas;
