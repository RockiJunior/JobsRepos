/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { popularBarrios, properties, operations } from "../../pages/searchInfo";
import { getProperties } from "../../redux/propertiesSlice";

const Container = ({ setShowModal, userLogged }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigate = (oper, prop, barr) => {
    const property = prop ? `-${prop.tag}` : "";
    const neighborhood = barr && barr.value ? `-${barr.tag}` : "";
    navigate(`/propiedades/${oper.tag}${property}${neighborhood}?page=1`);
    const body = {
      operationType: oper.value,
      propertyTypes: prop ? [prop.value] : [],
      barrios: barr ? [barr.value] : [],
    };
    dispatch(getProperties(body));
  };

  return (
    <header
      style={{ width: "100vw" }}
      className="header-nav menu_style_home_one navbar-scrolltofixed 
  stricky main-menu style2"
    >
      <div className="container">
        <nav>
          <div className="menu-toggle">
            <img
              className="nav_logo_img img-fluid"
              src="assets/images/header-logo.svg"
              alt="header-logo.svg"
            />
            <button type="button" id="menu-btn">
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </div>
          <Link to="/" className="navbar_brand float-left dn-md">
            <img
              style={{ maxWidth: 150 }}
              className="logo1 img-fluid"
              src="assets/logos/logo.png"
              alt="header-logo.svg"
            />
            <img
              style={{ width: 150 }}
              className="logo2 img-fluid"
              src="assets/logos/logo.png"
              alt="header-logo2.svg"
            />
          </Link>
          <div className="d-flex">
            <ul
              style={{ marginTop: -10 }}
              id="respMenu"
              className="ace-responsive-menu"
              data-menu-style="horizontal"
            >
              <li> </li>
              <li>
                {" "}
                <a>
                  <span
                    className="title cursor-pointer"
                    onClick={() => handleNavigate(operations[0])}
                  >
                    Comprar
                  </span>
                </a>
                <ul>
                  {properties.map((prop) => (
                    <li key={prop.value}>
                      {" "}
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
                {" "}
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
                      {" "}
                      <a
                        className="cursor-pointer"
                        onClick={() => handleNavigate(operations[1], prop)}
                      >
                        {prop.label}
                      </a>
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
                {" "}
                <a>
                  <span
                    className="title cursor-pointer"
                    onClick={() => handleNavigate(operations[2])}
                  >
                    Temporario
                  </span>
                </a>
                <ul>
                  {properties.map((prop) => (
                    <li key={prop.value}>
                      {" "}
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
            </ul>
            <ul style={{ margin: "auto" }}>
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
                    >
                      Ingresar
                    </button>
                  </a>
                  <a
                    className="btn"
                    data-toggle="modal"
                    data-target="#logInModal"
                  >
                    <button
                      type="button"
                      style={{ fontSize: 15 }}
                      className="btn btn-lg btn-transparent rounded"
                    >
                      Inmobiliarias
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
