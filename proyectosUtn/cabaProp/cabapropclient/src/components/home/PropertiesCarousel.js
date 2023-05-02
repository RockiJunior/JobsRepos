import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecommendedProperties } from "../../redux/propertiesSlice";
import { getFavorites } from "../../redux/favoritesSlice";
import ListComponent from "../propertiesList/ListComponent";
/* import OwlCarousel from "react-owl-carousel"; */

const PropertiesCarousel = () => {
  const [isLoadingProps, setIsLoadingProps] = useState(true);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.properties.recommendedProperties);
  const userLogged = useSelector((state) => state.login.currentUser);

  const FetchData = async () => {
    setIsLoadingProps(true);
    const body = {
      operationType: 1,
      propertyTypes: [],
      barrios: [],
    };
    if (userLogged) {
      dispatch(getFavorites(userLogged.id, 0));
    }
    await dispatch(getRecommendedProperties(body));
    setIsLoadingProps(false);
  };

  useEffect(() => {
    FetchData();
    //eslint-disable-next-line
  }, [userLogged]);

  return (
    <div className="my-5">
      {/* <section id="feature-property" className="feature-property"> */}
      {!data ? (
        <div className="preloader" />
      ) : (
        <>
          <div
            className="row justify-content-center"
            style={{ display: "flex" }}
          >
            <div className="col-lg-8">
              <div className="main-title text-center">
                <h1>Propiedades según tus preferencias</h1>
                <p>Basado en tus últimas búsquedas</p>
              </div>
            </div>
          </div>

          <div className="d-flex my-3 flex-row justify-content-center">
            <div
              className="row justify-content-center"
              style={{ width: "85%" }}
            >
              {data.result.map((prop, i) => (
                <ListComponent
                  prop={prop}
                  key={i}
                  isLoadingProps={isLoadingProps}
                  insideOwl={true}
                />
              ))}
            </div>
            {/* <div className="col-lg-12">
              <div className="popular_listing_slider1">
                <OwlCarousel
                  className="owl-theme"
                  items={4}
                  loop
                  margin={20}
                  nav
                >
                  {data.result.map((prop, i) => (
                    <ListComponent
                      prop={prop}
                      key={i}
                      favorite={favorite}
                      isLoadingProps={isLoadingProps}
                      insideOwl={true}
                    />
                  ))}
                </OwlCarousel> 
              </div>
            </div>*/}
          </div>
        </>
      )}
      {/* </section> */}
    </div>
  );
};

export default PropertiesCarousel;
