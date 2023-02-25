import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Select from "react-select";
import {
  barrios,
  operations,
  properties,
  apartmentExtras,
  garageOptions,
  roomsOptions,
} from "../../pages/searchInfo";

const Banner = ({data, setData}) => {
  const navigate = useNavigate();
  const groupBadgeStyles = {
    color: "red",
    width: "500px",
  };

  //handlers
  const handleLocation = (e) => {
    setData({ ...data, location: e });
  };

  const handleProperties = (e) => {
    setData({ ...data, property: e });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const operation = operations.find((oper) => oper.value === data.operation);
    let property = "";
    let barrio = "";
    for (let i = 0; i < data.property.length; i++) {
      property += `-${data.property[i].tag}`;
    }
    for (let i = 0; i < data.location.length; i++) {
      barrio += `-${data.location[i].tag}`;
    }
    navigate(
      `/propiedades/${operation.label.toLocaleLowerCase()}${property}${barrio}?page=1`
    );
  };

  const handleExtras = (option, value) => {
    setData({
      ...data,
      advancedSearch: {
        ...data.advancedSearch,
        [option]: value,
      },
    });
  };

  return (
    <>
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
              <a
                href="#"
                className="closer"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">
                  <img src="/assets/images/icons/close.svg" alt="close.svg" />
                </span>
              </a>
            </div>
            <div className="modal-body">
              <div className="popup_modal_wrapper">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-6 mb20">
                      <div className="adv_src_pmodal">
                        <h6 className="title">Ambientes</h6>
                        <div className="ui_kit_select_box">
                          <Select
                            className="basic-single"
                            classNamePrefix="select"
                            name="propiedades"
                            options={roomsOptions}
                            placeholder="Elegir ambientes"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 mb20">
                      <div className="adv_src_pmodal">
                        <h6 className="title">Dormitorios</h6>
                        <div className="ui_kit_select_box">
                          <Select
                            className="basic-single"
                            classNamePrefix="select"
                            name="propiedades"
                            options={roomsOptions}
                            placeholder="Elegir dormitorios"
                          />{" "}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 mb20">
                      <div className="adv_src_pmodal">
                        <h6 className="title">Baños</h6>
                        <div
                          style={{ zIndex: 10000, position: "relative" }}
                          className="ui_kit_select_box"
                        >
                          <Select
                            className="basic-single"
                            classNamePrefix="select"
                            name="propiedades"
                            options={roomsOptions}
                            placeholder="Elegir baños"
                          />{" "}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 mb20">
                      <div className="adv_src_pmodal">
                        <h6 className="title">Cocheras</h6>
                        <div
                          style={{ zIndex: 10000, position: "relative" }}
                          className="ui_kit_select_box"
                        >
                          <Select
                            className="basic-single"
                            classNamePrefix="select"
                            name="propiedades"
                            options={garageOptions}
                            placeholder="Elegir garages"
                          />{" "}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 mb30-md">
                      <div className="adv_src_pmodal">
                        <h6 className="title">Superficie (m²)</h6>
                        <div className="form-group">
                          <input
                            type="number"
                            className="form-control area_input float-left"
                            placeholder="Mínimo"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="number"
                            className="form-control area_input float-right"
                            placeholder="Máximo"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 mb30-md">
                      <div className="adv_src_pmodal">
                        <h6 className="title">Precio</h6>
                        <div className="form-group">
                          <input
                            type="number"
                            className="form-control area_input float-left"
                            placeholder="Desde"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="number"
                            className="form-control area_input float-right"
                            placeholder="Hasta"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 mb30-md d-none">
                      <div className="adv_src_pmodal">
                        <h6 className="title">Price</h6>
                        <div className="mt20" id="slider"></div>
                        <span id="slider-range-value1"></span>
                        <span id="slider-range-value2"></span>
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
                              style={{ width: "33%" }}
                              className="custom-control custom-checkbox"
                              key={extra.id}
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={`extra${extra.id}`}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor={`extra${extra.id}`}
                              >
                                {extra.name}
                              </label>
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
                            style={{ width: "33%" }}
                            className="custom-control custom-checkbox"
                            key={extra.id}
                          >
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={`extra${extra.id}`}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor={`extra${extra.id}`}
                            >
                              {extra.name}
                            </label>
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
                            style={{ width: "33%" }}
                            className="custom-control custom-checkbox"
                            key={extra.id}
                          >
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={`extra${extra.id}`}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor={`extra${extra.id}`}
                            >
                              {extra.name}
                            </label>
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
                            style={{ width: "33%" }}
                            className="custom-control custom-checkbox"
                            key={extra.id}
                          >
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={`extra${extra.id}`}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor={`extra${extra.id}`}
                            >
                              {extra.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                </div>
              </div>

              <div className="col-lg-12">
                <div className="adv_src_pmodal">
                  <button className="btn btn-block btn-thm">
                    <span className="fa fa-search mr15"></span>Show 300+
                    PROPERTY
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <a
                        className="nav-link"
                        id="buy-tab"
                        data-toggle="tab"
                        href="#buy"
                        role="tab"
                        aria-controls="buy"
                        aria-selected="true"
                        onClick={() => setData({ ...data, operation: 1 })}
                      >
                        Comprar
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className="nav-link active"
                        id="rent-tab"
                        data-toggle="tab"
                        href="#rent"
                        role="tab"
                        aria-controls="rent"
                        aria-selected="false"
                        onClick={() => setData({ ...data, operation: 2 })}
                      >
                        Alquilar
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className="nav-link"
                        id="sold-tab"
                        data-toggle="tab"
                        href="#sold"
                        role="tab"
                        aria-controls="sold"
                        aria-selected="false"
                        onClick={() => setData({ ...data, operation: 3 })}
                      >
                        Temporario
                      </a>
                    </li>
                  </ul>
                  <div className="tab-content" id="myTabContent2">
                    <div
                      className="tab-pane fade"
                      id="buy"
                      role="tabpanel"
                      aria-labelledby="buy-tab"
                    >
                      <div className="home_adv_srch_opt">
                        <div className="wrapper">
                          <div className="home_adv_srch_form">
                            <form
                              className="bgc-white p20"
                              onSubmit={handleSubmit}
                            >
                              <div className="form-row align-items-center">
                                <div
                                  style={{ width: "33%" }}
                                  className="col-auto home_form_input mb15-md"
                                >
                                  <div className="form-group style2 mb-2 pl10 pl0-lg">
                                    <label>PROPIEDAD</label>
                                    <div
                                      style={{ width: "100%" }}
                                      className="select-wrap style2-dropdown"
                                    >
                                      <Select
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        value={data.property}
                                        name="propiedades"
                                        options={properties}
                                        onChange={handleProperties}
                                        isMulti
                                        placeholder="Selecionar tipo de propiedad"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div
                                  style={{ width: "33%" }}
                                  className="col-auto home_form_input mb15-md"
                                >
                                  <div className="form-group style2 mb-2 pl0-lg">
                                    <label>UBICACIÓN</label>
                                    <div
                                      style={{ width: "100%" }}
                                      className="select-wrap style2-dropdown"
                                    >
                                      <Select
                                        style={groupBadgeStyles}
                                        isMulti
                                        name="barrios"
                                        options={barrios}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="Seleccionar barrios"
                                        value={data.location}
                                        onChange={handleLocation}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* <div className="col-auto home_form_adv_srch_form_btn mb20-md">
                                  <div
                                    className="adv_srch_btn dropbtn ml0-767"
                                    data-toggle="modal"
                                    data-target="#staticBackdrop"
                                  >
                                    <i className="flaticon-setting-lines mr10 mt10 mt0-md flr-520"></i>
                                    Búsqueda <br className="dn-991" /> Avanzada
                                  </div>
                                </div> */}
                                <div className="col-auto home_form_input2">
                                  <button
                                    type="submit"
                                    className="btn search-btn ml0-767"
                                  >
                                    <span className="fa fa-search"></span>{" "}
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
                              onSubmit={handleSubmit}
                            >
                              <div className="form-row align-items-center">
                                <div
                                  style={{ width: "33%" }}
                                  className="col-auto home_form_input mb15-md"
                                >
                                  <div className="form-group style2 mb-2 pl10 pl0-lg">
                                    <label>PROPIEDAD</label>
                                    <div
                                      style={{ width: "100%" }}
                                      className="select-wrap style2-dropdown"
                                    >
                                      <Select
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        value={data.property}
                                        name="propiedades"
                                        options={properties}
                                        onChange={handleProperties}
                                        isMulti
                                        placeholder="Selecionar tipo de propiedad"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div
                                  style={{ width: "33%" }}
                                  className="col-auto home_form_input mb15-md"
                                >
                                  <div className="form-group style2 mb-2 pl0-lg">
                                    <label>UBICACIÓN</label>
                                    <div
                                      style={{ width: "100%" }}
                                      className="select-wrap style2-dropdown"
                                    >
                                      <Select
                                        style={groupBadgeStyles}
                                        isMulti
                                        name="barrios"
                                        options={barrios}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="Seleccionar barrios"
                                        value={data.location}
                                        onChange={handleLocation}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* <div className="col-auto home_form_adv_srch_form_btn mb20-md">
                                  <div
                                    className="adv_srch_btn dropbtn ml0-767"
                                    data-toggle="modal"
                                    data-target="#staticBackdrop"
                                  >
                                    <i className="flaticon-setting-lines mr10 mt10 mt0-md flr-520"></i>
                                    Búsqueda <br className="dn-991" /> Avanzada
                                  </div>
                                </div> */}
                                <div className="col-auto home_form_input2">
                                  <button
                                    type="submit"
                                    className="btn search-btn ml0-767"
                                  >
                                    <span className="fa fa-search"></span>{" "}
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
                      className="tab-pane fade"
                      id="sold"
                      role="tabpanel"
                      aria-labelledby="sold-tab"
                    >
                      <div className="home_adv_srch_opt">
                        <div className="wrapper">
                          <div className="home_adv_srch_form">
                            <form
                              className="bgc-white p20"
                              onSubmit={handleSubmit}
                            >
                              <div className="form-row align-items-center">
                                <div
                                  style={{ width: "33%" }}
                                  className="col-auto home_form_input mb15-md"
                                >
                                  <div className="form-group style2 mb-2 pl10 pl0-lg">
                                    <label>PROPIEDAD</label>
                                    <div
                                      style={{ width: "100%" }}
                                      className="select-wrap style2-dropdown"
                                    >
                                      <Select
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        value={data.property}
                                        name="propiedades"
                                        options={properties}
                                        onChange={handleProperties}
                                        isMulti
                                        placeholder="Selecionar tipo de propiedad"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div
                                  style={{ width: "33%" }}
                                  className="col-auto home_form_input mb15-md"
                                >
                                  <div className="form-group style2 mb-2 pl0-lg">
                                    <label>UBICACIÓkkN</label>
                                    <div
                                      style={{ width: "100%" }}
                                      className="select-wrap style2-dropdown"
                                    >
                                      <Select
                                        style={groupBadgeStyles}
                                        isMulti
                                        name="barrios"
                                        options={barrios}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="Seleccionar barrios"
                                        value={data.location}
                                        onChange={handleLocation}
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
                                    <span className="fa fa-search"></span>{" "}
                                    Buscar
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{backgroundColor: 'rgba(0,0,0,.3)', maxWidth: 800}} className="d-flex align-items-center p10 mt10">
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
    </>
  );
};

export default Banner;
