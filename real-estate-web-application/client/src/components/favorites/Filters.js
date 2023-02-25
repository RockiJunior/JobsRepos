import React from "react";
import Select from "react-select";
import {  sortByFavorites } from "../../pages/searchInfo";

const Filters = () => {
  return (
    <div className="w-50 mb-3">
      <div className="pl5 pb5">
        Ordenar por
      </div>
      <Select
        className="basic-single"
        classNamePrefix="select"
        name="propiedades"
        options={sortByFavorites}
        defaultValue={sortByFavorites[0]}
      />
    </div>
  );
};

export default Filters;
