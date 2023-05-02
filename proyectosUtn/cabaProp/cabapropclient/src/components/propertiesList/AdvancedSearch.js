import React from "react";
import { Field } from "formik";
import Select from "react-select";
import {
  extrasArray,
  price,
  ambiences,
  bathrooms,
  bedrooms,
  garages,
  surface,
} from "../models/searchInfo";

const AdvancedSearch = ({
  errors,
  touched,
  filters,
  setFilters,
  values,
  setQueries,
}) => {
  // * States

  // * Methods
  const HandleExtras = (e) => {
    let extras = [...filters.extras];
    const findExtra = extras.indexOf(Number(e.target.value));
    if (findExtra !== -1) extras.splice(findExtra, 1);
    else extras = [...extras, Number(e.target.value)];

    setFilters({
      ...filters,
      extras,
    });
    setQueries({ page: 1 });
  };

  const HandleSurface = () => {
    console.log("CLICK!");
    const surface = {
      min: values.minSurface,
      max: values.maxSurface,
      type: values.radioSurface,
      tag:
        values.radioSurface === "totalSurface"
          ? "superficieTotal"
          : "superficieCubierta",
    };
    setFilters({
      ...filters,
      surface,
    });
    setQueries({ page: 1 });
  };

  const HandlePrice = () => {
    let price = { ...filters.price, main: values.radioCurrency };
    if (price.main === "ARS") {
      price = {
        ...price,
        currencyARS: {
          ...filters.price.currencyARS,
          min:
            Number(values.minPrice) < 1
              ? Number(values.minPrice)
              : Math.trunc(Number(values.minPrice)),
          max:
            Number(values.maxPrice) < 1
              ? Number(values.maxPrice)
              : Math.trunc(Number(values.maxPrice)),
        },
        currencyUSD: {
          ...filters.price.currencyUSD,
          min:
            Number(values.minPrice / 200) < 1
              ? Number(values.minPrice / 200)
              : Math.trunc(Number(values.minPrice / 200)),
          max:
            Number(values.maxPrice / 200) < 1
              ? Number(values.maxPrice / 200)
              : Math.trunc(Number(values.maxPrice / 200)),
        },
      };
    } else {
      price = {
        currencyARS: {
          ...filters.price.currencyARS,
          min: Math.floor(Number(values.minPrice * 200)),
          max: Math.floor(Number(values.maxPrice * 200)),
        },
        currencyUSD: {
          ...filters.price.currencyUSD,
          min:
            Number(values.minPrice) < 1
              ? Number(values.minPrice)
              : Math.trunc(Number(values.minPrice)),
          max:
            Number(values.maxPrice) < 1
              ? Number(values.maxPrice)
              : Math.trunc(Number(values.maxPrice)),
        },
      };
    }
    setFilters({
      ...filters,
      price,
    });
    setQueries({ page: 1 });
  };

  return (
    <>
      <div className="search_option_two pb-4">
        <div className="sidebar_select_options">
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
            placeholder="Seleccionar ambientes"
            value={filters.ambiences}
            onChange={(e) => {
              setFilters({
                ...filters,
                ambiences: e,
              });
              setQueries({ page: 1 });
            }}
          />
        </div>
      </div>
      <div className="search_option_two pb-4">
        <div className="sidebar_select_options">
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
            placeholder="Seleccionar habitaciones"
            value={filters.bedRooms}
            onChange={(e) => {
              setFilters({
                ...filters,
                bedRooms: e,
              });
              setQueries({ page: 1 });
            }}
          />
        </div>
      </div>
      <div className="search_option_two pb-4">
        <div className="sidebar_select_options">
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
            placeholder="Seleccionar baños"
            value={filters.bathRooms}
            onChange={(e) => {
              setFilters({
                ...filters,
                bathRooms: e,
              });
              setQueries({ page: 1 });
            }}
          />
        </div>
      </div>
      <div className="search_option_two pb-4">
        <div className="sidebar_select_options">
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
            placeholder="Seleccionar cocheras"
            value={filters.garages}
            onChange={(e) => {
              setFilters({
                ...filters,
                garages: e,
              });
              setQueries({ page: 1 });
            }}
          />
        </div>
      </div>
      <div>
        <label className="show-filters-label" style={{ cursor: "default" }}>
          <h5 className="mt-2">Superficie (m²)</h5>
        </label>
        <div className="shortcode_widget_radiobox">
          <div className="ui_kit_radiobox d-flex">
            <div className="radio mr-3">
              <Field
                id="radio_one"
                name="radioSurface"
                type="radio"
                value={surface[1].type}
              />
              <label htmlFor="radio_one">
                <span className="radio-label" /> {surface[1].label}
              </label>
            </div>
            <div className="radio">
              <Field
                id="radio_two"
                name="radioSurface"
                type="radio"
                value={surface[0].type}
              />
              <label htmlFor="radio_two">
                <span className="radio-label" /> {surface[0].label}
              </label>
            </div>
          </div>
        </div>
        <div className="d-flex">
          <li className="search_area pr-1">
            <div className="form-group">
              <Field
                name="minSurface"
                className="form-control form_control"
                type="text"
                placeholder="Desde"
                style={{
                  borderColor: errors.maxSurface && touched.maxSurface && "red",
                }}
                value={values.minSurface}
              />
              {errors.minSurface && touched.minSurface ? (
                <div className="error">{errors.minSurface}</div>
              ) : null}
            </div>
            <button
              className="btn btn-thm mb-0"
              type="button"
              disabled={
                (errors.minSurface && touched.minSurface) ||
                (errors.maxSurface && touched.maxSurface)
              }
              onClick={() => {
                !(
                  (errors.minSurface && touched.minSurface) ||
                  (errors.maxSurface && touched.maxSurface)
                ) && HandleSurface();
              }}
            >
              Aplicar
            </button>
          </li>
          <li className="search_area pl-1">
            <div className="form-group">
              <Field
                className="form-control form_control"
                name="maxSurface"
                type="text"
                placeholder="Hasta"
                style={{
                  borderColor: errors.maxSurface && touched.maxSurface && "red",
                }}
                value={values.maxSurface}
              />
              {errors.maxSurface && touched.maxSurface ? (
                <div className="error">{errors.maxSurface}</div>
              ) : null}
            </div>
          </li>
        </div>
      </div>
      <div>
        <label className="show-filters-label" style={{ cursor: "default" }}>
          <h5 className="mt-2">Precio</h5>
        </label>
        <div className="shortcode_widget_radiobox">
          <div className="ui_kit_radiobox d-flex">
            <div className="radio mr-3">
              <Field
                id="radio_four"
                name="radioCurrency"
                type="radio"
                value={price[1].currency}
              />
              <label htmlFor="radio_four">
                <span className="radio-label" /> {price[1].currency}
              </label>
            </div>
            <div className="radio">
              <Field
                id="radio_three"
                name="radioCurrency"
                type="radio"
                value={price[0].currency}
              />
              <label htmlFor="radio_three">
                <span className="radio-label" /> {price[0].currency}
              </label>
            </div>
          </div>
        </div>
        <div className="d-flex">
          <li className="search_area pr-1">
            <div className="form-group">
              <Field
                className="form-control form_control"
                name="minPrice"
                type="text"
                placeholder="Desde"
                style={{
                  borderColor: errors.minPrice && touched.minPrice && "red",
                }}
                value={values.minPrice}
              />
              {errors.minPrice && touched.minPrice ? (
                <div className="error">{errors.minPrice}</div>
              ) : null}
            </div>
            <button
              className="btn btn-thm mb-2"
              type="button"
              disabled={
                (errors.minPrice && touched.minPrice) ||
                (errors.maxPrice && touched.maxPrice)
              }
              onClick={() => {
                !(
                  (errors.minPrice && touched.minPrice) ||
                  (errors.maxPrice && touched.maxPrice)
                ) && HandlePrice();
              }}
            >
              Aplicar
            </button>
          </li>
          <li className="search_area pl-1">
            <div className="form-group">
              <Field
                className="form-control form_control"
                name="maxPrice"
                type="text"
                placeholder="Hasta"
                style={{
                  borderColor: errors.maxPrice && touched.maxPrice && "red",
                }}
                value={values.maxPrice}
              />
              {errors.maxPrice && touched.maxPrice ? (
                <div className="error">{errors.maxPrice}</div>
              ) : null}
            </div>
          </li>
        </div>
      </div>
      <li>
        <div className="sidebar_accordion_widget">
          <div id="accordion" className="panel-group">
            {extrasArray.map((array) => (
              <div className="panel" key={array.id}>
                <div className="panel-heading">
                  <h4 className="panel-title other_fet">
                    <a
                      href={`#${array.id}`}
                      className="accordion-toggle link text-thm"
                      data-toggle="collapse"
                      data-parent="#accordion"
                    >
                      <i className="icon fa fa-plus" /> {array.label}
                    </a>
                  </h4>
                </div>
                <div id={array.id} className="panel-collapse collapse">
                  <div className="panel-body">
                    <ul className="ui_kit_checkbox selectable-list mb-4">
                      {array.content.map((extra) => (
                        <li key={extra.id} className="mb0">
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              checked={filters.extras.indexOf(extra.id) !== -1}
                              value={String(extra.id)}
                              onChange={(e) => HandleExtras(e)}
                            />
                            <span className="ml-2">{extra.name}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </li>
    </>
  );
};

export default AdvancedSearch;
