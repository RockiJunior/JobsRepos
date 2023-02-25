import React from "react";
import { apartmentExtras } from "../../pages/searchInfo";

const Extras = ({ data }) => {
  const extras = {
    generalCharacteristics: [],
    characteristics: [],
    ambience: [],
    services: [],
  };
  for (let i = 0; i < Object.values(data.extras.characteristics).length; i++) {
    if (Object.values(data.extras.characteristics)[i])
      extras.characteristics.push(apartmentExtras.caracteristicas[i]);
  }
  for (
    let i = 0;
    i < Object.values(data.extras.generalCharacteristics).length;
    i++
  ) {
    if (Object.values(data.extras.generalCharacteristics)[i])
      extras.generalCharacteristics.push(
        apartmentExtras.caracteristicasGenerales[i]
      );
  }
  for (let i = 0; i < Object.values(data.extras.services).length; i++) {
    if (Object.values(data.extras.services)[i])
      extras.services.push(apartmentExtras.servicios[i]);
  }
  for (let i = 0; i < Object.values(data.extras.ambience).length; i++) {
    if (Object.values(data.extras.ambience)[i])
      extras.ambience.push(apartmentExtras.ambientes[i]);
  }


  return (
    <>
      {(extras.ambience.length > 0 ||
        extras.characteristics.length > 0 ||
        extras.generalCharacteristics.length > 0 ||
        extras.services.length > 0) && (
        <div className="col-lg-12">
          <div className="additional_details pb40 mt50 bb1">
            <div className="row mb40">
              {extras.characteristics.length > 0 && (
                <>
                  <div className="col-lg-12">
                    <h4 className="mb15">Características</h4>
                  </div>
                  {extras.characteristics.map((extra, index) => (
                    <div className="col-sm-6 col-xl-3 mb10" key={index}>
                      <div className="title">{extra.name}</div>
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className="row mb50">
              {extras.generalCharacteristics.length > 0 && (
                <>
                  <div className="col-lg-12">
                    <h4 className="mb15">Características generales</h4>
                  </div>
                  {extras.generalCharacteristics.map((extra, index) => (
                    <div className="col-sm-6 col-xl-3 mb10" key={index}>
                      <div className="title">{extra.name}</div>
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className="row mb50">
              {extras.ambience.length > 0 && (
                <>
                  <div className="col-lg-12">
                    <h4 className="mb15">Ambientes</h4>
                  </div>
                  {extras.ambience.map((extra, index) => (
                    <div className="col-sm-6 col-xl-3 mb10" key={index}>
                      <div className="title">{extra.name}</div>
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className="row mb50">
              {extras.services.length > 0 && (
                <>
                  <div className="col-lg-12">
                    <h4 className="mb15">Servicios</h4>
                  </div>
                  {extras.services.map((extra, index) => (
                    <div className="col-sm-6 col-xl-3 mb10" key={index}>
                      <div className="title">{extra.name}</div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Extras;
