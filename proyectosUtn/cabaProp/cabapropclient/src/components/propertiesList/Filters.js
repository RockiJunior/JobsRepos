import React, { useState } from "react";
import Select from "react-select";
import { barrios, operations, properties } from "../models/searchInfo";
import { addSearch } from "../../redux/searchesSlice";
import { useDispatch } from "react-redux";
import { Modal } from "react-responsive-modal";
import AdvancedSearch from "./AdvancedSearch";
import { Formik, Form } from "formik";
import { filterSchema } from "../../utils/validations/validationSchema";
import { initialFilters } from "../home/Banner";
import { useLocation } from "react-router-dom";
import { GenerateTags } from "../../utils/tags.utils";
import { useSelector } from "react-redux";

const Filters = ({
  filters,
  setFilters,
  setQueries,
  isOpen,
  HandleOverflow,
}) => {
  // * States
  const [showModal, setShowModal] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [errorSearch, setErrorSearch] = useState(false);
  const userLogged = useSelector((state) => state.login.currentUser);

  const initialValues = {
    radioSurface: "totalSurface",
    minSurface: "",
    maxSurface: "",
    radioCurrency: "ARS",
    minPrice: "",
    maxPrice: "",
    extras: [],
  };

  // * Hooks
  const dispatch = useDispatch();
  const location = useLocation();

  // * Methods
  const HandleSaveSearch = () => {
    const tags = GenerateTags(filters);

    if (!errorSearch) {
      dispatch(
        addSearch(userLogged.id, {
          path: location.pathname,
          name: searchName,
          tags,
        })
      );
      setShowModal(false);
    }
  };

  const HandleReset = (setValues) => {
    const resetedFilters = {
      ...initialFilters,
      operation: filters.operation,
      property: filters.property,
      location: filters.location,
    };
    setFilters(resetedFilters);
    setValues(initialValues);
  };

  const OpenModal = async () => {
    if (userLogged) {
      setShowModal(true);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          radioSurface: filters.surface.type,
          minSurface: filters.surface.min || "",
          maxSurface: filters.surface.max || "",
          radioCurrency:
            filters.price.main === "ARS"
              ? filters.price.currencyARS.currency
              : filters.price.currencyUSD.currency,
          minPrice:
            filters.price.main === "ARS"
              ? filters.price.currencyARS.min
              : filters.price.currencyUSD.min,
          maxPrice:
            filters.price.main === "ARS"
              ? filters.price.currencyARS.max
              : filters.price.currencyUSD.max,
          extras: filters.extras.map((extra) => String(extra)),
        }}
        validationSchema={filterSchema}
      >
        {({ handleSubmit, errors, touched, values, setValues }) => (
          <Form onSubmit={(values) => handleSubmit(values)}>
            <div
              className={`props-filter ${
                isOpen ? "active" : ""
              } sidebar_listing_grid1 mb30`}
            >
              <div className="sidebar_listing_list">
                <div className="sidebar_advanced_search_widget">
                  <ul className="sasw_list mb0">
                    <li>
                      {isOpen && (
                        <button
                          className="btn btn-primary"
                          onClick={() => HandleOverflow()}
                        >
                          Ocultar filtros
                        </button>
                      )}
                    </li>
                    <li>
                      <h4 className="mb0">Encontrá tu nuevo hogar</h4>
                    </li>
                    <li>
                      <div className="search_option_two">
                        <div className="sidebar_select_options">
                          <Select
                            menuPortalTarget={document.body}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                            className="basic-single"
                            classNamePrefix="select"
                            options={operations}
                            placeholder="Tipo de operación"
                            value={filters.operation}
                            onChange={(e) => {
                              setFilters({ ...filters, operation: e });
                              setQueries({ page: 1 });
                            }}
                          />
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="search_option_two">
                        <div className="sidebar_select_options">
                          <Select
                            isMulti
                            menuPortalTarget={document.body}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            options={properties}
                            placeholder="Tipo de propiedad"
                            value={filters.property}
                            onChange={(e) => {
                              setFilters({ ...filters, property: e });
                              setQueries({ page: 1 });
                            }}
                          />
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="search_option_two">
                        <div className="sidebar_select_options">
                          <Select
                            isMulti
                            menuPortalTarget={document.body}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                            options={barrios}
                            value={filters.location}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Seleccionar barrios"
                            onChange={(e) => {
                              setFilters({ ...filters, location: e });
                              setQueries({ page: 1 });
                            }}
                          />
                        </div>
                      </div>
                    </li>
                    <li>
                      <h4>Filtros</h4>
                    </li>
                    <AdvancedSearch
                      errors={errors}
                      touched={touched}
                      filters={filters}
                      setFilters={setFilters}
                      values={values}
                      setQueries={setQueries}
                    />
                    <li className="mb0">
                      <div className="search_option_button text-center mt25">
                        <ul className="ul-clear-save mb0">
                          <li
                            className="list-inline-item mb0 cursor-pointer"
                            onClick={() => HandleReset(setValues)}
                          >
                            <span className="vam flaticon-return mr10" />
                            Limpiar filtros
                          </li>
                          <li
                            className="list-inline-item cursor-pointer"
                            onClick={OpenModal}
                            data-toggle={!userLogged && "modal"}
                            data-target={!userLogged && "#logInModal"}
                          >
                            <span className="vam flaticon-heart-shape-outline mr10" />
                            Guardar búsqueda
                          </li>
                          <li className="mb0">
                            {isOpen && (
                              <button
                                className="btn btn-primary"
                                style={{ height: "38px" }}
                                onClick={() => HandleOverflow()}
                              >
                                Ocultar filtros
                              </button>
                            )}
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <Modal
        center
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setErrorSearch(false);
          setSearchName("");
        }}
      >
        <div className="modal-header">
          <h4 className="modal-title">Crear Nueva Búsqueda</h4>
        </div>
        <div className="modal-body">
          <div className="">
            <div className="">
              <div className="col-lg-12">
                <p>Elegí un nombre personalizado para tu búsqueda guardada:</p>
                <input
                  style={{
                    border: `1px solid ${
                      errorSearch ? "red" : "rgba(0,0,0,.3)"
                    }`,
                  }}
                  className="w-100 p-2 rounded"
                  type="text"
                  value={searchName}
                  onChange={(e) => {
                    setSearchName(e.target.value);
                    setErrorSearch(false);
                  }}
                  onBlur={() =>
                    (!searchName.trim() || searchName.length > 60) &&
                    setErrorSearch(true)
                  }
                />
                {errorSearch && (
                  <p style={{ color: "red" }}>
                    {!searchName.trim()
                      ? "Este campo es obligatorio"
                      : "Máximo 60 caracteres"}
                  </p>
                )}

                <button
                  className="btn btn-block btn-thm mt-3"
                  onClick={() => userLogged && HandleSaveSearch()}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Filters;
