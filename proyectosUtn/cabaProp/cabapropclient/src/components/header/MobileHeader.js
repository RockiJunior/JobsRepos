import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { popularBarrios, properties, operations } from "../models/searchInfo";

const MobileHeader = ({ setShowModal }) => {
  // * States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userLogged = useSelector((state) => state.login.currentUser);

  return (
    <div id="page" className="stylehome1 h0">
      <div className="mobile-menu">
        <div className="header stylehome1">
          <div className="main_logo_home2">
            <img
              className="nav_logo_img img-fluid cursor-pointer"
              src="assets/logos/logo.png"
              alt="header-logo.svg"
              style={{ width: "140px", marginTop: "20px" }}
              onClick={() => window.location.replace("/")}
            />
          </div>
          <ul className="menu_bar_home2 m-0">
            <li className="list-inline-item">
              <div className="custom_search_with_menu_trigger msearch_icon"></div>
            </li>
            {!userLogged ? (
              <li className="list-inline-item add_listing d-flex pt10">
                <div
                  data-toggle="modal"
                  data-target="#logInModal"
                  className="muser_icon"
                  ref={(ref) => {
                    if (isModalOpen) {
                      ref?.click();
                      setIsModalOpen(false);
                    }
                  }}
                >
                  <span className="flaticon-user"></span>
                </div>
              </li>
            ) : (
              <>
                <li className="list-inline-item user_setting">
                  <div className="dropdown">
                    <div
                      className="btn dropdown-toggle d-flex align-items-center justify-content-center"
                      data-toggle="dropdown"
                      style={{ padding: "5px 0 0 0" }}
                    >
                      {userLogged.photo ? (
                        <img
                          style={{ width: 44, height: 44 }}
                          className="rounded-circle"
                          src={JSON.stringify(userLogged.photo).slice(1, -1)}
                          alt="Foto de perfil"
                        />
                      ) : (
                        <div
                          style={{ width: 44, height: 44, fontSize: 16 }}
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
                    </div>
                    <div className="dropdown-menu">
                      <div className="user_set_header d-flex">
                        {userLogged.photo ? (
                          <img
                            style={{ width: 80, height: 80 }}
                            className="float-left"
                            src={JSON.stringify(userLogged.photo).slice(1, -1)}
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
                          className="dropdown-item navbar-item"
                        >
                          Mi Perfil
                        </Link>

                        <Link
                          to="/favoritos"
                          className="dropdown-item navbar-item"
                        >
                          Favoritos
                        </Link>
                        <Link
                          to="/busquedas-guardadas"
                          className="dropdown-item navbar-item"
                        >
                          Búsquedas Guardadas
                        </Link>
                        <Link
                          to="/mensajes"
                          className="dropdown-item navbar-item"
                        >
                          Mensajes
                        </Link>
                        <Link
                          className="dropdown-item navbar-item"
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
            <li className="list-inline-item">
              <a className="menubar" href="#menu">
                <span></span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <nav id="menu" className="stylehome1">
        <ul>
          {operations.map((op) => (
            <li key={op.value}>
              <span>{op.label}</span>
              <ul>
                {properties.map((prop) => (
                  <li key={prop.value}>
                    <span>{prop.label}</span>
                    <ul>
                      {popularBarrios.map((barrio) => (
                        <li key={barrio.value}>
                          <Link
                            target="_blank"
                            rel="noreferrer"
                            to={`/propiedades/${op.tag}-${prop.tag}-${barrio.tag}`}
                          >
                            {barrio.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
          <li>
            <Link to="/inmobiliarias" target="_blank" rel="noreferrer">
              Inmobiliarias
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MobileHeader;
