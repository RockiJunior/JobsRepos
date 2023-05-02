/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { BsDoorClosed } from "react-icons/bs";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faHeart as faHeartOutline,
  faMessage,
} from "@fortawesome/free-regular-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, deleteFavorite } from "../../redux/favoritesSlice";
import { barrios } from "../models/searchInfo";
import Modal from "react-responsive-modal";
import Contact from "../singleProperty/Contact";
import { Link } from "react-router-dom";
import { ErrorHandler } from "../../utils/errorHandler.utils";
// import { getPropById } from "../../redux/propertiesSlice";

const ListComponent = ({ prop, isLoadingProps, insideOwl }) => {
  // * States
  const dispatch = useDispatch();
  const [like, setLike] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const userLogged = useSelector((state) => state.login.currentUser);
  const favorite = useSelector((state) => state.favorites.favorites);

  // * Methods
  const HandleLike = async () => {
    if (like) {
      try {
        await dispatch(deleteFavorite(userLogged.id, prop._id));
        setLike(false);
      } catch (error) {
        ErrorHandler(null, error.response.data.message);
      }
    } else {
      try {
        await dispatch(addFavorite(userLogged.id, prop._id));
        setLike(true);
      } catch (error) {
        ErrorHandler(null, error.response.data.message);
      }
    }
  };

  useEffect(() => {
    userLogged &&
      favorite?.result?.length > 0 &&
      favorite.result.find((fav) => fav.propertyId === prop._id) &&
      setLike(true);
    //eslint-disable-next-line
  }, [favorite]);

  // const HandleClick = async () => {
  //   if (userLogged) {
  //     await dispatch(getPropById(prop._id));
  //     setShowModal(true);
  //   }
  // };

  return (
    <>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        styles={{ modal: { width: "40vw" } }}
      >
        <Contact setShowModal={() => setShowModal(false)} property={prop} />
      </Modal>
      <div
        className={
          insideOwl
            ? "col-sm-9 col-md-6 col-lg-6 col-xl-3"
            : "col-md-6 col-xl-4 mb30"
        }
      >
        <div className="card-shadow">
          {isLoadingProps && <div className="loader-prop" />}
          <div className="feat_property">
            <Link
              to={`/propiedad/${prop._id}`}
              target="_blank"
              rel="noreferrer"
            >
              <div className="img-thumb">
                {prop.images.length > 0 && (
                  <div className="img-whp-container">
                    <div className="img-hover" />
                    <img
                      className="img-whp"
                      src={
                        prop.images[0]?.url
                          ? prop.images[0].url
                          : `/uploads/properties/${prop.images[0]?.filename}`
                      }
                      alt="fl1.jpg"
                    />
                  </div>
                )}
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
                        <span className="flaticon-photo-camera mr5"></span>
                        {prop.images.length}
                      </div>
                    </li>
                    {(prop.video || prop.video360) && (
                      <li className="list-inline-item">
                        <div className="text-white">
                          <span className="flaticon-play-button mr5 text-white"></span>
                          {prop.video && prop.video360 ? "2" : "1"}
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </Link>
            <div className="details">
              <a
                href={`/propiedad/${prop._id}`}
                target="_blank"
                rel="noreferrer"
              >
                <div className="tc_content">
                  <div className="badge_icon">
                    <img src={prop.real_estate.logo} alt="inmobiliaria" />
                  </div>
                  <h4>{prop.title}</h4>
                  <p>
                    {`${prop.location.street} ${prop.location.number}, ${
                      barrios[prop.location.barrio - 1].label
                    }, CABA`}
                  </p>
                  <ul className="prop_details mb0">
                    {![4, 9, 10, 13].includes(prop.property_type) && (
                      <>
                        <li className="list-inline-item">
                          <BsDoorClosed size={18} />
                          <br />
                          <p className="mt-1">
                            {prop.characteristics.ambience}
                            {prop.characteristics.ambience === 1
                              ? " Ambiente"
                              : " Ambientes"}
                          </p>
                        </li>
                        <li className="list-inline-item">
                          <span className="flaticon-bed"></span> <br />
                          <p> {prop.characteristics.bedrooms} Dorm.</p>
                        </li>
                        <li className="list-inline-item">
                          <span className="flaticon-bath"></span> <br />
                          <p>
                            {prop.characteristics.bathrooms}
                            {prop.characteristics.bathrooms === 1
                              ? " Baño"
                              : " Baños"}
                          </p>
                        </li>
                        <li className="list-inline-item">
                          <span className="flaticon-car"></span> <br />
                          <p>
                            {prop.characteristics.garages}
                            {prop.characteristics.garages === 1
                              ? " Cochera"
                              : " Cocheras"}
                          </p>
                        </li>
                      </>
                    )}
                    <li className="list-inline-item">
                      <span className="flaticon-ruler"></span> <br />
                      {prop.surface.totalSurface} m²
                    </li>
                  </ul>
                </div>
              </a>
            </div>
          </div>
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
                    <FontAwesomeIcon
                      size="lg"
                      icon={like ? faHeart : faHeartOutline}
                      color={like ? "red" : ""}
                      data-toggle={!userLogged && "modal"}
                      data-target={!userLogged && "#logInModal"}
                      onClick={() => userLogged && HandleLike()}
                    />
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
                      onClick={() => userLogged && setShowModal(true)}
                    />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListComponent;
