import React from "react";

const WhyChooseUs = () => {
  return (
    <section id="why-chose" className="whychose_us bgc-alice-blue pb70">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="main-title text-center">
              <h1>¿Por qué confiar en nosotros?</h1>
              <p>Buscá con tranquilidad, invertí con seguridad</p>
            </div>
          </div>
        </div>
        <div
          className="row d-flex justify-content-center"
          style={{ rowGap: "30px" }}
        >
          <div className="col-md-6 col-xl-3">
            <div className="why_chose_us">
              <div className="icon">
                {" "}
                <span className="flaticon-discord"></span>{" "}
              </div>
              <div className="details">
                <h4>Tranquilidad</h4>
                <p>
                  El sitio número 1 de compra y alquileres de Capital Federal,
                  con más de 50.000 transacciones realizadas.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="why_chose_us">
              <div className="icon">
                {" "}
                <span className="flaticon-house"></span>{" "}
              </div>
              <div className="details">
                <h4>Confianza</h4>
                <p>
                  Todos los inmuebles publicados son de inmobiliarias
                  verificadas por el Colegio de Corredores Inmobiliarios de
                  Buenos Aires.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3">
            <div className="why_chose_us">
              <div className="icon">
                {" "}
                <span className="flaticon-calculator"></span>{" "}
              </div>
              <div className="details">
                <h4>Seguridad</h4>
                <p>
                  Más de 10 años en el mercado nos respaldan para ayudarte en la
                  búsqueda de tu nuevo hogar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
