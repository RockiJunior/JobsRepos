import React from "react";
import ReactPaginate from "react-paginate";
import Filters from "./Filters";
import List from "./List";

const Pagination = ({ data, fetchData, isLoading }) => {
  const filteredData = data.filter(
    (prop) => prop.property?.status === "published"
  );
  return (
    <>
      {filteredData.length > 0 ? (
        <>
          {/* <Filters /> */}
          <List data={filteredData} fetchData={fetchData} />
          {/* <ReactPaginate
            breakLabel="..."
            nextLabel="Siguiente >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={10}
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
      ) : (
        <div className="w-100 text-center">
          <h2>No tenés ninguna propiedad guardada</h2>
        </div>
      )}
    </>
  );
};

export default Pagination;
