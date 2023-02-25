import React from "react";
import { properties } from "../pages/searchInfo";

const Footer = () => {
  return (
    <>
      <section className="footer_one home1">
        <div className="container pb90">
          <div className="row">
            <div className="col-sm-5 col-md-5 col-lg-3 col-xl-2">
              <div className="footer_contact_widget">
                <h4>Contact Us</h4>
                <ul className="list-unstyled">
                  <li className="text-white df">
                    <span className="flaticon-map mr15"></span>
                    Adolfo Alsina 1382, C1088 AAJ, Buenos Aires
                  </li>
                  <li className="text-white">
                    <span className="flaticon-phone mr15"></span>
                    +54 011 4124-6060
                  </li>
                  <li className="text-white">
                    <span className="flaticon-mail-inbox-app mr15"></span>
                    info@colegioinmobiliario.org.ar
                  </li>
                </ul>
              </div>
              <div className="footer_social_widget mt20">
                <ul className="mb0">
                  <li className="list-inline-item">
                    <a href="#">
                      <i className="fa fa-facebook"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#">
                      <i className="fa fa-twitter"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#">
                      <i className="fa fa-instagram"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#">
                      <i className="fa fa-linkedin"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-sm-4 col-md-3 col-lg-2 col-xl-2 pl-5">
              <div className="footer_qlink_widget pl0">
                <h4>Propiedades</h4>
                <div className="d-flex">
                  <ul className="list-unstyled">
                    {properties.slice(0, 6).map(prop => (
                    <li key={prop.value}>
                      <a href="">{prop.plural}</a>
                    </li>
                    ))}
                  </ul>
                  <ul className="list-unstyled pl30">
                    {properties.slice(6, 12).map(prop => (
                    <li key={prop.value}>
                      <a href="">{prop.plural}</a>
                    </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-sm-5 col-md-2 col-lg-2 col-xl-2 pl-5">
              <div className="footer_qlink_widget pl0">
                <h4>Quick Links</h4>
                <ul className="list-unstyled">
                  <li>
                    <a href="#">Sobre nosotros</a>
                  </li>
                  <li>
                    <a href="#">Términos & condiciones</a>
                  </li>
                  <li>
                    <a href="#">Atención al cliente</a>
                  </li>
                  <li>
                    <a href="#">Contacto</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-sm-7 col-md-6 col-lg-3 col-xl-4">
              <div className="footer_social_widget">
                <h4>Subscribirse</h4>
                <p className="text-white mb30">
                  No te preocupes, no te vamos a mandar spam.
                </p>
                <form className="footer_mailchimp_form">
                  <div className="form-row align-items-center">
                    <div className="col-auto">
                      <input
                        type="email"
                        className="form-control"
                        id="inlineFormInput"
                        placeholder="Ingresa tu email"
                      />
                      <button type="submit" className="flaticon-email"></button>
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
              </div>
            </div>
            <div className="col-md-4 col-lg-4">
              <div className="footer_logo_widget text-center mb15-767">
                <div className="wrapper">
                  <div className="logo text-center">
                    {" "}
                    <img
                      style={{ maxWidth: 250 }}
                      src="assets/logos/logo.png"
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
                  <li className="list-inline-item">Home</li>
                  <li className="list-inline-item">Site Map</li>
                  <li className="list-inline-item">Privacy policy</li>
                  <li className="list-inline-item">Cookie Policy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <a className="scrollToHome" href="#">
        <i className="fa fa-angle-up"></i>
      </a>
    </>
  );
};

export default Footer;
