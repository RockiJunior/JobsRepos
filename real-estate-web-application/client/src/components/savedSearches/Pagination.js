import React from "react";
import ReactPaginate from "react-paginate";
import List from "./List";
import Filters from "./Filters";

const Pagination = ({ data, fetchData, isLoading }) => {
  return (
    <>
      {data.length > 0 && !isLoading && (
        <>
          {/* <Filters /> */}
          <List data={data} fetchData={fetchData} />
          {/* <ReactPaginate
            breakLabel="..."
            nextLabel="Siguiente >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={1}
            previousLabel="< Anterior"
            renderOnZeroPageCount={null}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
          /> */}
        </>
      )}
    </>
  );
};

export default Pagination;
