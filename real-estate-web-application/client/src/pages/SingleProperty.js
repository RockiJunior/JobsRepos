import React, { useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import Map from "../components/singleProperty/Map";
import Pictures from "../components/singleProperty/Pictures";
import BasicInformation from "../components/singleProperty/BasicInformation";
import Details from "../components/singleProperty/Details";
import Extras from "../components/singleProperty/Extras";
import Videos from "../components/singleProperty/Videos";
import Contact from "../components/singleProperty/Contact";
import { useDispatch, useSelector } from "react-redux";
import { getPropById } from "../redux/propertiesSlice";
import Footer from "../components/Footer";
// import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import PropertiesCarousel from "../components/home/PropertiesCarousel";

const SingleProperty = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.properties.singleProperty);
  const favorite = useSelector((state) => state.favorites.favorites);
  const userLogged = useSelector((state) => state.login.currentUser);
  //eslint-disable-next-line
  const id = location.pathname.split("/")[2];
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = () => {
    dispatch(getPropById(id));
  };

  useEffect(() => {
    fetchData();
    setIsLoading(false);
  }, []);

  return (
    <div className="wrapper">
      {isLoading && <div className="preloader"></div>}
      {data && data.status === "published" && !isLoading && (
        <>
          <Pictures
            data={data}
            id={id}
            favorite={favorite}
            userLogged={userLogged}
          />
          <section className="our-agent-single pt0 pb70">
            <div className="container">
              <div className="row">
                <div className="col-md-12 col-lg-9">
                  <div className="row">
                    <BasicInformation data={data} />
                    <Map location={data.location}/>

                    <Details data={data} />
                    {/* <Extras data={data} /> */}
                    <Videos data={data} />
                  </div>
                </div>
                    <div className="col-lg-4 col-xl-3">
                <Contact userLogged={userLogged} property={data}/>
                </div>
              </div>
            </div>
          </section>
          <Footer />
        </>
      )}
            {data && data.status !== "published" && !isLoading && (
              <div className="mt100">
              <h1 className="d-flex justify-content-center align-items-center">Esta propiedad no se encuentra disponible</h1>
              <PropertiesCarousel page="error"/>
              <Footer/>
              </div>
            )}

    </div>
  );
};
export default SingleProperty;
