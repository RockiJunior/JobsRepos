import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import Select from "react-select";
import { barrios, operations, properties } from "./searchInfo";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import FiltersMoblie from "../components/propertiesList/FiltersMobile";
import Footer from "../components/Footer";
import Filters from "../components/propertiesList/Filters";
import Pagination from "../components/propertiesList/Pagination";
import ListHeader from "../components/propertiesList/ListHeader";
import { useDispatch, useSelector } from "react-redux";
import { getProperties } from "../redux/propertiesSlice";

const PropertiesList = () => {
  const location = useLocation();
  const pathname = location.pathname.split("/")[2].split("-");
  let operationParams = 0;
  let propertyParams = [];
  let barrioParams = [];
  const dispatch = useDispatch();
  const data = useSelector((state) => state.properties.properties);
  const favorite = useSelector((state) => state.favorites.favorites);
  const userLogged = useSelector((state) => state.login.currentUser);
  const [range, setRange] = useState({ min: 0, max: 100 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [queries, setQueries] = useState({
    page: searchParams.get("page"),
  });

  for (let i = 0; i < pathname.length; i++) {
    const findOperation = operations.find(
      (prop) =>
        prop.label.toLocaleLowerCase() === pathname[i].toLocaleLowerCase()
    );
    if (findOperation) operationParams = findOperation;
    const findProperty = properties.find(
      (prop) => prop.tag === pathname[i].toLocaleLowerCase()
    );
    if (findProperty) propertyParams.push(findProperty);
    const findBarrio = barrios.find(
      (prop) => prop.tag === pathname[i].toLocaleLowerCase()
    );
    if (findBarrio) barrioParams.push(findBarrio);
  }
  const fetchData = () => {
    const propertiesIds = [];
    const barriosIds = [];
    for (let i = 0; i < propertyParams.length; i++) {
      propertiesIds.push(propertyParams[i].value);
    }
    for (let i = 0; i < barrioParams.length; i++) {
      barriosIds.push(barrioParams[i].value);
    }
    const body = {
      operationType: operationParams.value,
      propertyTypes: propertiesIds,
      barrios: barriosIds,
    };
    dispatch(getProperties(body, queries.page));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="wrapper">
      {isLoading && <div className="preloader"></div>}
      {data && !isLoading &&
        <>
          <section className="our-listing pb30-991">
            <div className="container">
              <FiltersMoblie />
              <div className="row">
                <Filters
                  range={range}
                  setRange={setRange}
                  userLogged={userLogged}
                  operationParams={operationParams}
                  propertyParams={propertyParams}
                  barrioParams={barrioParams}
                  fetchData={fetchData}
                />
                <div className="col-xl-9">
                  <ListHeader data={data} />
                  <Pagination
                    data={data}
                    itemsPerPage={10}
                    queries={queries}
                    setQueries={setQueries}
                    fetchData={fetchData}
                    favorite={favorite}
                    userLogged={userLogged}
                    location={location}
                  />
                </div>
              </div>
            </div>
          </section>
          <Footer />
        </>
      }
    </div>
  );
};

export default PropertiesList;
