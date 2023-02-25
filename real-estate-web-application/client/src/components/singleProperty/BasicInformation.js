import React from 'react'

const BasicInformation = ({data}) => {
  console.log(data)
  return (
    <>
    <div className="col-lg-12">
                      <div className="listing_single_description mb60">
                        <h4 className="mb30">Descripción</h4>
                        <p className="first-para mb25">{data.description}</p>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="location_details pb40 mt50 bb1">
                        <div className="row">
                          <div className="col-lg-12">
                            <h4 className="mb15">Ubicación</h4>
                          </div>
                          <div className="col-md-6 col-lg-6 col-xl-4">
                            <ul className="list-inline-item mb0">
                              <li>
                                <p>Dirección:</p>
                              </li>
                              <li>
                                <p>Ciudad:</p>
                              </li>
                            </ul>
                            <ul className="list-inline-item mb0">
                              <li>
                                <p>
                                  <span>{`${data.location.street} ${data.location.number}`}</span>
                                </p>
                              </li>
                              <li>
                                <p>
                                  <span>CABA</span>
                                </p>
                              </li>
                            </ul>
                          </div>
                          <div className="col-md-6 col-lg-6 col-xl-4">
                            <ul className="list-inline-item mb0">
                              <li>
                                <p>Código postal:</p>
                              </li>
                              <li>
                                <p>País:</p>
                              </li>
                            </ul>
                            <ul className="list-inline-item mb0">
                              <li>
                                <p>
                                  <span>{data.location.cp}</span>
                                </p>
                              </li>
                              <li>
                                <p>
                                  <span>Argentina</span>
                                </p>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div></>
  )
}

export default BasicInformation