import { useState } from "react";
import { Modal } from "react-responsive-modal";
import { Link } from "react-router-dom";
import { alerts } from "../models/searchInfo";
import { useDispatch, useSelector } from "react-redux";
import { deleteSearch, updateSearch } from "../../redux/searchesSlice";
import moment from "moment";
import "moment/locale/es";
moment.locale("es");

const SavedSearchItem = ({ data, fetchData }) => {
  // * States
  const dispatch = useDispatch();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errorSearch, setErrorSearch] = useState(false);
  const [value, setValue] = useState(data.name);
  const userLogged = useSelector((state) => state.login.currentUser);

  // * Methods
  const HandleDelete = async () => {
    await dispatch(deleteSearch(userLogged.id, { name: data.name }));
    await fetchData();
    setShowDeleteModal(false);
  };

  const HandleUpdate = async () => {
    if (!errorSearch) {
      await dispatch(
        updateSearch(data.id, {
          name: value,
        })
      );
      await fetchData();
      setShowEditModal(false);
    }
  };

  return (
    <>
      <tr>
        <td>
          <Link to={data.path}>
            <div className="font-weight-bold link">{data.name}</div>
          </Link>
          <ul className="mt-2">
            {data.tags.map((tag, i) => (
              <li
                style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
                className="list-inline-item p-1 mr-2 rounded"
                key={i}
              >
                <span className="font-weight-normal">{tag}</span>
              </li>
            ))}
          </ul>
        </td>
        <td></td>
        <td className="editing_list text-center">
          <select className="p-2 rounded" defaultValue={3}>
            {alerts.map((alert) => (
              <option key={alert.value} value={alert.value}>
                {alert.label}
              </option>
            ))}
          </select>
        </td>
        <td className="editing_list text-center">
          {moment(data.updated_at).format("D MMMM YYYY")}
        </td>
        <td className="editing_list">
          <ul className="d-flex">
            <li
              className="list-inline-item"
              onClick={() => setShowEditModal(true)}
            >
              <div data-toggle="tooltip" data-placement="top" title="Editar">
                <span className="flaticon-edit cursor-pointer" />
              </div>
            </li>
            <li
              className="list-inline-item"
              onClick={() => setShowDeleteModal(true)}
            >
              <div data-toggle="tooltip" data-placement="top" title="Eliminar">
                <span className="flaticon-trash cursor-pointer" />
              </div>
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
          <h4 className="modal-title">Editar búsqueda guardada</h4>
        </div>
        <div className="modal-body">
          <div className="">
            <div className="">
              <div className="col-lg-12">
                <p>Elegí un nombre personalizado para tu búsqueda guardada</p>
                <input
                  style={{ border: "1px solid rgba(0,0,0,.3)" }}
                  className="w-100 p-2 rounded"
                  type="text"
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    setErrorSearch(
                      !e.target.value.trim() || e.target.value.length > 60
                    );
                  }}
                  onBlur={(e) =>
                    setErrorSearch(
                      !e.target.value.trim() || e.target.value.length > 60
                    )
                  }
                />
                {errorSearch && (
                  <p style={{ color: "red", marginTop: "5px" }}>
                    {value.trim()
                      ? "El nombre debe tener entre 1 y 60 caracteres"
                      : "Este campo es obligatorio"}
                  </p>
                )}
                <button
                  className="btn btn-block btn-thm mt-3"
                  onClick={() => {
                    !errorSearch && HandleUpdate();
                  }}
                  disabled={errorSearch}
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
          <h4 className="modal-title">¿Querés eliminar esta búsqueda?</h4>
        </div>
        <div className="modal-body d-flex">
          <button className="btn w-50 m-1 btn-success" onClick={HandleDelete}>
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

export default SavedSearchItem;
