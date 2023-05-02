import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { UrlBuilder } from "../../utils";
import {
  barrios,
  properties,
  operations,
  apartmentExtras,
  price,
  ambiences,
  bathrooms,
  bedrooms,
  garages,
  surface,
} from "../models/searchInfo";
import { Formik, Form, Field } from "formik";
import { filterSchema } from "../../utils/validations/validationSchema";

export const initialFilters = {
  operation: operations[1],
  property: [],
  location: [],
  ambiences: 0,
  bathRooms: 0,
  bedRooms: 0,
  garages: 0,
  surface: {
    tag: "superficieTotal",
    type: "totalSurface",
    min: "",
    max: "",
  },
  price: {
    main: "ARS",
    currencyARS: {
      currency: "ARS",
      min: "",
      max: "",
      tag: "pesos",
    },
    currencyUSD: {
      currency: "USD",
      min: 0,
      max: 0,
      tag: "dolares",
    },
  },
  extras: [],
};

const Banner = () => {
  // * States
  const [filters, setFilters] = useState(initialFilters);
  const navigate = useNavigate();

  // * Methods
  const HandleSubmit = (e) => {
    e.preventDefault();
    const url = UrlBuilder(filters, 1);
    navigate(url);
  };

  const HandleAdvancedSubmit = (values) => {
    // e.preventDefault();
    const filtersWithExtras = {
      ...filters,
      extras: values.extras.map((extra) => Number(extra)),
    };
    const url = UrlBuilder(filtersWithExtras, 1);
    navigate(url);
  };

  return (
    <>
      <section className="home-one home1-overlay bg-home1">
        <div className="container">
          <div className="row posr">
            <div className="col-lg-12">
              <div className="home_content custom_width">
                <div
                  style={{ backgroundColor: "rgba(0,0,0,.3)" }}
                  className="home-text p20"
                >
                  <h2 className="fz40">
                    Buscá con tranquilidad, invertí con seguridad.
                  </h2>
                  <p className="fz18 color-white">
                    Todas las propiedades publicadas en este portal están bajo
                    la operatoria de
                    <br />
                    Corredores Inmobiliarios Matriculados de <b>CUCICBA</b>
                  </p>
                </div>
                <div className="home_tabs">
                  <ul
                    className="nav justify-content-center nav-tabs"
                    id="myTab2"
                  >
                    {operations.map((operation) => (
                      <li className="nav-item" key={operation.value}>
                        <div
                          className={`nav-link cursor-pointer ${
                            operation.value === filters.operation.value
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setFilters({
                              ...filters,
                              operation,
                            })
                          }
                        >
                          {operation.label}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="tab-content" id="myTabContent2">
                    <div
                      className="tab-pane fade show active"
                      id="rent"
                      role="tabpanel"
                      aria-labelledby="rent-tab"
                    >
                      <div className="home_adv_srch_opt">
                        <div className="wrapper">
                          <div className="home_adv_srch_form">
                            <form
                              className="bgc-white p20"
                              onSubmit={HandleSubmit}
                            >
                              <div className="home-search">
                                <div className="col-auto home_form_input mb15-md">
                                  <div className="form-group style2 pl10 pl0-lg">
                                    <label>PROPIEDAD</label>
                                    <div
                                      style={{ width: "100%" }}
                                      className="select-wrap style2-dropdown"
                                    >
                                      <Select
                                        isMulti
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        value={filters.property}
                                        options={properties}
                                        onChange={(e) =>
                                          setFilters({
                                            ...filters,
                                            property: e,
                                          })
                                        }
                                        placeholder="Selecionar tipo de propiedad"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-auto home_form_input mb15-md">
                                  <div className="form-group style2 pl0-lg">
                                    <label>UBICACIÓN</label>
                                    <div
                                      style={{ width: "100%" }}
                                      className="select-wrap style2-dropdown"
                                    >
                                      <Select
                                        isMulti
                                        options={barrios}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="Seleccionar barrios"
                                        value={filters.location}
                                        onChange={(e) =>
                                          setFilters({
                                            ...filters,
                                            location: e,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="col-auto home_form_adv_srch_form_btn mb20-md">
                                  <div
                                    className="adv_srch_btn dropbtn ml0-767"
                                    data-toggle="modal"
                                    data-target="#staticBackdrop"
                                  >
                                    <i className="flaticon-setting-lines mr10 mt10 mt0-md flr-520"></i>
                                    Búsqueda <br className="dn-991" /> Avanzada
                                  </div>
                                </div>
                                <div className="col-auto home_form_input2">
                                  <button
                                    type="submit"
                                    className="btn search-btn ml0-767"
                                  >
                                    <span className="fa fa-search"></span>
                                    Buscar
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        backgroundColor: "rgba(0,0,0,.3)",
                        maxWidth: 800,
                      }}
                      className="cucicba-banner"
                    >
                      <img
                        style={{ height: 60 }}
                        src="assets/logos/logo_cpi_footer.png"
                        alt=""
                      />
                      <div className="d-flex justify-content-center flex-column pl20">
                        <h4 className="text-light">
                          <b>
                            Colegio Único de Corredores Inmobiliarios de la
                            Ciudad de Buenos Aires
                          </b>
                        </h4>
                        <p className="text-light">Expertos en Propiedades</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="modal fade search_dropdown"
        id="staticBackdrop"
        data-backdrop="static"
        data-keyboard="false"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title">BÚSQUEDA AVANZADA</h6>
              <div className="closer" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">
                  <img src="/assets/images/icons/close.svg" alt="close.svg" />
                </span>
              </div>
            </div>
            <div className="modal-body">
              <div className="popup_modal_wrapper">
                <div className="container">
                  <Formik
                    initialValues={{
                      radioSurface: filters.surface.type,
                      minSurface: "",
                      maxSurface: "",
                      radioCurrency:
                        filters.price.main === "ARS"
                          ? filters.price.currencyARS.currency
                          : filters.price.currencyUSD.currency,
                      minPrice: "",
                      maxPrice: "",
                      extras: [],
                    }}
                    validationSchema={filterSchema}
                    onSubmit={(values) => HandleAdvancedSubmit(values)}
                  >
                    {({
                      handleSubmit,
                      errors,
                      touched,
                      values,
                      handleChange,
                    }) => (
                      <Form onSubmit={(values) => handleSubmit(values)}>
                        <div className="row">
                          <div className="col-12 mb30 d-flex justify-content-center">
                            {operations.map((operation) => (
                              <div className="" key={operation.value}>
                                <div
                                  className={`nav-link cursor-pointer ${
                                    operation.value === filters.operation.value
                                      ? "active"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    setFilters({
                                      ...filters,
                                      operation,
                                    })
                                  }
                                >
                                  {operation.label}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="col-lg-6 mb20">
                            <div className="adv_src_pmodal">
                              <h6 className="title">Propiedad</h6>
                              <div className="ui_kit_select_box">
                                <Select
                                  isMulti
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                  value={filters.property}
                                  options={properties}
                                  onChange={(e) =>
                                    setFilters({
                                      ...filters,
                                      property: e,
                                    })
                                  }
                                  placeholder="Selecionar tipo de propiedad"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 mb20">
                            <div className="adv_src_pmodal">
                              <h6 className="title">Ubicación</h6>
                              <div className="ui_kit_select_box">
                                <Select
                                  isMulti
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                  options={barrios}
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                  placeholder="Seleccionar barrios"
                                  value={filters.location}
                                  onChange={(e) =>
                                    setFilters({
                                      ...filters,
                                      location: e,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 mb20">
                            <div className="adv_src_pmodal">
                              <h6 className="title">Ambientes</h6>
                              <div className="ui_kit_select_box">
                                <Select
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                  className="basic-single"
                                  classNamePrefix="select"
                                  options={ambiences}
                                  placeholder="Elegir ambientes"
                                  value={filters.ambiences}
                                  onChange={(e) =>
                                    setFilters({
                                      ...filters,
                                      ambiences: e,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 mb20">
                            <div className="adv_src_pmodal">
                              <h6 className="title">Dormitorios</h6>
                              <div className="ui_kit_select_box">
                                <Select
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                  className="basic-single"
                                  classNamePrefix="select"
                                  options={bedrooms}
                                  placeholder="Elegir dormitorios"
                                  value={filters.bedRooms}
                                  onChange={(e) =>
                                    setFilters({
                                      ...filters,
                                      bedRooms: e,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 mb20">
                            <div className="adv_src_pmodal">
                              <h6 className="title">Baños</h6>
                              <div className="ui_kit_select_box">
                                <Select
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                  className="basic-single"
                                  classNamePrefix="select"
                                  options={bathrooms}
                                  placeholder="Elegir baños"
                                  value={filters.bathRooms}
                                  onChange={(e) =>
                                    setFilters({
                                      ...filters,
                                      bathRooms: e,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 mb20">
                            <div className="adv_src_pmodal">
                              <h6 className="title">Cocheras</h6>
                              <div className="ui_kit_select_box">
                                <Select
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                  className="basic-single"
                                  classNamePrefix="select"
                                  options={garages}
                                  placeholder="Elegir cocheras"
                                  value={filters.garages}
                                  onChange={(e) =>
                                    setFilters({
                                      ...filters,
                                      garages: e,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 mb30-md">
                            <div className="adv_src_pmodal">
                              <h6 className="title">Superficie (m²)</h6>
                              <div className="ui_kit_radiobox d-flex">
                                <div className="radio mr-3">
                                  <Field
                                    id="radio_one"
                                    name="radioSurface"
                                    type="radio"
                                    value={surface[1].type}
                                    onChange={(e) => {
                                      setFilters({
                                        ...filters,
                                        surface: {
                                          ...filters.surface,
                                          type: e.target.value,
                                          tag: surface[1].tag,
                                        },
                                      });
                                      handleChange(e);
                                    }}
                                  />
                                  <label htmlFor="radio_one">
                                    <span className="radio-label" />
                                    {surface[1].label}
                                  </label>
                                </div>
                                <div className="radio">
                                  <Field
                                    id="radio_two"
                                    name="radioSurface"
                                    type="radio"
                                    value={surface[0].type}
                                    onChange={(e) => {
                                      setFilters({
                                        ...filters,
                                        surface: {
                                          ...filters.surface,
                                          type: e.target.value,
                                          tag: surface[0].tag,
                                        },
                                      });
                                      handleChange(e);
                                    }}
                                  />
                                  <label htmlFor="radio_two">
                                    <span className="radio-label" />
                                    {surface[0].label}
                                  </label>
                                </div>
                              </div>
                              <div className="d-flex">
                                <div className="search_area pr-1">
                                  <div className="form-group">
                                    <Field
                                      name="minSurface"
                                      className="form-control form_control"
                                      type="text"
                                      placeholder="Desde"
                                      style={{
                                        borderColor:
                                          errors.maxSurface &&
                                          touched.maxSurface &&
                                          "red",
                                      }}
                                      value={values.minSurface}
                                      onChange={(e) => {
                                        setFilters({
                                          ...filters,
                                          surface: {
                                            ...filters.surface,
                                            min: e.target.value,
                                          },
                                        });
                                        handleChange(e);
                                      }}
                                    />
                                    {errors.minSurface && touched.minSurface ? (
                                      <div className="error">
                                        {errors.minSurface}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                                <div className="search_area pl-1">
                                  <div className="form-group">
                                    <Field
                                      className="form-control form_control"
                                      name="maxSurface"
                                      type="text"
                                      placeholder="Hasta"
                                      style={{
                                        borderColor:
                                          errors.maxSurface &&
                                          touched.maxSurface &&
                                          "red",
                                      }}
                                      value={values.maxSurface}
                                      onChange={(e) => {
                                        setFilters({
                                          ...filters,
                                          surface: {
                                            ...filters.surface,
                                            max: e.target.value,
                                          },
                                        });
                                        handleChange(e);
                                      }}
                                    />
                                    {errors.maxSurface && touched.maxSurface ? (
                                      <div className="error">
                                        {errors.maxSurface}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 mb30-md">
                            <div className="adv_src_pmodal">
                              <h6 className="title">Precio</h6>
                              <div className="ui_kit_radiobox d-flex">
                                <div className="radio mr-3">
                                  <Field
                                    id="radio_four"
                                    name="radioCurrency"
                                    type="radio"
                                    value={price[1].currency}
                                    onChange={(e) => {
                                      let curr;
                                      if (e.target.value === "ARS") {
                                        curr = {
                                          currencyARS: {
                                            ...filters.price.currencyARS,
                                            min: filters.price.currencyUSD.min,
                                            max: filters.price.currencyUSD.max,
                                          },
                                          currencyUSD: {
                                            ...filters.price.currencyUSD,
                                            min: 0,
                                            max: 0,
                                          },
                                        };
                                      } else {
                                        curr = {
                                          currencyARS: {
                                            ...filters.price.currencyARS,
                                            min: 0,
                                            max: 0,
                                          },
                                          currencyUSD: {
                                            ...filters.price.currencyUSD,
                                            min: filters.price.currencyARS.min,
                                            max: filters.price.currencyARS.max,
                                          },
                                        };
                                      }
                                      setFilters({
                                        ...filters,
                                        price: {
                                          ...filters.price,
                                          main: e.target.value,
                                          ...curr,
                                        },
                                      });
                                      handleChange(e);
                                    }}
                                  />
                                  <label htmlFor="radio_four">
                                    <span className="radio-label" />
                                    {price[1].currency}
                                  </label>
                                </div>
                                <div className="radio">
                                  <Field
                                    id="radio_three"
                                    name="radioCurrency"
                                    type="radio"
                                    value={price[0].currency}
                                    onChange={(e) => {
                                      let curr;
                                      if (e.target.value === "ARS") {
                                        curr = {
                                          currencyARS: {
                                            ...filters.price.currencyARS,
                                            min: filters.price.currencyUSD.min,
                                            max: filters.price.currencyUSD.max,
                                          },
                                          currencyUSD: {
                                            ...filters.price.currencyUSD,
                                            min: 0,
                                            max: 0,
                                          },
                                        };
                                      } else {
                                        curr = {
                                          currencyARS: {
                                            ...filters.price.currencyARS,
                                            min: 0,
                                            max: 0,
                                          },
                                          currencyUSD: {
                                            ...filters.price.currencyUSD,
                                            min: filters.price.currencyARS.min,
                                            max: filters.price.currencyARS.max,
                                          },
                                        };
                                      }
                                      setFilters({
                                        ...filters,
                                        price: {
                                          ...filters.price,
                                          main: e.target.value,
                                          ...curr,
                                        },
                                      });
                                      handleChange(e);
                                    }}
                                  />
                                  <label htmlFor="radio_three">
                                    <span className="radio-label" />
                                    {price[0].currency}
                                  </label>
                                </div>
                              </div>
                              <div className="d-flex">
                                <div className="search_area pr-1">
                                  <div className="form-group">
                                    <Field
                                      className="form-control form_control"
                                      name="minPrice"
                                      type="text"
                                      placeholder="Desde"
                                      style={{
                                        borderColor:
                                          errors.minPrice &&
                                          touched.minPrice &&
                                          "red",
                                      }}
                                      value={values.minPrice}
                                      onChange={(e) => {
                                        let curr;
                                        if (filters.price.main === "ARS") {
                                          curr = {
                                            currencyARS: {
                                              ...filters.price.currencyARS,
                                              min: e.target.value,
                                            },
                                          };
                                        } else {
                                          curr = {
                                            currencyUSD: {
                                              ...filters.price.currencyUSD,
                                              min: e.target.value,
                                            },
                                          };
                                        }
                                        setFilters({
                                          ...filters,
                                          price: {
                                            ...filters.price,
                                            ...curr,
                                          },
                                        });
                                        handleChange(e);
                                      }}
                                    />
                                    {errors.minPrice && touched.minPrice ? (
                                      <div className="error">
                                        {errors.minPrice}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                                <div className="search_area pl-1">
                                  <div className="form-group">
                                    <Field
                                      className="form-control form_control"
                                      name="maxPrice"
                                      type="text"
                                      placeholder="Hasta"
                                      style={{
                                        borderColor:
                                          errors.maxPrice &&
                                          touched.maxPrice &&
                                          "red",
                                      }}
                                      value={values.maxPrice}
                                      onChange={(e) => {
                                        let curr;
                                        if (filters.price.main === "ARS") {
                                          curr = {
                                            currencyARS: {
                                              ...filters.price.currencyARS,
                                              max: e.target.value,
                                            },
                                          };
                                        } else {
                                          curr = {
                                            currencyUSD: {
                                              ...filters.price.currencyUSD,
                                              max: e.target.value,
                                            },
                                          };
                                        }
                                        setFilters({
                                          ...filters,
                                          price: {
                                            ...filters.price,
                                            ...curr,
                                          },
                                        });
                                        handleChange(e);
                                      }}
                                    />
                                    {errors.maxPrice && touched.maxPrice ? (
                                      <div className="error">
                                        {errors.maxPrice}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <>
                          <div className="col-lg-12 mt40">
                            <div className="adv_src_pmodal">
                              <h6>
                                <span className="title">
                                  Características generales
                                </span>
                              </h6>
                            </div>
                          </div>
                          <div className="adv_src_pmodal mb20 px-4">
                            <div className="ui_kit_checkbox d-flex flex-wrap">
                              {apartmentExtras.caracteristicasGenerales.map(
                                (extra) => (
                                  <div
                                    style={{ width: "33%", zIndex: 0 }}
                                    className="d-flex align-items-center mb-2"
                                    key={extra.id}
                                  >
                                    <Field
                                      type="checkbox"
                                      name="extras"
                                      value={String(extra.id)}
                                      style={{ minWidth: "18px" }}
                                    />
                                    <span className="ml-2">{extra.name}</span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </>
                        <>
                          <div className="col-lg-12">
                            <div className="adv_src_pmodal">
                              <h6>
                                <span className="title">Características</span>
                              </h6>
                            </div>
                          </div>
                          <div className="adv_src_pmodal mb20 px-4">
                            <div className="ui_kit_checkbox d-flex flex-wrap">
                              {apartmentExtras.caracteristicas.map((extra) => (
                                <div
                                  style={{ width: "33%", zIndex: 0 }}
                                  className="d-flex align-items-center mb-2"
                                  key={extra.id}
                                >
                                  <Field
                                    type="checkbox"
                                    name="extras"
                                    value={String(extra.id)}
                                    style={{ minWidth: "18px" }}
                                  />
                                  <span className="ml-2">{extra.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                        <>
                          <div className="col-lg-12">
                            <div className="adv_src_pmodal">
                              <h6>
                                <span className="title">Servicios</span>
                              </h6>
                            </div>
                          </div>
                          <div className="adv_src_pmodal mb20 px-4">
                            <div className="ui_kit_checkbox d-flex flex-wrap">
                              {apartmentExtras.servicios.map((extra) => (
                                <div
                                  style={{ width: "33%", zIndex: 0 }}
                                  className="d-flex align-items-center mb-2"
                                  key={extra.id}
                                >
                                  <Field
                                    type="checkbox"
                                    name="extras"
                                    value={String(extra.id)}
                                    style={{ minWidth: "18px" }}
                                  />
                                  <span className="ml-2">{extra.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                        <>
                          <div className="col-lg-12">
                            <div className="adv_src_pmodal">
                              <h6>
                                <span className="title">Ambientes</span>
                              </h6>
                            </div>
                          </div>
                          <div className="adv_src_pmodal mb20 px-4">
                            <div className="ui_kit_checkbox d-flex flex-wrap">
                              {apartmentExtras.ambientes.map((extra) => (
                                <div
                                  style={{ width: "33%", zIndex: 0 }}
                                  className="d-flex align-items-center mb-2"
                                  key={extra.id}
                                >
                                  <Field
                                    type="checkbox"
                                    name="extras"
                                    value={String(extra.id)}
                                    style={{ minWidth: "18px" }}
                                  />
                                  <span className="ml-2">{extra.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                        <div className="col-lg-12">
                          <div className="adv_src_pmodal">
                            <button
                              type="submit"
                              className="btn btn-block btn-thm"
                            >
                              <span className="fa fa-search mr15" />
                              Buscar
                            </button>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Banner;
