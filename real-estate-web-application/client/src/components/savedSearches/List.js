import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteSearch, updateSearch } from "../../redux/searchesSlice";
import messageHandler from "../../utlis/messageHandler";
import ListComponent from "./ListComponent";

const List = ({ data, fetchData }) => {
  const dispatch = useDispatch();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [searchName, setSearchName] = useState("");
  const [currentId, setCurrentId] = useState("")
  const [errorSearch, setErrorSearch] = useState(false)

  const handleDelete = (id) => {
    dispatch(deleteSearch(id));
    setShowDeleteModal(false)
  };

  const handleUpdate = (id) => {
    if (!errorSearch) {
      dispatch(
        updateSearch(id, {
          name: searchName,
        })
      )
      setShowEditModal(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [handleDelete, handleUpdate]);

  return (
    <>
      <table className="table table-borderless mb50">
        <thead className="thead-light">
          <tr>
            <th scope="col">Búsquedas</th>
            <th scope="col"></th>
            <th className="dn-sm" scope="col"></th>
            <th className="dn-sm" scope="col"></th>
            <th className="dn-sm" scope="col"></th>
            <th className="dn-lg" scope="col"></th>
            <th className="dn-lg" scope="col"></th>
            <th className="dn-lg" scope="col"></th>
            <th className="dn-lg" scope="col"></th>
            <th className="d-flex justify-content-center" scope="col">Alertas</th>
            <th scope="col">Guardada</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((search) => (
              <ListComponent
                key={search.id}
                data={search}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
                showEditModal={showEditModal}
                setShowEditModal={setShowEditModal}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                searchName={searchName}
                setSearchName={setSearchName}
                currentId={currentId}
                setCurrentId={setCurrentId}
                errorSearch={errorSearch}
                setErrorSearch={setErrorSearch}
              />
            ))}
        </tbody>
      </table>
    </>
  );
};

export default List;
