/* eslint-disable react/prop-types */
import React, { useEffect, useMemo } from 'react';
import { Form } from 'react-bootstrap';
import {
  useTable,
  useSortBy,
  usePagination,
  useRowSelect,
  useGlobalFilter
} from 'react-table';

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();

    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <Form.Check
        type="checkbox"
        className="form-check fs-0 mb-0 d-flex align-items-center"
      >
        <Form.Check.Input type="checkbox" ref={resolvedRef} {...rest} />
      </Form.Check>
    );
  }
);

const AdvanceTableWrapper = ({
  children,
  columns,
  data,
  sortable,
  manualSortBy,
  onChangeSort,
  selection,
  selectionColumnWidth,
  pagination,
  perPage = 10
}) => {
  const {
    getTableProps,
    headers,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize,
    gotoPage,
    pageCount,
    state: { pageIndex, pageSize, selectedRowIds, globalFilter, sortBy },
    setGlobalFilter
  } = useTable(
    {
      columns,
      data,
      disableSortBy: !sortable,
      initialState: {
        pageSize: pagination ? perPage : data.length
      },
      manualSortBy
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    hooks => {
      if (selection) {
        hooks.visibleColumns.push(columns => [
          {
            id: 'selection',
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            ),
            headerProps: {
              style: {
                maxWidth: selectionColumnWidth
              }
            },
            cellProps: {
              style: {
                maxWidth: selectionColumnWidth
              }
            },
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            )
          },
          ...columns
        ]);
      }
    }
  );

  useEffect(() => {
    onChangeSort && sortBy && onChangeSort(sortBy);
  }, [sortBy]);

  useEffect(() => {
    setPageSize(perPage);
  }, [perPage]);

  const recursiveMap = useMemo(() => {
    return children => {
      return React.Children.map(children, child => {
        if (child.props?.children) {
          return React.cloneElement(child, {
            children: recursiveMap(child.props.children)
          });
        } else {
          if (child.props?.table) {
            return React.cloneElement(child, {
              ...child.props,
              getTableProps,
              headers,
              page,
              prepareRow,
              canPreviousPage,
              canNextPage,
              nextPage,
              previousPage,
              gotoPage,
              pageCount,
              pageIndex,
              selectedRowIds,
              pageSize,
              setPageSize,
              globalFilter,
              setGlobalFilter
            });
          } else {
            return child;
          }
        }
      });
    };
  }, [perPage, data, pageIndex, pageSize, selectedRowIds, globalFilter]);

  return <>{recursiveMap(children)}</>;
};

export default AdvanceTableWrapper;
