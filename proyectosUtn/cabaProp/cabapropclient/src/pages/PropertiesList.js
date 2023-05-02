import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Filters from "../components/propertiesList/Filters";
import ListHeader from "../components/propertiesList/ListHeader";
import Pagination from "../components/propertiesList/Pagination";
import { getProperties } from "../redux/propertiesSlice";
import {
  barrios,
  operations,
  properties,
  price,
  ambiences,
  bathrooms,
  apartmentExtras,
  bedrooms,
  garages,
  surface,
} from "../components/models/searchInfo";
import { UrlBuilder } from "../utils";
import { initialFilters } from "../components/home/Banner";
import RealEstateCard from "../components/realEstateList/RealEstateCard";

const PropertiesList = () => {
  // * Hooks
  const dispatch = useDispatch();
  const realEstate = useSelector((state) => state.realEstates.singleRealEstate);
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  // * States
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProps, setIsLoadingProps] = useState(true);
  const [queries, setQueries] = useState();
  const [filters, setFilters] = useState();
  const [estateName, setEstateName] = useState();
  const [isOpen, setIsOpen] = useState(false);

  // * Methods
  const GenerateQueryBody = () => {
    // Setting page
    const page = new URLSearchParams(location.search).get("page");
    if (page) setQueries({ page });
    else setQueries({ page: 1 });

    // Setting real estate if exists
    if (params.realestate) setEstateName(params.realestate);

    // Building the query based on URL
    const pathname = location.pathname.split("/")[2].split("-");
    let allParams = { ...initialFilters };

    const findOperation = operations.find(
      (prop) => prop.label.toLowerCase() === pathname[0].toLowerCase()
    );
    if (findOperation) allParams = { ...allParams, operation: findOperation };

    for (let i in pathname) {
      const findProperty = properties.find(
        (prop) => prop.tag === pathname[i].toLowerCase()
      );
      if (findProperty)
        allParams = {
          ...allParams,
          property: [...allParams.property, findProperty],
        };

      const findBarrio = barrios.find(
        (prop) => prop.tag === pathname[i].toLowerCase()
      );
      if (findBarrio)
        allParams = {
          ...allParams,
          location: [...allParams.location, findBarrio],
        };

      let findPrice = price.find(
        (prop) => prop.tag === pathname[i].split("_")[0]
      );

      if (findPrice) {
        const price = pathname[i].split("_");

        if (findPrice.currency === "ARS") {
          const minIndex = price.findIndex((el) => el === "desde");
          if (minIndex !== -1) {
            const min = Number(price[minIndex + 1]);
            if (!isNaN(min)) findPrice = { ...findPrice, min: Math.trunc(min) };
          }
          const maxIndex = price.findIndex((el) => el === "hasta");
          if (maxIndex !== -1) {
            const max = Number(price[maxIndex + 1]);
            if (!isNaN(max)) findPrice = { ...findPrice, max: Math.trunc(max) };
          }
          allParams = {
            ...allParams,
            price: {
              main: "ARS",
              currencyARS: {
                ...findPrice,
              },
              currencyUSD: {
                currency: "USD",
                min: Math.trunc(Number(findPrice.min / 200)),
                max: Math.trunc(Number(findPrice.max / 200)),
                tag: "dolares",
              },
            },
          };
        } else {
          const minIndex = price.findIndex((el) => el === "desde");
          if (minIndex !== -1) {
            const min = Number(price[minIndex + 1]);
            if (!isNaN(min)) findPrice = { ...findPrice, min: Math.trunc(min) };
          }
          const maxIndex = price.findIndex((el) => el === "hasta");
          if (maxIndex !== -1) {
            const max = Number(price[maxIndex + 1]);
            if (!isNaN(max)) findPrice = { ...findPrice, max: Math.trunc(max) };
          }

          allParams = {
            ...allParams,
            price: {
              main: "USD",
              currencyUSD: {
                ...findPrice,
              },
              currencyARS: {
                currency: "ARS",
                min: Math.trunc(Number(findPrice.min * 200)),
                max: Math.trunc(Number(findPrice.max * 200)),
                tag: "pesos",
              },
            },
          };
        }
      }

      let findSurface = surface.find(
        (prop) => prop.tag === pathname[i].split("_")[0]
      );

      if (findSurface) {
        const surface = pathname[i].split("_");
        const min = surface.findIndex((el) => el === "desde");
        if (min !== -1) findSurface = { ...findSurface, min: surface[min + 1] };
        const max = surface.findIndex((el) => el === "hasta");
        if (max !== -1) findSurface = { ...findSurface, max: surface[max + 1] };

        allParams = {
          ...allParams,
          surface: findSurface,
        };
      }

      let findAmbiences = ambiences.find(
        (prop) =>
          prop.tag === pathname[i].split("_")[0] &&
          String(prop.value) === pathname[i].split("_")[1]
      );
      if (findAmbiences) {
        allParams = {
          ...allParams,
          ambiences: findAmbiences,
        };
      }

      let findBathrooms = bathrooms.find(
        (prop) =>
          prop.tag === pathname[i].split("_")[0] &&
          String(prop.value) === pathname[i].split("_")[1]
      );
      if (findBathrooms) {
        allParams = {
          ...allParams,
          bathRooms: findBathrooms,
        };
      }

      let findBedrooms = bedrooms.find(
        (prop) =>
          prop.tag === pathname[i].split("_")[0] &&
          String(prop.value) === pathname[i].split("_")[1]
      );
      if (findBedrooms) {
        allParams = {
          ...allParams,
          bedRooms: findBedrooms,
        };
      }

      let findGarages = garages.find(
        (prop) =>
          prop.tag === pathname[i].split("_")[0] &&
          String(prop.value) === pathname[i].split("_")[1]
      );
      if (findGarages) {
        allParams = {
          ...allParams,
          garages: findGarages,
        };
      }

      let findExtraGeneral = apartmentExtras.caracteristicasGenerales.find(
        (prop) => prop.label === pathname[i]
      );
      if (findExtraGeneral) {
        allParams = {
          ...allParams,
          extras: [...allParams.extras, findExtraGeneral.id],
        };
      }

      let findExtraCharac = apartmentExtras.caracteristicas.find(
        (prop) => prop.label === pathname[i]
      );
      if (findExtraCharac) {
        allParams = {
          ...allParams,
          extras: [...allParams.extras, findExtraCharac.id],
        };
      }

      let findExtraServices = apartmentExtras.servicios.find(
        (prop) => prop.label === pathname[i]
      );
      if (findExtraServices) {
        allParams = {
          ...allParams,
          extras: [...allParams.extras, findExtraServices.id],
        };
      }

      let findExtraAmbiences = apartmentExtras.ambientes.find(
        (prop) => prop.label === pathname[i]
      );
      if (findExtraAmbiences) {
        allParams = {
          ...allParams,
          extras: [...allParams.extras, findExtraAmbiences.id],
        };
      }
    }

    setFilters(allParams);
    // console.log("allParams: ", allParams);
  };

  const fetchData = async () => {
    if (filters) {
      setIsLoadingProps(true);
      let propertiesIds = [];
      let barriosIds = [];

      filters.property.map(
        (prop) => (propertiesIds = [...propertiesIds, prop.value])
      );
      filters.location.map(
        (prop) => (barriosIds = [...barriosIds, prop.value])
      );

      const body = {
        operationType: filters.operation.value,
        propertyTypes: propertiesIds,
        barrios: barriosIds,
        price: filters.price,
        surface: filters.surface,
        ambiences: filters.ambiences.value || 0,
        bathRooms: filters.bathRooms.value || 0,
        bedRooms: filters.bedRooms.value || 0,
        garages: filters.garages.value || 0,
        extras: filters.extras,
      };
      // console.log("Mando un nuevo body ", body);
      // console.log("Mando este id: ", realEstate?.id);
      await dispatch(
        getProperties(body, queries.page, estateName && realEstate?.id)
      );
      setIsLoading(false);
      setIsLoadingProps(false);
    }
  };

  const Navigate = () => {
    if (filters) {
      const url = UrlBuilder(filters, queries.page, estateName);
      navigate(url);
      fetchData();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const HandleOverflow = () => {
    setIsOpen(!isOpen);
    document.querySelector("html").classList.toggle("overflow-hidden");
    document.querySelector(".props-filter").scrollTo({ top: 0 });
  };

  // * Life Cycle
  useEffect(() => {
    document.body.classList.remove("modal-open");
    GenerateQueryBody();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // console.log("FILTERS: ", filters);
    // eslint-disable-next-line
  }, [filters]);

  useEffect(() => {
    queries && filters && Navigate();
    // eslint-disable-next-line
  }, [queries, filters]);

  return (
    <div className="wrapper">
      {isLoading ? (
        <div className="preloader" />
      ) : (
        <>
          <section className="our-listing pb30-991">
            <div className="container">
              {estateName && realEstate && (
                <RealEstateCard
                  estate={realEstate}
                  showLink={false}
                  showBranches={false}
                />
              )}
              <div className="row">
                <div className="col-lg-8 col-xl-9 order-2">
                  <button
                    className="btn btn-primary my-4 filters-button"
                    onClick={() => HandleOverflow()}
                  >
                    Mostrar filtros
                  </button>
                  <ListHeader page={queries.page} />
                  <Pagination
                    itemsPerPage={10}
                    setQueries={setQueries}
                    queries={queries.page - 1}
                    location={location}
                    isLoadingProps={isLoadingProps}
                    HandleOverflow={HandleOverflow}
                  />
                </div>
                <div className="col-md-6 col-lg-4 col-xl-3 order-1">
                  {isOpen && <div className="blur-overlay" />}
                  <Filters
                    filters={filters}
                    setFilters={setFilters}
                    setQueries={setQueries}
                    isOpen={isOpen}
                    HandleOverflow={HandleOverflow}
                  />
                </div>
              </div>
            </div>
          </section>
          <Footer />
        </>
      )}
    </div>
  );
};

export default PropertiesList;
