import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Dropdown, Form, InputGroup } from 'react-bootstrap';
import SoftBadge from 'components/common/SoftBadge';
import classNames from 'classnames';
import CustomMessage from 'components/varios/messages/CustomMessage';
import { FaSearch } from 'react-icons/fa';

const SimpleTable = ({ columns, data, rowOnClick, estados }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [pageArray, setPageArray] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState([]);

  useEffect(() => {
    setPageCount(Math.ceil(data.length / 10));
  }, [data]);

  useEffect(() => {
    if (filter || search) {
      const [filterKey, filterValue] = filter?.split(':');
      const filtered = data.filter(item => {
        if (filterKey && filterValue) {
          if (item[filterKey] !== filterValue) {
            return false;
          }
        }
        if (search) {
          const searchValues = Object.values(item).join(' ').toLowerCase();
          if (!searchValues.includes(search.toLowerCase())) {
            return false;
          }
        }
        return true;
      });

      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [data, filter, search]);

  useEffect(() => {
    setPageArray(
      filteredData
        .sort((a, b) => {
          if (sort.desc) {
            return a[sort.key] > b[sort.key] ? -1 : 1;
          } else {
            return a[sort.key] < b[sort.key] ? -1 : 1;
          }
        })
        .slice((pageIndex - 1) * 10, pageIndex * 10)
    );
  }, [pageIndex, filteredData, sort]);

  const handleSort = info => {
    if (info.length) {
      const { id, desc } = info[0];

      setSort({ key: id, desc });
    } else {
      setSort({});
    }
  };

  return (
    <>
      <Card.Body className="d-flex justify-content-center">
        <InputGroup size="sm" style={{ width: 'auto' }}>
          <Form.Control
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </InputGroup>
        <Dropdown style={{ position: 'absolute', right: 0 }} className="me-2">
          <Dropdown.Toggle
            variant="transparent"
            style={{ boxShadow: 'none', border: 'none' }}
            className="p-0"
          >
            <SoftBadge
              bg={classNames({
                dark: !filter,
                primary:
                  filter &&
                  (filter.split(':')[1] === 'pendiente' ||
                    filter.split(':')[1] === 'fisica'),
                info:
                  filter &&
                  (filter.split(':')[1] === 'archivado' ||
                    filter.split(':')[1] === 'enviada'),
                danger:
                  filter &&
                  (filter.split(':')[1] === 'rechazado' ||
                    filter.split(':')[1] === 'rechazada'),
                warning:
                  filter &&
                  (filter.split(':')[1] === 'cancelado' ||
                    filter.split(':')[1] === 'solicitud modificación'),
                success: filter && filter.split(':')[1] !== 'archivado'
              })}
              className="fs-0"
            >
              {filter
                ? estados.find(e => e.value === filter.split(':')[1]).label
                : 'Todos'}
            </SoftBadge>
          </Dropdown.Toggle>
          <Dropdown.Menu className="bg-light p-0">
            {estados.map(estado => (
              <Dropdown.Item
                key={estado.value}
                className="p-1"
                onClick={() => setFilter(`estado:${estado.value}`)}
              >
                <SoftBadge
                  bg={classNames({
                    info:
                      estado.value === 'archivado' ||
                      estado.value === 'enviada',
                    danger:
                      estado.value === 'rechazado' ||
                      estado.value === 'rechazada',
                    warning:
                      estado.value === 'cancelado' ||
                      estado.value === 'solicitud modificación',
                    primary:
                      estado.value === 'pendiente' || estado.value === 'fisica',
                    success:
                      estado.value !== 'archivado' &&
                      estado.value !== 'rechazado' &&
                      estado.value !== 'cancelado' &&
                      estado.value !== 'pendiente' &&
                      estado.value !== 'fisica'
                  })}
                  className="fs--1 w-100"
                >
                  {estado.label}
                </SoftBadge>
              </Dropdown.Item>
            ))}

            <Dropdown.Item className="p-1" onClick={() => setFilter(null)}>
              <SoftBadge bg="dark" className="fs--1 w-100">
                Todos
              </SoftBadge>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Card.Body>

      {pageArray.length ? (
        <AdvanceTableWrapper
          columns={columns}
          data={pageArray}
          pagination
          perPage={10}
          sortable
          manualSortBy
          onChangeSort={handleSort}
        >
          <AdvanceTable
            table
            headerClassName="text-start"
            rowClassName="text-start fw-bold"
            noResponsive
            rowOnClick={rowOnClick}
          />

          {pageCount > 1 ? (
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
          ) : (
            <div />
          )}
        </AdvanceTableWrapper>
      ) : (
        <CustomMessage
          ReactIcon={FaSearch}
          title="No se encontraron resultados"
          message="No se encontraron resultados para la búsqueda realizada"
        />
      )}
    </>
  );
};

SimpleTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  rowOnClick: PropTypes.func,
  estados: PropTypes.array
};

export default SimpleTable;
