import React from "react";
import {
  CocheraCharacteristics,
  DepartamentoCharacteristics,
  LocalCharacteristics,
  TerrenoCharacteristics,
} from "../properties/Characteristics";

const Details = ({ data }) => {
  return (
    <div className="col-lg-12">
      <div className="additional_details pb40 mt50 bb1">
        <div className="row">
          <div className="col-lg-12">
            <h4 className="mb15">Detalles de la propiedad</h4>
          </div>
          {data.property_type === 1 ||
          data.property_type === 2 ||
          data.property_type === 3 ? (
            <DepartamentoCharacteristics data={data} />
          ) : data.property_type === 4 ? (
            <CocheraCharacteristics data={data} />
          ) : data.property_type === 5 ||
            data.property_type === 6 ||
            data.property_type === 7 ||
            data.property_type === 8 ? (
            <LocalCharacteristics data={data} />
          ) : (
            data.property_type === 9 && <TerrenoCharacteristics data={data} />
          )}
          <div className="col-md-6 col-lg-6 col-xl-4">
            <ul className="list-inline-item">
              <li className="d-flex">
                <p className="flaticon-business-and-trade pr-2"></p>
                <p>Tipo de propiedad:</p>
              </li>
              <li className="d-flex">
                <p className="flaticon-checked pr-2"></p>
                <p>Estado de la propiedad:</p>
              </li>
            </ul>
            <ul className="list-inline-item">
              <li>
                <p>
                  <span>
                    {data.property_type === 1
                      ? "Departamento"
                      : data.property_type === 2
                      ? "Casa"
                      : data.property_type === 3
                      ? "PH"
                      : data.property_type === 4
                      ? "Cochera"
                      : data.property_type === 5
                      ? "Consultorio"
                      : data.property_type === 6
                      ? "Fondo de comercio"
                      : data.property_type === 7
                      ? "Local comercial"
                      : data.property_type === 8
                      ? "Bodega"
                      : data.property_type === 9 && "Terreno"}
                  </span>
                </p>
              </li>
              <li>
                <p>
                  <span>
                    {data.operation_type === 1
                      ? "En venta"
                      : data.operation_type === 2
                      ? "En alquiler"
                      : data.operation_type === 3 && "Alquiler temporario"}
                  </span>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
