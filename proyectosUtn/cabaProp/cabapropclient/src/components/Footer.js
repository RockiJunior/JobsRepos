import React from "react";
import { Link } from "react-router-dom";
import { socialLinks, propLinks } from "./FooterHelper";
import messageHandler from "../utils/messageHandler";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const Footer = () => {
  // * States
  const [version, setVersion] = useState();

  // * Methods
  const HandleSubmit = (e) => {
    e.preventDefault();
    messageHandler("error", "Esta funcionalidad todavía no está disponible");
  };

  const GetServerVersion = async () => {
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_SERVER}/version`,
    });
    setVersion(response.data.version);
  };

  // * Life Cycle
  useEffect(() => {
    GetServerVersion();
  }, []);

  return (
    <>
      <section className="footer_one home1">
        <div className="px-4 pb50 d-flex justify-content-center">
          <div className="row">
            <div className="col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3">
              <div className="footer_contact_widget">
                <h4>
                  <strong>Contacto</strong>
                </h4>
                <ul className="list-unstyled">
                  <li className="text-white df">
                    <span className="flaticon-map mr15" />
                    Adolfo Alsina 1382, C1088 AAJ, Buenos Aires
                  </li>
                  <li className="text-white">
                    <span className="flaticon-phone mr15" />
                    +54 011 4124-6060
                  </li>
                  <li className="text-white">
                    <Link to="mailto:info@colegioinmobiliario.org.ar?subject=Info - Mensaje Web">
                      <span className="flaticon-mail-inbox-app mr15" />
                      info@colegioinmobiliario.org.ar
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="footer_social_widget mt20">
                <ul className="mb0">
                  {socialLinks.map((social) => (
                    <li className="list-inline-item" key={social.id}>
                      <Link to={social.link} target="_blank" rel="noreferrer">
                        <i className={social.icon} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
              <div className="footer_qlink_widget">
                <h4>
                  <strong>Propiedades</strong>
                </h4>
                <div className="d-flex">
                  <ul className="list-unstyled">
                    {propLinks.map((prop) => (
                      <li key={prop.label}>
                        <Link to={prop.link} target="_blank" rel="noreferrer">
                          {prop.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-3 col-lg-2 col-xl-3">
              <div className="footer_qlink_widget">
                <h4>
                  <strong>Enlaces Rápidos</strong>
                </h4>
                <ul className="list-unstyled">
                  <li>
                    <Link to="/nosotros">Sobre nosotros</Link>
                  </li>
                  <li>
                    <Link to="#">Términos y condiciones</Link>
                  </li>
                  <li>
                    <Link to="#">Atención al cliente</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">
              <div className="footer_social_widget">
                <h4>
                  <strong>Subscribirse</strong>
                </h4>
                <p className="text-white mb30">
                  No te preocupes, no te vamos a mandar spam.
                </p>
                <form className="footer_mailchimp_form" onSubmit={HandleSubmit}>
                  <div className="form-row align-items-center">
                    <div className="col-auto">
                      <input
                        type="email"
                        className="form-control"
                        id="inlineFormInput"
                        placeholder="Ingresa tu email"
                      />
                      <button
                        type="submit"
                        className="flaticon-email d-flex align-items-center"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="container pt10 pb30">
          <div className="row">
            <div className="col-md-4 col-lg-4">
              <div className="copyright-widget mt10 mb15-767">
                <p>Copyright © 2023 Todos los derechos reservados.</p>
                {version ? (
                  <p>{`Client v0.5.1 - Server v${version}`}</p>
                ) : (
                  <p>{`Client v0.5.1`}</p>
                )}
              </div>
            </div>
            <div className="col-md-4 col-lg-4">
              <div className="footer_logo_widget text-center mb15-767">
                <div className="wrapper">
                  <div className="logo text-center">
                    <img
                      style={{ maxWidth: 120 }}
                      src="assets/logos/logo_cpi_footer.png"
                      className="logo1 img-fluid"
                      alt="footer-logo.svg"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-lg-4">
              <div className="footer_menu_widget text-right tac-md mt15">
                <ul>
                  <li className="list-inline-item">
                    <Link to="/">Políticas de privacidad</Link>
                  </li>
                  <li className="list-inline-item">
                    <Link to="/">Políticas de cookies</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div
        className="scrollToHome"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{ cursor: "pointer" }}
      >
        <i className="fa fa-angle-up" />
      </div>
    </>
  );
};

export default Footer;
