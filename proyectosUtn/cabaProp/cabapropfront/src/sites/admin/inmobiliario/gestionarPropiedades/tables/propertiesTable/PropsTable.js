import React from 'react';
import { Table } from 'react-bootstrap';

const PropsTable = ({ data, columns, filtersAndSort, setFiltersAndSort }) => {
  return (
    <Table
      className="fs--1 mb-0 overflow-hidden border-light table table-striped table-bordered bg-white rounded-3"
      responsive
      striped
    >
      <thead className="bg-primary text-white text-nowrap align-middle border-light">
        <tr key={'head_tr'}>
          {columns &&
            columns.map(col => {
              return (
                <th
                  key={col.accessor}
                  role="columnheader"
                  colSpan="1"
                  scope="col"
                  title={col.headerProps.title}
                >
                  {col.Header}
                  {col.canSort && (
                    <span
                      key={`span_${col.accesor}`}
                      onClick={() =>
                        setFiltersAndSort({
                          ...filtersAndSort,
                          sortBy: {
                            order:
                              filtersAndSort.sortBy.prop === col.accessor
                                ? filtersAndSort.sortBy.order === 'asc'
                                  ? 'desc'
                                  : 'asc'
                                : 'asc',
                            prop: col.accessor
                          }
                        })
                      }
                      className={
                        filtersAndSort.sortBy.prop === col.accessor
                          ? filtersAndSort.sortBy.order === 'asc'
                            ? 'sort asc'
                            : 'sort desc'
                          : 'sort'
                      }
                      style={{ cursor: col.canSort ? 'pointer' : 'default' }}
                    />
                  )}
                </th>
              );
            })}
        </tr>
      </thead>
      <tbody>
        {data &&
          data.map(row => {
            return (
              <tr key={`tr_${row.id}`} className="align-middle">
                {columns &&
                  columns.map((col, i) => (
                    <td
                      key={`${col.accessor}_${row.id}`}
                      className="text-black"
                      scope={i === 0 ? 'row' : null}
                    >
                      {row[col.accessor]}
                    </td>
                  ))}
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
};

export default PropsTable;
