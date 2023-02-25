import React from 'react'

const FiltersMobile = () => {
  return (
    <div className="row">
    <div className="col-lg-12">
      <div className="listing_sidebar dn db-lg">
        <div className="sidebar_content_details style3">
          {/* <a
            href="javascript:void(0)"
            className="closebtn"
            onclick="closeNav()"
          >
            &times;
          </a> */}
          <div className="sidebar_listing_list style2 mobile_sytle_sidebar mb0">
            <div className="siderbar_widget_header">
              <h4 className="title mb0">
                Encontrá tu nuevo hogar
                <a
                  className="filter_closed_btn float-right"
                  href="#"
                >
                  <small>x</small>
                  <span className="flaticon-close"></span>
                </a>
              </h4>
            </div>
            <div className="sidebar_advanced_search_widget">
              <ul className="sasw_list mb0">
                <li className="search_area">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form_control"
                      placeholder="Enter Keyword"
                    />
                  </div>
                </li>
                <li>
                  <div className="search_option_two">
                    <div className="sidebar_select_options">
                      <select className="selectpicker w100 show-tick">
                        <option>Tipo</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Condo">Condo</option>
                        <option value="Studio">Studio</option>
                        <option value="Villa">Villa</option>
                      </select>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="search_option_two">
                    <div className="sidebar_select_options">
                      <select className="selectpicker w100 show-tick">
                        <option>Todos los barrios</option>
                        <option value="London">London</option>
                        <option value="NewYork">New York</option>
                        <option value="Paris">Paris</option>
                        <option value="Istanbul">Istanbul</option>
                        <option value="Amsterdam">Amsterdam</option>
                        <option value="Rome">Rome</option>
                        <option value="LogAngeles">
                          Log Angeles
                        </option>
                      </select>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="search_option_two">
                    <div className="sidebar_select_options">
                      <select className="selectpicker w100 show-tick">
                        <option>Bedrooms</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </div>
                  </div>
                </li>
                <li className="search_area">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form_control"
                      placeholder="Min. Area"
                    />
                  </div>
                </li>
                <li className="search_area">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form_control"
                      placeholder="Max. Area"
                    />
                  </div>
                </li>
                <li className="search_area">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form_control"
                      placeholder="Property ID"
                    />
                  </div>
                </li>
                <li>
                  <div className="sidebar_priceing_slider_mobile">
                    <div className="wrapper">
                      <p className="mb0">Price Range</p>
                      <div className="mt20 ml10" id="slider"></div>
                      <span id="slider-range-value1"></span>
                      <span id="slider-range-value2"></span>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="sidebar_accordion_widget mt40">
                    <div id="accordion2" className="panel-group">
                      <div className="panel">
                        <div className="panel-heading">
                          <h4 className="panel-title other_fet">
                            <a
                              href="#panelBodyRating2"
                              className="accordion-toggle link text-thm"
                              data-toggle="collapse"
                              data-parent="#accordion"
                            >
                              <i className="icon fa fa-plus"></i>{" "}
                              Other Features
                            </a>
                          </h4>
                        </div>
                        <div
                          id="panelBodyRating2"
                          className="panel-collapse collapse"
                        >
                          <div className="panel-body">
                            <ul className="ui_kit_checkbox selectable-list">
                              <li className="mb0">
                                <div className="custom-control custom-checkbox">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="customCheck10"
                                  />
                                  <label
                                    className="custom-control-label mb0"
                                    htmlFor="customCheck10"
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
                                    id="customCheck11"
                                  />
                                  <label
                                    className="custom-control-label mb0"
                                    htmlFor="customCheck11"
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
                                    id="customCheck12"
                                  />
                                  <label
                                    className="custom-control-label mb0"
                                    htmlFor="customCheck12"
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
                                    id="customCheck13"
                                  />
                                  <label
                                    className="custom-control-label mb0"
                                    htmlFor="customCheck13"
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
                                    id="customCheck14"
                                  />
                                  <label
                                    className="custom-control-label mb0"
                                    htmlFor="customCheck14"
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
                                    id="customCheck15"
                                  />
                                  <label
                                    className="custom-control-label mb0"
                                    htmlFor="customCheck15"
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
                                    id="customCheck16"
                                  />
                                  <label
                                    className="custom-control-label mb0"
                                    htmlFor="customCheck16"
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
                                    id="customCheck17"
                                  />
                                  <label
                                    className="custom-control-label mb0"
                                    htmlFor="customCheck17"
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
                                    id="customCheck18"
                                  />
                                  <label
                                    className="custom-control-label mb0"
                                    htmlFor="customCheck18"
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
                </li>
                <li>
                  <div className="search_option_button text-center mt25">
                    <button
                      type="submit"
                      className="btn btn-block btn-thm mb25"
                    >
                      Search
                    </button>
                    <ul className="mb0">
                      <li className="list-inline-item mb0">
                        <a href="#">
                          <span className="vam flaticon-return mr10"></span>{" "}
                          Reset Search
                        </a>
                      </li>
                      <li className="list-inline-item mb0 ml30">
                        <a href="#">
                          <span className="vam flaticon-heart-shape-outline mr10"></span>{" "}
                          Saved Search
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>  )
}

export default FiltersMobile