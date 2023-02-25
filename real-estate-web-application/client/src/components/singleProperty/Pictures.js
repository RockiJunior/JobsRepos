/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
// import Lightbox from "react-image-lightbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartOutline } from "@fortawesome/free-regular-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavorite,
  deleteFavorite,
  getFavorites,
} from "../../redux/favoritesSlice";
import axios from "axios";
import {
  CocheraHeader,
  DepartamentoHeader,
  LocalHeader,
  TerrenoHeader,
} from "../properties/PropertiesHeader";
import { barrios, operations, properties } from "../../pages/searchInfo";
import { Link } from "react-router-dom";

const Pictures = ({ data, id, favorite, userLogged }) => {
  let imagesPopup = [];
  const dispatch = useDispatch();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [like, setLike] = useState(false);
  const token = localStorage.getItem("token");

  const barrio = barrios.find(
    (barrio) => barrio.value === data.location.barrio
  );
  const operation = operations.find(
    (operation) => operation.value === data.operation_type
  );
  const property = properties.find(
    (property) => property.value === data.property_type
  );

  useEffect(() => {
    if (userLogged) {
      dispatch(getFavorites(userLogged.id));
      if (
        favorite &&
        favorite.filter((prop) => prop.propertyId === id).length === 1
      ) {
        setLike(true);
      }
    }
    //eslint-disable-next-line
  }, [favorite?.length]);

  // if (data) {
  //   data.images.map((image) => {
  //     imagesPopup.push(`uploads/properties${image.filename.slice(1)}`);
  //   });
  // }

  // const currentImage = imagesPopup[photoIndex];

  //handlers
  const handlePicture = (index) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

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
    <section className="listing-title-area pb50">
      <div className="container">
        <div className="row mb30">
          <div className="col-lg-7 col-xl-7">
            <div className="single_property_title mt30-767">
              <div className="breadcrumb_content style3">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Inicio</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={`/propiedades/${operation.tag}`}>
                      {operation.label}
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={`/propiedades/${operation.tag}-${property.tag}`}>
                      {property.label}
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link
                      to={`/propiedades/${operation.tag}-${property.tag}-${barrio.tag}`}
                    >
                      {barrio.label}
                    </Link>
                  </li>
                  <li
                    className="breadcrumb-item active style2"
                    aria-current="page"
                  >
                    {data.title}
                  </li>
                </ul>
              </div>
              <div className="media">
                <div className="media-body">
                  <h2 className="mt-0">{data.title}</h2>
                  <p>
                    {data.location.street} {data.location.number}, CABA,
                    Argentina
                  </p>
                  <ul className="prop_details mb0">
                    {data.property_type === 1 ||
                    data.property_type === 2 ||
                    data.property_type === 3 ? (
                      <DepartamentoHeader data={data} />
                    ) : data.property_type === 4 ? (
                      <CocheraHeader data={data} />
                    ) : data.property_type === 5 ||
                      data.property_type === 6 ||
                      data.property_type === 7 ||
                      data.property_type === 8 ? (
                      <LocalHeader data={data} />
                    ) : (
                      data.property_type === 9 && <TerrenoHeader data={data} />
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5 col-xl-5">
            <div className="single_property_social_share_content text-right tal-md">
              <div className="spss style2 mt30">
                <ul className="mb0">
                  {/* <li className="list-inline-item icon">
                      <span className="flaticon-share"></span>
                  </li>
                  <li className="list-inline-item">
                    Compartir
                  </li> */}
                  <li
                    onClick={() => handleLike(data._id)}
                    className="list-inline-item icon"
                  >
                    {userLogged ? (
                      <div className="icon">
                        {like ? (
                          <FontAwesomeIcon icon={faHeart} color="red" />
                        ) : (
                          <FontAwesomeIcon icon={faHeartOutline} />
                        )}
                      </div>
                    ) : (
                      <div data-toggle="modal" data-target="#logInModal">
                        <FontAwesomeIcon icon={faHeartOutline} />
                      </div>
                    )}
                  </li>
                  <li className="list-inline-item">
                    {like ? "Eliminar" : "Guardar"}
                  </li>
                </ul>
              </div>
              <div className="price mt20 mb10">
                <h3>
                  {data.price.currency === 1 ? "USD " : "$"}
                  {Number(data.price.total).toLocaleString("en-US")}
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-7">
            <div className="row">
              <div className="col-lg-12 pr0 pl15-767 pr15-767">
                <div className="spls_style_two mb30-md">
                        <img
                          onClick={() => handlePicture(0)}
                          className="img-fluid first-img"
                          src={data.images[0]}
                          // src={`uploads/properties${image.filename.slice(1)}`}
                          alt="1.jpg"
                        />
                  <span className="baddge_left">EN VENTA</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="row">
              {data.images.map((image, index) => {
                if (index !== 0) {
                  return (
                    <div className="col-sm-4 col-lg-4 pr5 pr15-767" key={index}>
                      <div className="spls_style_two mb10">
                        <img
                          onClick={() => handlePicture(index)}
                          style={{ height: 150 }}
                          className="img-fluid w100 h100"
                          src={image}
                          // src={`uploads/properties${image.filename.slice(1)}`}
                          alt={"foto"}
                        />
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
      {/* {isOpen && imagesPopup.length > 0 && (
        <Lightbox
          mainSrc={currentImage}
          nextSrc={imagesPopup[(photoIndex + 1) % imagesPopup.length]}
          prevSrc={
            imagesPopup[
              (photoIndex + imagesPopup.length - 1) % imagesPopup.length
            ]
          }
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex(
              (photoIndex + imagesPopup.length - 1) % imagesPopup.length
            )
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % imagesPopup.length)
          }
        />
      )} */}
    </section>
  );
};

export default Pictures;
