/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { popularBarrios, properties, operations } from "../models/searchInfo";
import { useSelector } from "react-redux";

const Container = ({ setShowModal }) => {
  // * States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userLogged = useSelector((state) => state.login.currentUser);
  const location = useLocation();

  // * Methods
  const handleNavigate = (oper, prop, barr) => {
    const property = prop ? `-${prop.tag}` : "";
    const neighborhood = barr && barr.value ? `-${barr.tag}` : "";
    window.open(`/propiedades/${oper.tag}${property}${neighborhood}?page=1`);
  };

  // * Life Cycle
  useEffect(() => {
    if (location.search.match(/iniciar-sesion/)) setIsModalOpen(true);
    // eslint-disable-next-line
  }, [location]);

  return (
    <header
      style={{ width: "100vw" }}
      className="header-nav menu_style_home_one navbar-scrolltofixed 
  stricky main-menu style2"
    >
      <div className="container">
        <nav>
          <Link to="/" className="navbar_brand float-left dn-md">
            <img
              style={{ maxWidth: 150 }}
              className="logo1 img-fluid"
              src="assets/logos/logo.png"
              alt="header-logo.svg"
            />
          </Link>
          <div className="d-flex align-items-center">
            <ul
              id="respMenu"
              className="ace-responsive-menu"
              data-menu-style="horizontal"
            >
              <li> </li>
              <li>
                <a>
                  <span
                    className="cursor-pointer"
                    onClick={() => handleNavigate(operations[0])}
                  >
                    Comprar
                  </span>
                </a>
                <ul>
                  {properties.map((prop) => (
                    <li key={prop.value}>
                      <a
                        className="cursor-pointer"
                        onClick={() => handleNavigate(operations[0], prop)}
                      >
                        {prop.label}
                      </a>
                      <ul>
                        {popularBarrios.map((barrio) => (
                          <li key={barrio.value}>
                            <a
                              className="cursor-pointer"
                              onClick={() =>
                                handleNavigate(operations[0], prop, barrio)
                              }
                            >
                              {barrio.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <a>
                  <span
                    className="title cursor-pointer"
                    onClick={() => handleNavigate(operations[1])}
                  >
                    Alquilar
                  </span>
                </a>
                <ul>
                  {properties.map((prop) => (
                    <li key={prop.value}>
                      <Link
                        to="#"
                        className="cursor-pointer"
                        onClick={() => handleNavigate(operations[1], prop)}
                      >
                        {prop.label}
                      </Link>
                      <ul>
                        {popularBarrios.map((barrio) => (
                          <li key={barrio.value}>
                            <a
                              className="cursor-pointer"
                              onClick={() =>
                                handleNavigate(operations[1], prop, barrio)
                              }
                            >
                              {barrio.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <Link to="#">
                  <span
                    className="title cursor-pointer"
                    onClick={() => handleNavigate(operations[2])}
                  >
                    Temporario
                  </span>
                </Link>
                <ul>
                  {properties.map((prop) => (
                    <li key={prop.value}>
                      <a
                        className="cursor-pointer"
                        onClick={() => handleNavigate(operations[2], prop)}
                      >
                        {prop.label}
                      </a>
                      <ul>
                        {popularBarrios.map((barrio) => (
                          <li key={barrio.value}>
                            <a
                              className="cursor-pointer"
                              onClick={() =>
                                handleNavigate(operations[2], prop, barrio)
                              }
                            >
                              {barrio.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <Link to="/inmobiliarias" target="_blank" rel="noreferrer">
                  <span className="cursor-pointer">Inmobiliarias</span>
                </Link>
              </li>
            </ul>
            <ul className="m-0">
              {!userLogged ? (
                <li className="list-inline-item add_listing d-flex pt10">
                  <a
                    className="btn"
                    data-toggle="modal"
                    data-target="#logInModal"
                  >
                    <button
                      style={{ fontSize: 15 }}
                      type="button"
                      className="btn btn-lg btn-dark rounded"
                      ref={(ref) => {
                        if (isModalOpen) {
                          ref?.click();
                          setIsModalOpen(false);
                        }
                      }}
                    >
                      Ingresar
                    </button>
                  </a>
                </li>
              ) : (
                <>
                  <li className="user_setting">
                    <div className="dropdown">
                      <a
                        className="btn dropdown-toggle d-flex align-items-center justify-content-center text-dark"
                        data-toggle="dropdown"
                      >
                        {userLogged.photo ? (
                          <img
                            style={{ width: 50, height: 50 }}
                            className="rounded-circle"
                            src={JSON.stringify(userLogged.photo).slice(1, -1)}
                            alt="Foto de perfil"
                          />
                        ) : (
                          <div
                            style={{ width: 50, height: 50, fontSize: 22 }}
                            className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-light"
                          >
                            {JSON.stringify(userLogged.firstName)
                              .slice(1, -1)[0]
                              .toLocaleUpperCase()}
                            {JSON.stringify(userLogged.lastName)
                              .slice(1, -1)[0]
                              .toLocaleUpperCase()}
                          </div>
                        )}
                        <span className="dn-1366">
                          <span className="fa fa-angle-down ml5"></span>
                        </span>
                      </a>
                      <div className="dropdown-menu">
                        <div className="user_set_header d-flex">
                          {userLogged.photo ? (
                            <img
                              style={{ width: 80, height: 80 }}
                              className="float-left"
                              src={JSON.stringify(userLogged.photo).slice(
                                1,
                                -1
                              )}
                              alt="Foto de perfil"
                            />
                          ) : (
                            <div
                              style={{ width: 80, height: 80, fontSize: 40 }}
                              className=" d-flex align-items-center justify-content-center bg-primary text-light"
                            >
                              {JSON.stringify(userLogged.firstName)
                                .slice(1, -1)[0]
                                .toLocaleUpperCase()}
                              {JSON.stringify(userLogged.lastName)
                                .slice(1, -1)[0]
                                .toLocaleUpperCase()}
                            </div>
                          )}
                          <p>
                            {JSON.stringify(userLogged.firstName).slice(1, -1)}{" "}
                            {JSON.stringify(userLogged.lastName).slice(1, -1)}
                            <br />
                            <span className="address">
                              {JSON.stringify(userLogged.email).slice(1, -1)}
                            </span>
                          </p>
                        </div>
                        <div className="user_setting_content">
                          <Link
                            to="/mi-perfil"
                            className="dropdown-item text-dark"
                          >
                            Mi Perfil
                          </Link>

                          <Link
                            to="/favoritos"
                            className="dropdown-item text-dark"
                          >
                            Favoritos
                          </Link>
                          <Link
                            to="/busquedas-guardadas"
                            className="dropdown-item text-dark"
                          >
                            Búsquedas Guardadas
                          </Link>
                          <Link
                            to="/mensajes"
                            className="dropdown-item text-dark"
                          >
                            Mensajes
                          </Link>
                          <Link
                            className="dropdown-item text-dark"
                            onClick={() => setShowModal(true)}
                          >
                            Cerrar Sesión
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Container;
