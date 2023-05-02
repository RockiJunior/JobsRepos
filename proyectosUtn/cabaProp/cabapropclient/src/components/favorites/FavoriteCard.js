import { useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";
import { deleteFavorite } from "../../redux/favoritesSlice";
import { useSelector } from "react-redux";

const FavoriteCard = ({ prop, fetchData }) => {
  // * States
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const userLogged = useSelector((state) => state.login.currentUser);

  // * Methods
  const HandleDelete = async () => {
    await dispatch(deleteFavorite(userLogged.id, prop.propertyId));
    await fetchData();
    setShowModal(false);
  };

  return (
    <>
      <tr>
        <th scope="row">
          <Link to={`/propiedad/${prop.property._id}`}>
            <div className="feat_property list favorite fp-fix-height">
              <div className="thumb">
                <img
                  className="img__favorites"
                  src={prop.property.images[0].url}
                  alt={prop.property.title}
                />
              </div>
              <div className="details">
                <div className="tc_content">
                  <h4 className="title d-flex flex-column">
                    <small className="tag2" style={{ width: "fit-content" }}>
                      {prop.property.operation_type === 1
                        ? "EN VENTA"
                        : prop.property.operation_type === 2
                        ? "EN ALQUILER"
                        : "ALQUILER TEMPORARIO"}
                    </small>
                    {prop.property.title}
                  </h4>
                  <p>
                    {prop.property.location.street}{" "}
                    {prop.property.location.number}, CABA
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
          </Link>
        </th>
        <td className="editing_list">
          <ul>
            <li className="list-inline-item">
              <div data-toggle="tooltip" data-placement="top" title="Eliminar">
                <span
                  onClick={() => setShowModal(true)}
                  className="flaticon-trash cursor-pointer"
                />
              </div>
            </li>
          </ul>
        </td>
      </tr>
      <Modal open={showModal} onClose={() => setShowModal(false)} center>
        <div className="modal-header d-flex flex-column align-items-center">
          <h4 className="modal-title">
            ¿Querés eliminar esta propiedad de tus favoritos?
          </h4>
          <h4 className="modal-title mt-3">{prop.property.title}</h4>
        </div>
        <div className="modal-body d-flex">
          <button className="btn w-50 m-1 btn-success" onClick={HandleDelete}>
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

export default FavoriteCard;
