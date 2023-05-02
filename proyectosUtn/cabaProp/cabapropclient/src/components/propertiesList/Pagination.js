import ReactPaginate from "react-paginate";
import List from "./List";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Pagination = ({
  setQueries,
  queries,
  isLoadingProps,
  HandleOverflow,
}) => {
  const [data, setData] = useState();
  const [totalPages, setTotalPages] = useState();
  const dataState = useSelector((state) => state.properties.properties);

  useEffect(() => {
    dataState && setData(dataState);
    console.log("DATA: ", dataState);
  }, [dataState]);

  useEffect(() => {
    if (data)
      setTotalPages(
        Math.ceil(
          data.allPropertiesLength /
            Number(process.env.REACT_APP_PROPERTIES_LIMIT)
        )
      );
  }, [data]);

  const handlePageClick = (page) => setQueries({ page: page.selected + 1 });

  return (
    <>
      {data && data.allPropertiesLength === 0 && (
        <>
          <div className="no-results-found" />
          <div className="w-100 text-center">
            <h2>No existen propiedades con esas características</h2>
          </div>
        </>
      )}
      {data && totalPages > 0 && (
        <>
          <List data={data} isLoadingProps={isLoadingProps} />
          <button
            className="btn btn-primary my-4 filters-button"
            onClick={() => HandleOverflow()}
          >
            Mostrar filtros
          </button>
          <ReactPaginate
            breakLabel="..."
            previousLabel="< Anterior"
            nextLabel="Siguiente >"
            onPageChange={handlePageClick}
            pageCount={totalPages}
            renderOnZeroPageCount={null}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
            forcePage={queries}
            pageRangeDisplayed={4}
            marginPagesDisplayed={2}
          />
        </>
      )}
    </>
  );
};

export default Pagination;
