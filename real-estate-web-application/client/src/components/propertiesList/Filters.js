import React, { useState } from "react";
import InputRange from "react-input-range";
import { useNavigate } from "react-router";
import Select from "react-select";
import { barrios, operations, properties } from "../../pages/searchInfo";
import { addSearch } from "../../redux/searchesSlice";
import { useDispatch } from "react-redux";
import { getProperties } from "../../redux/propertiesSlice";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import "react-input-range/lib/css/index.css";
import { useEffect } from "react";

const Filters = ({
  range,
  setRange,
  userLogged,
  operationParams,
  barrioParams,
  propertyParams,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [queries, setQueries] = useState({
    operation: operationParams || operations[0],
    property: propertyParams,
    location: barrioParams,
  });
  const [showModal, setShowModal] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [errorSearch, setErrorSearch] = useState(false);
  useEffect(() => {
    setQueries({
      operation: operationParams || operations[0],
      property: propertyParams,
      location: barrioParams,
    });
  }, [operationParams, propertyParams, barrioParams]);

  //handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    let property = "";
    let barrio = "";
    for (let i = 0; i < queries.property.length; i++) {
      property += `-${queries.property[i].tag}`;
    }
    for (let i = 0; i < queries.location.length; i++) {
      barrio += `-${queries.location[i].tag}`;
    }
    navigate(
      `/propiedades/${queries.operation.label.toLocaleLowerCase()}${property}${barrio}?page=1`
    );
    const propertiesIds = [];
    const barriosIds = [];
    for (let i = 0; i < queries.property.length; i++) {
      propertiesIds.push(queries.property[i].value);
    }
    for (let i = 0; i < queries.location.length; i++) {
      barriosIds.push(queries.location[i].value);
    }
    const body = {
      operationType: queries.operation.value,
      propertyTypes: propertiesIds,
      barrios: barriosIds,
    };
    dispatch(getProperties(body));
  };

  const openModal = async () => {
    if (userLogged) {
      setShowModal(true);
      setSearchName(
        `${queries.operation.label}${
          queries.property[0]?.label !== undefined
            ? ` ${queries.property[0].label}`
            : ""
        }${
          queries.location[0]?.label !== undefined
            ? ` ${queries.location[0].label}`
            : ""
        }`
      );
    }
  };

  const handleSaveSearch = () => {
    if (userLogged) {
      const tags = [queries.operation.label];
      let property = "";
      let barrio = "";
      for (let i = 0; i < queries.property.length; i++) {
        property += `-${queries.property[i].tag}`;
        tags.push(queries.property[i].label);
      }
      for (let i = 0; i < queries.location.length; i++) {
        barrio += `-${queries.location[i].tag}`;
        tags.push(queries.location[i].label);
      }
      if (!errorSearch) {
        dispatch(
          addSearch(userLogged.id, {
            path: `/propiedades/${queries.operation.label.toLocaleLowerCase()}${property}${barrio}?page=1`,
            name: searchName,
            tags,
          })
        );
        setShowModal(false);
      }
    }
  };

  const handleReset = () => {
    navigate(`/propiedades/${queries.operation.label.toLocaleLowerCase()}?page=1`);
    setQueries({ ...queries, property: [], location: [] });
    const body = {
      operationType: queries.operation.value,
      propertyTypes: [],
      barrios: [],
    };
    dispatch(getProperties(body));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="col-xl-3">
        <div className="sidebar_listing_grid1 mb30 dn-lg">
          <div className="sidebar_listing_list">
            <div className="sidebar_advanced_search_widget">
              <ul className="sasw_list mb0">
                <li>
                  <h4 className="mb0">Encontrá tu nuevo hogar</h4>
                </li>
                <li>
                  <div className="search_option_two">
                    <div className="sidebar_select_options">
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        name="operación"
                        options={operations}
                        placeholder="Tipo de operación"
                        value={queries.operation}
                        onChange={(e) =>
                          setQueries({ ...queries, operation: e })
                        }
                      />
                    </div>
                  </div>
                </li>
                <li>
                  <div className="search_option_two">
                    <div className="sidebar_select_options">
                      <Select
                        isMulti
                        className="basic-multi-select"
                        classNamePrefix="select"
                        name="propiedades"
                        options={properties}
                        placeholder="Tipo de propiedad"
                        value={queries.property}
                        onChange={(e) =>
                          setQueries({ ...queries, property: e })
                        }
                      />
                    </div>
                  </div>
                </li>
                <li>
                  <div className="search_option_two">
                    <div className="sidebar_select_options">
                      <Select
                        isMulti
                        name="barrios"
                        options={barrios}
                        value={queries.location}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Seleccionar barrios"
                        onChange={(e) =>
                          setQueries({ ...queries, location: e })
                        }
                      />
                    </div>
                  </div>
                </li>
                {/* <li className="search_area">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form_control"
                      placeholder="Superficie mínima (m²)"
                    />
                  </div>
                </li>
                <li className="search_area">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form_control"
                      placeholder="Superficie máxima (m²)"
                    />
                  </div>
                </li>
                <li>
                  <div className="sidebar_priceing_slider_desktop">
                    <div className="wrapper">
                      <p className="mb0">Filtrar por precios</p>
                      <div className="mt10">
                        <InputRange
                          minValue={0}
                          value={range}
                          maxValue={100}
                          onChange={(range) => setRange(range)}
                          formatLabel={() => ""}
                        />
                      </div>
                      <input
                        type="number"
                        className="amount"
                        value={range.min}
                        onChange={(e) =>
                          setRange({ ...range, min: e.target.value })
                        }
                      />
                      <input
                        type="number"
                        className="amount2"
                        value={range.max}
                        onChange={(e) =>
                          setRange({ ...range, max: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </li>
                <li>
                  <div className="sidebar_accordion_widget mt40">
                    <div id="accordion" className="panel-group">
                      <div className="panel">
                        <div className="panel-heading">
                          <h4 className="panel-title other_fet">
                            <a
                              href="#panelBodyRating"
                              className="accordion-toggle link text-thm"
                              data-toggle="collapse"
                              data-parent="#accordion"
                            >
                              <i className="icon fa fa-plus"></i> Other Features
                            </a>
                          </h4>
                        </div>
                        <div
                          id="panelBodyRating"
                          className="panel-collapse collapse"
                        >
                          <div className="panel-body">
                            <ul className="ui_kit_checkbox selectable-list">
                              <li className="mb0">
                                <div className="custom-control custom-checkbox">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="customCheck1"
                                  />
                                  <label
                                    className="custom-control-label mb0"
                                    htmlFor="customCheck1"
                                  >
                                    Air Conditioning
                                  </label>
                                </div>
                              </li>
                              <li className="mb0">
                                <div className="custom-control custom-checkbox">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="customCheck2"
                                  />
                                  <label
                                    className="custom-control-label mb0"
                                    htmlFor="customCheck2"
                                  >
                                    Barbeque
                                  </label>
                                </div>
                              </li>
                              <li className="mb0">
                                <div className="custom-control custom-checkbox">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="customCheck3"
                                  />
                                  <label
                                    className="custom-control-label mb0"
                                    htmlFor="customCheck3"
                                  >
                                    Dryer
                                  </label>
                                </div>
                              </li>
                              <li className="mb0">
                                <div className="custom-control custom-checkbox">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="customCheck4"
                                  />
                                  <label
                                    className="custom-control-label mb0"
                                    htmlFor="customCheck4"
                                  >
                                    Gym
                                  </label>
                                </div>
                              </li>
                              <li className="mb0">
                                <div className="custom-control custom-checkbox">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="customCheck5"
                                  />
                                  <label
                                    className="custom-control-label mb0"
                                    htmlFor="customCheck5"
                                  >
                                    Laundry
                                  </label>
                                </div>
                              </li>
                              <li className="mb0">
                                <div className="custom-control custom-checkbox">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="customCheck6"
                                  />
                                  <label
                                    className="custom-control-label mb0"
                                    htmlFor="customCheck6"
                                  >
                                    Lawn
                                  </label>
                                </div>
                              </li>
                              <li className="mb0">
                                <div className="custom-control custom-checkbox">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="customCheck7"
                                  />
                                  <label
                                    className="custom-control-label mb0"
                                    htmlFor="customCheck7"
                                  >
                                    Microwave
                                  </label>
                                </div>
                              </li>
                              <li className="mb0">
                                <div className="custom-control custom-checkbox">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="customCheck8"
                                  />
                                  <label
                                    className="custom-control-label mb0"
                                    htmlFor="customCheck8"
                                  >
                                    Outdoor Shower
                                  </label>
                                </div>
                              </li>
                              <li className="mb0">
                                <div className="custom-control custom-checkbox">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="customCheck9"
                                  />
                                  <label
                                    className="custom-control-label mb0"
                                    htmlFor="customCheck9"
                                  >
                                    Refrigerator
                                  </label>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li> */}
                <li>
                  <div className="search_option_button text-center mt25">
                    <button
                      type="submit"
                      className="btn btn-block btn-thm mb25"
                    >
                      Buscar
                    </button>
                    <ul className="mb0">
                      <li
                        className="list-inline-item mb0 cursor-pointer"
                        onClick={handleReset}
                      >
                        <span className="vam flaticon-return mr10"></span>
                        Resetear búsqueda
                      </li>
                      <li
                        className="list-inline-item mb0 cursor-pointer"
                        onClick={openModal}
                      >
                        <a
                          data-toggle="modal"
                          data-target={!userLogged && "#logInModal"}
                        >
                          <span className="vam flaticon-heart-shape-outline mr10"></span>
                          Guardar búsqueda
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </form>
      <Modal open={showModal} onClose={() => setShowModal(false)} center>
        <div className="modal-header">
          <h4 className="modal-title">Crear Nueva Búsqueda</h4>
        </div>
        <div className="modal-body">
          <div className="">
            <div className="">
              <div className="col-lg-12">
                <p>Elegí un nombre personalizado para tu búsqueda guardada</p>
                <input
                  style={{
                    border: `1px solid ${
                      errorSearch ? "red" : "rgba(0,0,0,.3)"
                    }`,
                  }}
                  className="w-100 p-2 rounded"
                  type=""
                  name=""
                  value={searchName}
                  onChange={(e) => {
                    setSearchName(e.target.value);
                    setErrorSearch(false);
                  }}
                  onBlur={() =>
                    (!searchName.trim() || searchName.length > 30) &&
                    setErrorSearch(true)
                  }
                />
                {errorSearch && (
                  <p style={{ color: "red" }}>
                    {!searchName.trim()
                      ? "Este campo es obligatorio"
                      : "Máximo 30 caracteres"}
                  </p>
                )}

                <button
                  className="btn btn-block btn-thm mt-3"
                  onClick={handleSaveSearch}
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
