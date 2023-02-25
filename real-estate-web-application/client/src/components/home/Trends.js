import React from "react";

const Trends = () => {
  return (
    <>
      <section
        className="divider home-style1 parallax"
        data-stellar-background-ratio="0.2"
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="business_exposer text-center">
                <p className="fz16 text-uppercase text-white fw500">TRENDS</p>
                <h2 className="title text-white mb20">
                  Vermont Farmhouse With Antique Jail Is the Week's Most Popular
                  Home
                </h2>
                <a className="btn exposer_btn" href="#">
                  READ MORE
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="our-funfact bb1 pt60 pb30">
        <div className="container">
          <div className="row">
            <div className="col-sm-6 col-lg-3">
              <div className="funfact_one text-center">
                <div className="details">
                  <div className="timer text-thm">66.180</div>
                  <p className="ff_title">Homes for sale</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="funfact_one text-center">
                <div className="details">
                  <div className="timer text-thm">4.809</div>
                  <p className="ff_title">Open houses</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="funfact_one text-center">
                <div className="details">
                  <div className="timer text-thm">30.469</div>
                  <p className="ff_title">Recently sold</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="funfact_one text-center">
                <div className="details">
                  <div className="timer text-thm">2.919</div>
                  <p className="ff_title">Price reduced</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Trends;
