/* eslint-disable prettier/prettier */
import React from 'react';
import PropTypes from 'prop-types';
import SimpleBarReact from 'simplebar-react';
import { Table } from 'react-bootstrap';

const AdvanceTable = ({
  getTableProps,
  headers,
  page,
  prepareRow,
  headerClassName,
  rowBackground,
  rowClassName,
  tableProps
}) => {
  return (
    <SimpleBarReact>
      <Table {...getTableProps(tableProps)}>
        <thead className={headerClassName}>
          <tr>
            {headers.map((column, index) => {
              return (
                <th
                  key={index}
                  title={column.Header}
                  {...column.getHeaderProps(
                    column.getSortByToggleProps(column.headerProps)
                  )}
                >
                  {column.render('Header')}
                  {column.canSort && column.Header !== 'Acciones' ? (
                    column.isSorted ? (
                      column.isSortedDesc ? (
                        <span title={column.headerProps.title} className="sort desc" />
                      ) : (
                        <span title={column.headerProps.title} className="sort asc" />
                      )
                    ) : (
                      <span title={column.headerProps.title} className="sort" />
                    )
                  ) : (
                    ''
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {page.map((row, i) => {
            prepareRow(row);
            return (
                <tr key={i} className={rowClassName} style={{ backgroundColor: `${rowBackground}` }} {...row.getRowProps()}>
                  {row.cells.map((cell, index) => {
                    return (
                        <td
                          key={index}
                          {...cell.getCellProps(cell.column.cellProps)}
                        >
                          {cell.render('Cell')}
                        </td>
                    );
                  })}
                </tr>
            );
          })}
        </tbody>
      </Table>
    </SimpleBarReact>
  );
};
AdvanceTable.propTypes = {
  getTableProps: PropTypes.func,
  headers: PropTypes.array,
  page: PropTypes.array,
  prepareRow: PropTypes.func,
  headerClassName: PropTypes.string,
  rowClassName: PropTypes.string,
  tableProps: PropTypes.object
};

export default AdvanceTable;