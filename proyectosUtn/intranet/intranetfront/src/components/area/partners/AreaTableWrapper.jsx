/* eslint-disable react/prop-types */
import React from 'react';
import {
  useTable,
  useSortBy,
  usePagination,
  useRowSelect,
  useGlobalFilter
} from 'react-table';

const AreaTableWrapper = ({
  children,
  columns,
  data,
  sortable,
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
    state: { pageIndex, pageSize, selectedRowIds, globalFilter },
    setGlobalFilter
  } = useTable(
    {
      columns,
      data,
      disableSortBy: !sortable,
      initialState: { pageSize: pagination ? perPage : data.length }
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );

  const recursiveMap = children => {
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

  return <>{recursiveMap(children)}</>;
};

export default AreaTableWrapper;
