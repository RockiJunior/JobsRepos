import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SimpleBarReact from 'simplebar-react';
import { Col, ListGroup, Row, Table } from 'react-bootstrap';

const AdvanceTable = ({
  getTableProps,
  headers,
  page,
  prepareRow,
  headerClassName,
  rowClassName,
  tableProps,
  rowOnClick,
  noResponsive,
  noPadding
}) => {
  const [hover, setHover] = useState(false);

  return (
    <SimpleBarReact>
      <Table
        {...getTableProps(tableProps)}
        className={!noResponsive && 'd-none d-lg-table'}
      >
        <thead className={headerClassName}>
          <tr>
            {headers.map((column, index) => {
              return (
                <th
                  key={index}
                  {...column.getHeaderProps(
                    column.getSortByToggleProps(column.headerProps)
                  )}
                  className={
                    (noPadding ? 'py-2 ' : '') +
                    (column.headerProps?.className || '')
                  }
                >
                  {column.render('Header')}
                  {column.canSort ? (
                    column.isSorted ? (
                      column.isSortedDesc ? (
                        <span className="sort desc" />
                      ) : (
                        <span className="sort asc" />
                      )
                    ) : (
                      <span className="sort" />
                    )
                  ) : (
                    ''
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                key={i}
                className={rowClassName}
                {...row.getRowProps()}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(false)}
                style={{
                  backgroundColor: i === hover ? 'var(--falcon-gray-300)' : '',
                  cursor: rowOnClick ? 'pointer' : 'default'
                }}
                onClick={() => rowOnClick && rowOnClick(row.original)}
              >
                {row.cells.map((cell, index) => {
                  const { className, ...props } = cell.getCellProps(
                    cell.column.cellProps
                  );
                  return (
                    <td
                      key={index}
                      {...props}
                      className={(noPadding ? 'py-2 ' : '') + (className || '')}
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
      {!noResponsive && (
        <ListGroup
          {...getTableProps(tableProps)}
          className="d-lg-none px-3 pb-3"
        >
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <ListGroup.Item
                key={i}
                className={rowClassName}
                {...row.getRowProps()}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(false)}
                style={{
                  backgroundColor: i === hover ? 'var(--falcon-gray-300)' : '',
                  cursor: rowOnClick ? 'pointer' : 'default',
                  width: '100%'
                }}
                onClick={() => rowOnClick && rowOnClick(row.original)}
              >
                <Row>
                  {row.cells.map((cell, index) => {
                    const { Header } = cell.column;
                    const { render } = cell;

                    return Header ? (
                      <Col key={index} xs={12}>
                        <span className="font-weight-bold">
                          {Header}: <strong>{render('Cell')}</strong>
                        </span>
                      </Col>
                    ) : null;
                  })}
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
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
  tableProps: PropTypes.object,
  rowOnClick: PropTypes.func,
  noResponsive: PropTypes.bool,
  noPadding: PropTypes.bool
};

export default AdvanceTable;
