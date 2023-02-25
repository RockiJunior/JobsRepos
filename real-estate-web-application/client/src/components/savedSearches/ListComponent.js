import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteSearch, updateSearch } from "../../redux/searchesSlice";
import { Modal } from "react-responsive-modal";
import { alerts } from "../../pages/searchInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import "moment/locale/es";
moment.locale("es");
import "react-responsive-modal/styles.css";

const ListComponent = ({
  data,
  handleDelete,
  handleUpdate,
  showEditModal,
  setShowEditModal,
  showDeleteModal,
  setShowDeleteModal,
  searchName,
  setSearchName,
  currentId,
  setCurrentId,
  errorSearch,
  setErrorSearch
}) => {
  const openEditModal = () => {
    setShowEditModal(true);
    setSearchName(data.name);
    setCurrentId(data.id);
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
    setCurrentId(data.id);
  };

  return (
    <>
      <tr>
        <td scope="row">
          <Link to={data.path}>
            <div className="font-weight-bold link">{data.name}</div>
          </Link>
          <ul className="mt-2">
            {data.tags.map((tag, index) => (
              <li
                style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
                className="list-inline-item p-1 mr-2 rounded"
                key={index}
              >
                <span className="font-weight-normal">{tag}</span>
              </li>
            ))}
          </ul>
        </td>
        <td></td>
        <td className="dn-sm"></td>
        <td className="dn-sm"></td>
        <td className="dn-sm"></td>
        <td className="dn-lg"></td>
        <td className="dn-lg"></td>
        <td className="dn-lg"></td>
        <td className="dn-lg"></td>
        <td
          className="editing_list"
          style={{ zIndex: 1000, position: "relative" }}
        >
          <select className="p-2 rounded" defaultValue={3}>
            {alerts.map((alert) => (
              <option key={alert.value} value={alert.value}>
                {alert.label}
              </option>
            ))}
          </select>
        </td>
        <td className="editing_list">
          {moment(data.updated_at).format("D MMMM YYYY")}
        </td>
        <td className="editing_list">
          <ul>
            <li className="list-inline-item" onClick={openEditModal}>
              <a data-toggle="tooltip" data-placement="top" title="Editar">
                <span className="flaticon-edit cursor-pointer"></span>
              </a>
            </li>
            <li className="list-inline-item" onClick={openDeleteModal}>
              <a data-toggle="tooltip" data-placement="top" title="Eliminar">
                <span className="flaticon-trash cursor-pointer"></span>
              </a>
            </li>
          </ul>
        </td>
      </tr>
      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        center
      >
        <div className="modal-header">
          <h4 className="modal-title">Editar Búsqueda Guardada</h4>
        </div>
        <div className="modal-body">
          <div className="">
            <div className="">
              <div className="col-lg-12">
                <p>Elegí un nombre personalizado para tu búsqueda guardada</p>
                <input
                  style={{ border: "1px solid rgba(0,0,0,.3)" }}
                  className="w-100 p-2 rounded"
                  type=""
                  name=""
                  value={searchName}
                  onChange={(e) => {
                    setSearchName(e.target.value);
                    setErrorSearch(false);
                  }}
                  onBlur={() => (!searchName.trim()  || searchName.length > 30) && setErrorSearch(true)}
                />
                {errorSearch && (
                  <p style={{ color: "red" }}>
                    {!searchName.trim() ? "Este campo es obligatorio" : "Máximo 30 caracteres"}
                  </p>
                )}
                <button
                  className="btn btn-block btn-thm mt-3"
                  onClick={() => handleUpdate(currentId)}
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        center
      >
        <div className="modal-header">
          <h4 className="modal-title">¿Deseas eliminar esta búsqueda?</h4>
        </div>
        <div className="modal-body d-flex">
          <button
            className="btn w-50 m-1 btn-success"
            onClick={() => handleDelete(currentId)}
          >
            Confirmar
          </button>
          <button
            className="btn btn-danger w-50 m-1"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ListComponent;
