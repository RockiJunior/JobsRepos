import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { Link } from "react-router-dom";

const OurProperties = () => {
  return (
    <section className="property-city pb70">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="main-title text-center">
              <h1>Buscá el mejor lugar</h1>
              <p>
                Encontrá la propiedad que estás buscando para vos, tu familia, o
                tu emprendiento
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="feature_place_home2_slider">
              <OwlCarousel className="owl-theme" items={5} loop margin={30} nav>
                <Link
                  to="/propiedades/alquiler-casa"
                  target="_blank"
                  rel="noreferrer"
                  className="item"
                >
                  <div className="properti_city">
                    <div className="thumb">
                      <img
                        className="img-fluid w100 img__props-card"
                        src="assets/images/property/house.jpg"
                        alt="ep1.jpg"
                      />
                    </div>
                    <div className="overlay">
                      <div className="details">
                        <h4>Casa</h4>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link
                  to="/propiedades/alquiler-departamento"
                  target="_blank"
                  rel="noreferrer"
                  className="item"
                >
                  <div className="properti_city">
                    <div className="thumb">
                      <img
                        className="img-fluid w100 img__props-card"
                        src="assets/images/property/building.jpg"
                        alt="ep2.jpg"
                      />
                    </div>
                    <div className="overlay">
                      <div className="details">
                        <h4>Departamento</h4>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link
                  to="/propiedades/alquiler-oficina_comercial"
                  target="_blank"
                  rel="noreferrer"
                  className="item"
                >
                  <div className="properti_city">
                    <div className="thumb">
                      <img
                        className="img-fluid w100 img__props-card"
                        src="assets/images/property/office.jpg"
                        alt="ep3.jpg"
                      />
                    </div>
                    <div className="overlay">
                      <div className="details">
                        <h4>Oficina</h4>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link
                  to="/propiedades/alquiler-fondo%20de%20comercio"
                  target="_blank"
                  rel="noreferrer"
                  className="item"
                >
                  <div className="properti_city">
                    <div className="thumb">
                      <img
                        className="img-fluid w100 img__props-card"
                        src="assets/images/property/emprendimiento.jpg"
                        alt="ep4.jpg"
                      />
                    </div>
                    <div className="overlay">
                      <div className="details">
                        <h4>Fondo de comercio</h4>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link
                  to="/propiedades/alquiler-ph"
                  target="_blank"
                  rel="noreferrer"
                  className="item"
                >
                  <div className="properti_city">
                    <div className="thumb">
                      <img
                        className="img-fluid w100 img__props-card"
                        src="assets/images/property/temporal.jpg"
                        alt="ep.jpg"
                      />
                    </div>
                    <div className="overlay">
                      <div className="details">
                        <h4>PH</h4>
                      </div>
                    </div>
                  </div>
                </Link>
              </OwlCarousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurProperties;
