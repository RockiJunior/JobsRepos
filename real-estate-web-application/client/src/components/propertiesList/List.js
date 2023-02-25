import React from "react";
import ListComponent from "./ListComponent";

const List = ({ data, userLogged, favorite }) => {
  return (
    <>
      <div className="row">
        {data.allPropertiesLength === 0 ? (
          <div className="mt150 w-100 text-center">
            <h2>No existen propiedades con esas características</h2>
          </div>
        ) : (
          data &&
          data.result.map((prop) => (
            <ListComponent prop={prop} key={prop._id} userLogged={userLogged} favorite={favorite}/>
          ))
        )}
      </div>
    </>
  );
};

export default List;
