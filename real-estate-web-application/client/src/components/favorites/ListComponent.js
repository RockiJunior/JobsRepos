import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";
import { deleteFavorite } from "../../redux/favoritesSlice";

const ListComponent = ({ prop, fetchData }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const handleDelete = (id) => {
    dispatch(deleteFavorite(id, fetchData));
    setShowModal(false)
  };

  return (
    <>
        <tr>
          <Link to={`/propiedad/${prop.property._id}`}>
            <th scope="row">
              <div className="feat_property list favorite">
                <div className="thumb">
                  <img
                    className="img__favorites"
                    src={
                      prop.property.images.length > 0
                        ? `uploads/properties${prop.property.images[0].filename.slice(
                            1
                          )}`
                        : "assets/images/listing/s1.png"
                    }
                    alt="s1.png"
                  />
                </div>
                <div className="details">
                  <div className="tc_content">
                    <h4 className="title">
                      {prop.property.title}
                      <small className="tag2">
                        {prop.property.operation_type === 1
                          ? "EN VENTA"
                          : prop.property.operation_type === 2
                          ? "EN ALQUILER"
                          : "ALQUILER TEMPORARIO"}
                      </small>
                    </h4>
                    <p>
                      {prop.property.location.street} {prop.property.location.number},
                      CABA
                    </p>
                    <div className="fp_meta">
                      <span className="heading-color fw600">
                        {prop.property.price.currency === 1 ? "USD " : "$"}
                        {prop.property.price.total.toLocaleString("en-US")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </th>
          </Link>
          <td className="dn-md"></td>
          <td className="dn-md"></td>
          <td className="dn-md"></td>
          <td className="editing_list">
            <ul>
              <li className="list-inline-item">
                <a
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Eliminar"
                >
                  <span
                    onClick={() => setShowModal(true)}
                    className="flaticon-trash cursor-pointer"
                  ></span>
                </a>
              </li>
            </ul>
          </td>
        </tr>
        <Modal open={showModal} onClose={() => setShowModal(false)} center>
        <div className="modal-header d-flex flex-column align-items-center">
          <h4 className="modal-title">¿Deseas eliminar esta propiedad de tus favoritos?</h4>
          <h4 className="modal-title mt-3">{prop.property.title}</h4>
        </div>
        <div className="modal-body d-flex">
          <button className="btn w-50 m-1 btn-success" onClick={()=>handleDelete(prop.id)}>
            Confirmar
          </button>
          <button
            className="btn btn-danger w-50 m-1"
            onClick={() => setShowModal(false)}
          >
            Cancelar
          </button>
        </div>
      </Modal>

    </>
  );
};

export default ListComponent;
