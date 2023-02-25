import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteFavorite } from "../../redux/favoritesSlice";
import ListComponent from "./ListComponent";

const List = ({ data, fetchData }) => {
  return (
    <table className="table table-borderless mb50">
      <tbody>
        {data &&
          data?.map((prop) => (
            <ListComponent key={prop.property._id} prop={prop} fetchData={fetchData}/>
          ))}
      </tbody>
    </table>
  );
};

export default List;
