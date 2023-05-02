import { useEffect } from "react";
import Footer from "../components/Footer";

const About = () => {
  // * Life Cycle
  useEffect(() => window.scrollTo({ top: 0 }), []);

  return (
    <>
      <section className="about-section bb1 pb70">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div className="main-title text-center">
                <h2>Sobre Nosotros</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="about_thumb mb30-smd">
                <img
                  className="img-fluid w100"
                  src="images/about/2.jpg"
                  alt="2.jpg"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about_content">
                <p className="large">
                  Mauris ac consectetur ante, dapibus gravida tellus. Nullam
                  aliquet eleifend dapibus. Cras sagittis, ex euismod lacinia
                  tempor.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Quisque quis ligula eu lectus vulputate porttitor sed feugiat
                  nunc. Mauris ac consectetur ante, dapibus gravida tellus.
                  Nullam aliquet eleifend dapibus. Cras sagittis, ex euismod
                  lacinia tempor, lectus orci elementum augue, eget auctor metus
                  ante sit amet velit.
                </p>
                <p>
                  Maecenas quis viverra metus, et efficitur ligula. Nam congue
                  augue et ex congue, sed luctus lectus congue. Integer
                  convallis condimentum sem. Duis elementum tortor eget
                  condimentum tempor. Praesent sollicitudin lectus ut pharetra
                  pulvinar. Donec et libero ligula. Vivamus semper at orci at
                  placerat.Placeat Lorem ipsum dolor sit amet, consectetur
                  adipisicing elit. Quod libero amet, laborum qui nulla quae
                  alias tempora.
                </p>
                <p>
                  That’s why we go beyond the typical listings, by sourcing
                  insights straight from locals and offering over 34
                  neighborhood map overlays, to give people a deeper
                  understanding of what living in a home and neighborhood is
                  really like.
                </p>
              </div>
            </div>
          </div>
          <div className="row mt50">
            <div className="col-md-6 col-lg-3">
              <div className="funfact_one text-center">
                <div className="details">
                  <div className="timer text-thm">66.180</div>
                  <p className="ff_title">Homes for sale</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="funfact_one text-center">
                <div className="details">
                  <div className="timer text-thm">4.809</div>
                  <p className="ff_title">Open houses</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="funfact_one text-center">
                <div className="details">
                  <div className="timer text-thm">30.469</div>
                  <p className="ff_title">Recently sold</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
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
      <Footer />
    </>
  );
};

export default About;
