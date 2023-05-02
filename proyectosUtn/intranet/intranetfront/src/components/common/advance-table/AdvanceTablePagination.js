/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';
import { Button, Form } from 'react-bootstrap';
import Flex from '../Flex';

export const AdvanceTablePagination = ({
  canPreviousPage,
  canNextPage,
  previousPage,
  nextPage,
  pageCount,
  pageIndex,
  gotoPage,
  limit,
  onChangeLimit,
  className
}) => {
  return (
    <Flex alignItems="center" justifyContent="center" className={className}>
      <Button
        size="sm"
        variant="falcon-default"
        onClick={() => previousPage()}
        className={classNames({ disabled: !canPreviousPage })}
      >
        <FontAwesomeIcon icon="chevron-left" />
      </Button>
      <ul className="pagination mb-0 mx-1">
        {Array.from(Array(pageCount).keys()).map((page, index) => (
          <li key={page}>
            <Button
              size="sm"
              variant="falcon-default"
              className={classNames('page', {
                'me-1': index + 1 !== pageCount,
                'bg-primary': pageIndex === page + 1,
                'text-white': pageIndex === page + 1
              })}
              onClick={() => gotoPage(page)}
            >
              {page + 1}
            </Button>
          </li>
        ))}
      </ul>
      <Button
        size="sm"
        variant="falcon-default"
        onClick={() => nextPage()}
        className={classNames({ disabled: !canNextPage })}
      >
        <FontAwesomeIcon icon="chevron-right" />
      </Button>
      {limit && onChangeLimit && (
        <Form.Select
          value={String(limit)}
          onChange={e => onChangeLimit(Number(e.target.value))}
          style={{ position: 'absolute', right: 0, width: 'auto' }}
          className="me-2"
          size="sm"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </Form.Select>
      )}
    </Flex>
  );
};

export default AdvanceTablePagination;
