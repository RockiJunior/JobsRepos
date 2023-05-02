import { useSelector } from "react-redux";

const Details = () => {
  // * States
  const data = useSelector((state) => state.properties.singleProperty);

  return (
    <div className="col-lg-12">
      <div className="additional_details pb40 mt50 bb1">
        <div className="row">
          <div className="col-lg-12">
            <h4 className="mb15">Detalles de la propiedad</h4>
          </div>
          <div className="col-md-6 col-lg-6 col-xl-4">
            <ul className="list-inline-item">
              <li className="d-flex">
                <p className="flaticon-living-room pr-2"></p>
                <p>Cubierta: {data.characteristics.covered ? "SI" : "NO"}</p>
              </li>
              <li className="d-flex">
                <p className="flaticon-bed pr-2"></p>
                <p>Montacargas: {data.characteristics.lift ? "SI" : "NO"}</p>
              </li>
              <li className="d-flex">
                <p className="flaticon-bath pr-2"></p>
                <p>
                  Adentro de un edificio:{" "}
                  {data.characteristics.building ? "SI" : "NO"}
                </p>
              </li>
              <li className="d-flex">
                <p className="flaticon-bath pr-2"></p>
                <p>
                  En subsuelo: {data.characteristics.underground ? "SI" : "NO"}
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
