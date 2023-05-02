import React, { useState, useEffect } from "react";
import { apartmentExtras } from "../models/searchInfo";
import { useSelector } from "react-redux";
import { ImCheckboxChecked } from "react-icons/im";

const Extras = () => {
  const [extrasState, setExtrasState] = useState({});
  const data = useSelector((state) => state.properties.singleProperty).extras;

  // * Methods
  const BuildExtras = () => {
    let extras = {
      generalsArray: [],
      characArray: [],
      servicesArray: [],
      ambiencesArray: [],
    };

    for (let i in data) {
      if (data[i]) {
        const findGenerals = apartmentExtras.caracteristicasGenerales.find(
          (e) => e.id === Number(i)
        );
        if (findGenerals) {
          extras = {
            ...extras,
            generalsArray: [...extras.generalsArray, findGenerals.name],
          };
        }

        const findCharac = apartmentExtras.caracteristicas.find(
          (e) => e.id === Number(i)
        );
        if (findCharac) {
          extras = {
            ...extras,
            characArray: [...extras.characArray, findCharac.name],
          };
        }

        const findServices = apartmentExtras.servicios.find(
          (e) => e.id === Number(i)
        );
        if (findServices) {
          extras = {
            ...extras,
            servicesArray: [...extras.servicesArray, findServices.name],
          };
        }

        const findAmbiences = apartmentExtras.ambientes.find(
          (e) => e.id === Number(i)
        );
        if (findAmbiences) {
          extras = {
            ...extras,
            ambiencesArray: [...extras.ambiencesArray, findAmbiences.name],
          };
        }
      }
    }
    setExtrasState(extras);
  };

  // * Life Cycle
  useEffect(() => {
    data && BuildExtras();
    //eslint-disable-next-line
  }, [data]);

  return (
    <>
      <div className="col-lg-12">
        <div className="additional_details pb40 pt40 bb1">
          {extrasState?.generalsArray?.length > 0 && (
            <div className="row mb40">
              <div className="col-lg-12">
                <h4 className="mb15">Características generales</h4>
              </div>
              {extrasState.generalsArray.sort().map((extra) => (
                <div className="col-sm-6 col-xl-3 mb10 d-flex" key={extra}>
                  <ImCheckboxChecked size={18} color="green" />
                  <div className="title ml-1">{extra}</div>
                </div>
              ))}
            </div>
          )}
          {extrasState?.characArray?.length > 0 && (
            <div className="row mb40">
              <div className="col-lg-12">
                <h4 className="mb15">Características</h4>
              </div>
              {extrasState.characArray.sort().map((extra) => (
                <div className="col-sm-6 col-xl-3 mb10 d-flex" key={extra}>
                  <ImCheckboxChecked size={18} color="green" />
                  <div className="title ml-1">{extra}</div>
                </div>
              ))}
            </div>
          )}
          {extrasState?.servicesArray?.length > 0 && (
            <div className="row mb40">
              <div className="col-lg-12">
                <h4 className="mb15">Servicios</h4>
              </div>
              {extrasState.servicesArray.sort().map((extra) => (
                <div className="col-sm-6 col-xl-3 mb10 d-flex" key={extra}>
                  <ImCheckboxChecked size={18} color="green" />
                  <div className="title ml-1">{extra}</div>
                </div>
              ))}
            </div>
          )}
          {extrasState?.ambiencesArray?.length > 0 && (
            <div className="row mb40">
              <div className="col-lg-12">
                <h4 className="mb15">Ambientes</h4>
              </div>
              {extrasState.ambiencesArray.sort().map((extra) => (
                <div className="col-sm-6 col-xl-3 mb10 d-flex" key={extra}>
                  <ImCheckboxChecked size={18} color="green" />
                  <div className="title ml-1">{extra}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Extras;
