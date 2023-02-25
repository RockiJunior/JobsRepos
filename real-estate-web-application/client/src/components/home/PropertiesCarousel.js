import React, { useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRecommendedProperties } from "../../redux/propertiesSlice";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const PropertiesCarousel = ({ page }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.properties.recommendedProperties);

  const fetchData = () => {
    const body = {
      operationType: 1,
      propertyTypes: [],
      barrios: [],
    };
    dispatch(getRecommendedProperties(body));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section id="feature-property" className="feature-property">
      {!data ? (
        <div className="preloader"></div>
      ) : (
        <div className="container">
          {page === "error" ? (
            <div className="main-title text-center">
              <h3>Busca otras propiedades similares</h3>
            </div>
          ) : (
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="main-title text-center">
                  <h1>Propiedades según tus preferencias</h1>
                  <p>Basado en tus últimas búsquedas</p>
                </div>
              </div>
            </div>
          )}
          <div className="row">
            <div className="col-lg-12">
              <div className="popular_listing_slider1">
                <OwlCarousel
                  className="owl-theme"
                  items={4}
                  loop
                  margin={20}
                  nav
                >
                  {data.result.map((prop, index) => (
                    <div className="item" key={index}>
                      <div
                        style={{ border: "1px solid rgba(0,0,0,.1)" }}
                        className="feat_property recent"
                      >
                        <div className="thumb">
                          {" "}
                          <img
                            className="img-whp"
                            src={
                              prop.images.length > 0
                                ? `uploads/properties${prop.images[0].filename.slice(
                                    1
                                  )}`
                                : "assets/images/property/rp1.jpg"
                            }
                            alt="rp1.jpg"
                          />
                          <div className="thmb_cntnt">
                            <ul className="tag2 mb0">
                              <li className="list-inline-item">
                                <a href="#">
                                  {prop.operation_type === 1
                                    ? "En venta"
                                    : prop.operation_type === 2
                                    ? "En alquiler"
                                    : "Alquiler temporario"}
                                </a>
                              </li>
                            </ul>
                          </div>
                          <div className="thmb_cntnt2">
                            <ul className="listing_gallery mb0">
                              <li className="list-inline-item">
                                <a className="text-white" href="#">
                                  <span className="flaticon-photo-camera mr5"></span>{" "}
                                  22
                                </a>
                              </li>
                              <li className="list-inline-item">
                                <a className="text-white" href="#">
                                  <span className="flaticon-play-button mr5"></span>{" "}
                                  3
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="details">
                          <div className="tc_content">
                            <div className="badge_icon">
                              <a href="#">
                                <img
                                  src="assets/images/agent/1.png"
                                  alt="1.png"
                                />
                              </a>
                            </div>
                            <h4 className="pl-2">
                              <a>{prop.title}</a>
                            </h4>
                            <p>{prop.street}</p>
                            <ul className="prop_details mb0 d-flex justify-content-center">
                              <li className="list-inline-item">
                                <a href="#">
                                  <span className="flaticon-bed pr5"></span>{" "}
                                  <br />
                                  {prop.characteristics.bedrooms} Dorm.
                                </a>
                              </li>
                              <li className="list-inline-item">
                                <a href="#">
                                  <span className="flaticon-bath pr5"></span>{" "}
                                  <br />
                                  {prop.characteristics.bathrooms} Baños
                                </a>
                              </li>
                              <li className="list-inline-item">
                                <a href="#">
                                  <span className="flaticon-car pr5"></span>{" "}
                                  <br />
                                  {prop.characteristics.garages} Garages
                                </a>
                              </li>
                              <li className="list-inline-item">
                                <a href="#">
                                  <span className="flaticon-ruler pr5"></span>{" "}
                                  <br />
                                  {prop.surface.totalSurface} m²
                                </a>
                              </li>
                            </ul>
                          </div>
                          <div className="fp_footer">
                            <ul className="fp_meta float-left mb0">
                              <li className="list-inline-item">
                                <a href="#">
                                  <span className="heading-color fw600 pl-3">
                                    {prop.price.currency === 1 ? "USD " : "$"}
                                    {Number(prop.price.total).toLocaleString(
                                      "en-US"
                                    )}
                                  </span>
                                </a>
                              </li>
                            </ul>
                            <ul className="fp_meta float-right mb0">
                              <li className="list-inline-item">
                                <a className="icon" href="#">
                                  <span className="flaticon-resize"></span>
                                </a>
                              </li>
                              <li className="list-inline-item">
                                <a className="icon" href="#">
                                  <span className="flaticon-add"></span>
                                </a>
                              </li>
                              <li className="list-inline-item">
                                <a className="icon" href="#">
                                  <span className="flaticon-heart-shape-outline"></span>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </OwlCarousel>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PropertiesCarousel;
