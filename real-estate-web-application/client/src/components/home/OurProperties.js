import React from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { useNavigate } from "react-router-dom";

const OurProperties = ({operation}) => {
  const navigate = useNavigate()
  
  const handleNavigate = (oper, property) => {
    if(property){
      navigate(
        `/propiedades/${oper}-${property}`
      );
    }else{
      navigate(
        `/propiedades/temporario`
      );
    }
  };  
  return (
    <section className="property-city pb70">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="main-title text-center">
              <h1>Buscá el mejor lugar</h1>
              <p>
                Encontrá la propiedad que estás buscando para vos, tu familia o
                tu emprendiento
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="feature_place_home2_slider">
              <OwlCarousel className="owl-theme" items={5} loop margin={30} nav>
                <div className="item" onClick={()=>handleNavigate(operation, "casa")}>
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
                        <h4>
                          <a>Casa</a>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item" onClick={()=>handleNavigate(operation, "departamento")}>
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
                        <h4>
                          <a>Departamento</a>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item" onClick={()=>handleNavigate(operation, "oficina")}>
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
                        <h4>
                          <a>Oficina</a>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item" onClick={()=>handleNavigate(operation)}>
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
                        <h4>
                          <a>Emprendimiento</a>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item" onClick={()=>handleNavigate(operation)}>
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
                        <h4>
                          <a>Temporal</a>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </OwlCarousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurProperties;
