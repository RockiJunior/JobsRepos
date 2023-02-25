import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import List from "./List";

const Pagination = ({
  itemsPerPage,
  data,
  queries,
  setQueries,
  fetchData,
  userLogged,
  favorite,
  location
}) => {
  const navigate = useNavigate();
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  // const pageCount = Number.isInteger(totalPages)
  const totalPages = Number.isInteger(
    data.allPropertiesLength / Number(process.env.REACT_APP_PROPERTIES_LIMIT)
  )
    ? data.allPropertiesLength / Number(process.env.REACT_APP_PROPERTIES_LIMIT)
    : Math.floor(data.allPropertiesLength / Number(process.env.REACT_APP_PROPERTIES_LIMIT)) + 1;

  useEffect(() => {
    fetchData();
    navigate(`${location.pathname}?page=${queries.page}`);
    //eslint-disable-next-line
  }, [queries.page]);

  const handlePageClick = (page) => {
    setQueries({  page: page.selected + 1 });
  };


  return (
    <>
      <List data={data} favorite={favorite} userLogged={userLogged} />
      {data.allPropertiesLength > 0 && (
        <ReactPaginate
          breakLabel="..."
          nextLabel="Siguiente >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={totalPages}
          pageCount={totalPages}
          previousLabel="< Anterior"
          renderOnZeroPageCount={null}
          containerClassName={"pagination"}
          previousLinkClassName={"pagination__link"}
          nextLinkClassName={"pagination__link"}
          disabledClassName={"pagination__link--disabled"}
          activeClassName={"pagination__link--active"}
          forcePage={queries.page - 1 || 0}
        />
      )}
    </>
  );
};

export default Pagination;
