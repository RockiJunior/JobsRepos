/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faHeart as faHeartOutline,
  faMessage,
} from "@fortawesome/free-regular-svg-icons";
import { useDispatch } from "react-redux";
import {
  addFavorite,
  deleteFavorite,
  getFavorites,
} from "../../redux/favoritesSlice";
import { barrios } from "../../pages/searchInfo";
import axios from "axios";
import Modal from "react-responsive-modal";
import Contact from "../singleProperty/Contact"

const ListComponent = ({ prop, userLogged, favorite }) => {
  const dispatch = useDispatch();
  const [like, setLike] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userLogged) {
      dispatch(getFavorites(userLogged.id));
      if (favorite && favorite.find((fav) => fav.propertyId === prop._id)) {
        setLike(true);
      }
    }
    //eslint-disable-next-line
  }, [favorite?.length]);

  //handlers
  const handleLike = async (id) => {
    if (userLogged) {
      if (like) {
        try {
          await axios
            .get(`http://localhost:3001/posts/get-by-client/${userLogged.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              const { id: propToDeleteId } = res.data.find(
                (prop) => prop.propertyId === id
              );
              dispatch(deleteFavorite(propToDeleteId));
            });
          setLike(false);
        } catch (error) {
          console.error(error);
        }
      } else {
        dispatch(addFavorite(userLogged.id, id));
        setLike(true);
      }
    }
  };

  return (
<>
<div className="col-lg-6 col-xl-4">
      <div className="feat_property">
        <a href={`/propiedad/${prop._id}`} target="_blank" rel="noreferrer">
          <div className="thumb">
            <img
              className="img-whp"
              src={prop.images[0]}
              // src={
              //   prop.images.length > 0
              //     ? `uploads/properties${prop.images[0].filename.slice(1)}`
              //     : "assets/images/property/fl1.jpg"
              // }
              alt="fl1.jpg"
            />
            <div className="thmb_cntnt">
              <ul className="tag2 mb0">
                <li
                  style={{ backgroundColor: "#0061DF" }}
                  className="list-inline-item color-white p-1 rounded"
                >
                  {prop.operation_type === 1
                    ? "En venta"
                    : prop.operation_type === 2
                    ? "Alquiler"
                    : "Alquiler temporario"}
                </li>
              </ul>
            </div>
            <div className="thmb_cntnt2">
              <ul className="listing_gallery mb0">
                <li className="list-inline-item">
                  <div className="text-white">
                    <span className="flaticon-photo-camera mr5"></span>{" "}
                    {prop.images.length}
                  </div>
                </li>
                {(prop.video || prop.video360) && (
                  <li className="list-inline-item">
                    <div className="text-white">
                      <span className="flaticon-play-button mr5 text-white"></span>{" "}
                      {prop.video && prop.video360 ? "2" : "1"}
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </a>
        <div className="details">
          <a href={`/propiedad/${prop._id}`} target="_blank" rel="noreferrer">
            <div className="tc_content">
              <div className="badge_icon">
                <a>
                  <img src={"/assets/images/inmobiliaria/1.jpg"} alt="inmobiliaria"/>
                </a>
              </div>
              <h4>
                <a>{prop.title}</a>
              </h4>
              <p>
                {prop.location.street} {prop.location.number},{" "}
                {barrios[prop.location.barrio - 1].label}, CABA
              </p>
              <ul className="prop_details mb0">
                <li className="list-inline-item">
                  <span className="flaticon-bed"></span> <br />
                  {prop.characteristics.bedrooms} Dorm.
                </li>
                <li className="list-inline-item">
                  <a>
                    <span className="flaticon-bath"></span> <br />
                    {prop.characteristics.bathrooms} Baños
                  </a>
                </li>
                <li className="list-inline-item">
                  <a>
                    <span className="flaticon-car"></span> <br />
                    {prop.characteristics.garages} Garage
                  </a>
                </li>
                <li className="list-inline-item">
                  <a>
                    <span className="flaticon-ruler"></span> <br />
                    {prop.surface.totalSurface} m²
                  </a>
                </li>
              </ul>
            </div>
          </a>

          <div className="fp_footer">
            <ul className="fp_meta float-left mb0">
              <li className="list-inline-item mt-2">
                <span className="heading-color fw600">
                  {prop.price.currency === 1 ? "USD " : "$"}
                  {Number(prop.price.total).toLocaleString("en-US")}
                </span>
              </li>
            </ul>
            <ul className="fp_meta float-right mb0">
              <li className="list-inline-item">
                <div className="d-flex">
                  <a className="card__icon">
                    {like ? (
                      <FontAwesomeIcon
                        size="lg"
                        icon={faHeart}
                        color="red"
                        data-toggle={!userLogged && "modal"}
                        data-target={!userLogged && "#logInModal"}
                        onClick={() => handleLike(prop._id)}
                      />
                    ) : (
                      <FontAwesomeIcon
                        size="lg"
                        icon={faHeartOutline}
                        data-toggle={!userLogged && "modal"}
                        data-target={!userLogged && "#logInModal"}
                        onClick={() => handleLike(prop._id)}
                      />
                    )}
                  </a>
                  <a
                    href="https://api.whatsapp.com/send?phone=34695685920"
                    className="card__icon"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon size="lg" icon={faWhatsapp} />
                  </a>
                  <a className="card__icon">
                    <FontAwesomeIcon
                      size="lg"
                      icon={faMessage}
                      data-toggle={!userLogged && "modal"}
                      data-target={!userLogged && "#logInModal"}
                      onClick={()=>userLogged && setShowModal(true)}
                    />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <Modal open={showModal} onClose={() => setShowModal(false)} styles={{ modal: { width: '40vw' } }}>
      <Contact userLogged={userLogged} property={prop} type={"modal"} setShowModal={setShowModal}/>
    </Modal>
</>
  );
};

export default ListComponent;
