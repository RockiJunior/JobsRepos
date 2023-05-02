/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { faHeart as faHeartOutline } from "@fortawesome/free-regular-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { barrios, operations, properties } from "../models/searchInfo";
import {
  addFavorite,
  deleteFavorite,
  getFavorites,
} from "../../redux/favoritesSlice";
import {
  SurfaceHeader,
  ApartmentHeader,
  ShopHeader,
  HotelHeader,
  BuildingHeader,
} from "../properties/PropertiesHeader";
import Gallery from "./Gallery";
import { ErrorHandler } from "../../utils/errorHandler.utils";

const Pictures = ({ id }) => {
  // * States
  const dispatch = useDispatch();
  const userLogged = useSelector((state) => state.login.currentUser);
  const data = useSelector((state) => state.properties.singleProperty);
  const [like, setLike] = useState(false);

  // * Constants
  const barrio = barrios.find(
    (barrio) => barrio.value === data.location.barrio
  );
  const operation = operations.find(
    (operation) => operation.value === data.operation_type
  );
  const property = properties.find(
    (property) => property.value === data.property_type
  );

  // * Methods
  const HandleLike = async () => {
    if (like) {
      try {
        await dispatch(deleteFavorite(userLogged.id, id));
        setLike(false);
      } catch (error) {
        ErrorHandler(null, error.response.data.message);
      }
    } else {
      try {
        await dispatch(addFavorite(userLogged.id, id));
        setLike(true);
      } catch (error) {
        ErrorHandler(null, error.response.data.message);
      }
    }
  };

  const CheckInitialLike = async () => {
    const res = await dispatch(getFavorites(userLogged?.id, 0));
    res?.result?.length > 0 &&
      res.result.find((fav) => fav.propertyId === id) &&
      setLike(true);
  };

  // * Life Cycle
  useEffect(() => {
    userLogged && CheckInitialLike();
    //eslint-disable-next-line
  }, [userLogged]);

  // useEffect(() => {
  //   userLogged &&
  //     favorite?.result?.length > 0 &&
  //     favorite.result.find((fav) => fav.propertyId === id) &&
  //     setLike(true);
  //   //eslint-disable-next-line
  // }, [favorite]);

  return (
    <div className="listing-title-area pb50">
      <div className="container">
        <div className="row mb20">
          <div className="col-lg-12 col-xl-12">
            <div className="breadcrumb_content style3">
              <div className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Inicio</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to={`/propiedades/${operation.tag}?page=1`}>
                    {operation.label}
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link
                    to={`/propiedades/${operation.tag}-${property.tag}?page=1`}
                  >
                    {property.label}
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link
                    to={`/propiedades/${operation.tag}-${property.tag}-${barrio.tag}?page=1`}
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
              </div>
            </div>
            <div className="single_property_social_share_content text-right">
              <div className="spss style2">
                <div className="list-inline-item icon cursor-pointer">
                  <FontAwesomeIcon
                    size="lg"
                    icon={like ? faHeart : faHeartOutline}
                    color={like ? "red" : ""}
                    data-toggle={!userLogged && "modal"}
                    data-target={!userLogged && "#logInModal"}
                    onClick={() => userLogged && HandleLike()}
                  />
                </div>
                <div className="list-inline-item ml-1">
                  {like ? "Eliminar" : "Guardar"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 col-xl-12">
            <div className="single_property_title d-flex justify-content-between align-items-center">
              <div className="media">
                <div className="media-body">
                  <h2 className="mt-0">{` ${
                    operations.find((op) => op.value === data.operation_type)
                      .label
                  } | ${
                    properties.find((prop) => prop.value === data.property_type)
                      .label
                  } | ${data.title}`}</h2>
                </div>
              </div>
              <div className="price">
                <h2>
                  {data.price.currency === 1 ? "USD " : "$"}
                  {Number(data.price.total).toLocaleString("en-US")}
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 col-xl-12">
            <p>
              {data.location.street} {data.location.number}, CABA, Argentina
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 col-xl-12">
            <ul className="prop_details mb30">
              {[1, 2, 3].includes(data.property_type) && (
                <ApartmentHeader data={data} />
              )}
              {[4, 10, 13].includes(data.property_type) && (
                <SurfaceHeader data={data} />
              )}
              {[5, 6, 7, 8, 9].includes(data.property_type) && (
                <ShopHeader data={data} />
              )}
              {data.property_type === 11 && <HotelHeader data={data} />}
              {data.property_type === 12 && <BuildingHeader data={data} />}
            </ul>
          </div>
        </div>

        <Gallery data={data} />
      </div>
    </div>
  );
};

export default Pictures;
