import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SimpleBarReact from 'simplebar-react';
import { Table } from 'react-bootstrap';

const AreaTable = ({
  headers,
  page,
  prepareRow,
  headerClassName,
  tableProps,
  setBandeja,
  setShowAreaPartners
}) => {
  const [hover, setHover] = useState(false);

  return (
    <SimpleBarReact>
      <Table {...tableProps}>
        <thead className={headerClassName}>
          <tr>
            {headers.map((column, index) => (
              <th
                key={index}
                {...column.getHeaderProps(
                  column.getSortByToggleProps(column.headerProps)
                )}
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
            ))}
          </tr>
        </thead>
        <tbody>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                key={i}
                {...row.getRowProps()}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(false)}
                style={{
                  backgroundColor: i === hover ? 'var(--falcon-gray-300)' : ''
                }}
              >
                {row.cells.map((cell, index) => {
                  return (
                    <td
                      key={index}
                      {...cell.getCellProps(cell.column.cellProps)}
                      style={{
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setBandeja({
                          id: cell.row.original.usuario.id,
                          nombre: cell.row.original.usuario.nombre,
                          apellido: cell.row.original.usuario.apellido
                        });
                        setShowAreaPartners(false);
                      }}
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
AreaTable.propTypes = {
  getTableProps: PropTypes.func,
  headers: PropTypes.array,
  page: PropTypes.array,
  prepareRow: PropTypes.func,
  headerClassName: PropTypes.string,
  tableProps: PropTypes.object,
  setBandeja: PropTypes.func,
  setShowAreaPartners: PropTypes.func
};

export default AreaTable;
