import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/Footer";
import BasicInformation from "../components/singleProperty/BasicInformation";
import Contact from "../components/singleProperty/Contact";
import Details from "../components/singleProperty/Details";
import Extras from "../components/singleProperty/Extras";
import Map from "../components/singleProperty/Map";
import Pictures from "../components/singleProperty/Pictures";
import Videos from "../components/singleProperty/Videos";
import { getPropById } from "../redux/propertiesSlice";
import PropertiesCarousel from "../components/home/PropertiesCarousel";
import { useLocation } from "react-router-dom";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
// import "react-image-lightbox/style.css"; // This only needs to be imported once in your app

const SingleProperty = () => {
  // * States
  const dispatch = useDispatch();
  const data = useSelector((state) => state.properties.singleProperty);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [isLoading, setIsLoading] = useState(true);

  // * Methods
  const FetchData = async () => {
    await dispatch(getPropById(id));
    setIsLoading(false);
  };

  // * Life Cycle
  useEffect(() => {
    FetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   data && console.log(data);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data]);

  return (
    <div className="wrapper">
      {isLoading && <div className="preloader" />}
      {data && data.status === "published" && !isLoading && (
        <>
          <Pictures id={id} />
          <section className="our-agent-single pt0 pb70">
            <div className="container">
              <div className="row">
                <div className="col-md-12 col-lg-9">
                  <div className="row">
                    <BasicInformation />
                    <Map />
                    {data.property_type === 4 && <Details />}
                    <Extras />
                    <Videos />
                  </div>
                </div>
                <div className="col-lg-4 col-xl-3">
                  <Contact property={data} />
                </div>
              </div>
            </div>
          </section>
          <Footer />
        </>
      )}
      {data?.status !== "published" && !isLoading && (
        <div className="mt100">
          <h1 className="d-flex justify-content-center align-items-center">
            Esta propiedad no se encuentra disponible
          </h1>
          <PropertiesCarousel page="error" />
          <Footer />
        </div>
      )}
    </div>
  );
};
export default SingleProperty;
