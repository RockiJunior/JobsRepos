export const DepartamentoHeader = ({ data }) => {
  return (
    <>
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-living-room pr5 vam"></span>
          {data.characteristics.ambience} Ambientes
        </div>
      </li>
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-bed pr5 vam"></span>
          {data.characteristics.bedrooms} Dormitorios
        </div>
      </li>
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-bath pr5 vam"></span>
          {data.characteristics.bedrooms} Baños
        </div>
      </li>
      {data.characteristics.garages > 0 && (
        <li className="list-inline-item mr20">
          <div className="mr20">
            <span className="flaticon-car pr5 vam"></span>
            {data.characteristics.garages} Garage
          </div>
        </li>
      )}
      {/* <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-ruler pr5 vam"></span>{" "}
          {data.surface.totalSurface} m²
        </div>
      </li> */}
      <li className="list-inline-item mr20">
        <span className="flaticon-calendar pr5 vam"></span>{" "}
        {data.antiquity.type === 1
          ? "A estrenar"
          : data.antiquity.type === 2
          ? `${data.antiquity.years} años de antigüedad`
          : "En construcción"}
      </li>
    </>
  );
};

export const CocheraHeader = ({ data }) => {
  return (
    <>
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-ruler pr5 vam"></span>{" "}
          {data.surface.totalSurface} m²
        </div>
      </li>
      <li className="list-inline-item mr20">
        <span className="flaticon-calendar pr5 vam"></span>{" "}
        {data.antiquity.type === 1
          ? "A estrenar"
          : data.antiquity.type === 2
          ? `${data.antiquity.years} años de antigüedad`
          : "En construcción"}
      </li>
    </>
  );
};

export const TerrenoHeader = ({ data }) => {
  return (
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-ruler pr5 vam"></span>{" "}
          {data.surface.totalSurface} m²
        </div>
      </li>
  );
};

export const LocalHeader = ({ data }) => {
    return (
      <>
        <li className="list-inline-item mr20">
          <div className="mr20">
            <span className="flaticon-living-room pr5 vam"></span>
            {data.characteristics.ambience} Ambientes
          </div>
        </li>
        <li className="list-inline-item mr20">
          <div className="mr20">
            <span className="flaticon-bath pr5 vam"></span>
            {data.characteristics.bedrooms} Baños
          </div>
        </li>
        {data.characteristics.garages > 0 && (
          <li className="list-inline-item mr20">
            <div className="mr20">
              <span className="flaticon-car pr5 vam"></span>
              {data.characteristics.garages} Garage
            </div>
          </li>
        )}
        <li className="list-inline-item mr20">
          <div className="mr20">
            <span className="flaticon-ruler pr5 vam"></span>{" "}
            {data.surface.totalSurface} m²
          </div>
        </li>
        <li className="list-inline-item mr20">
          <span className="flaticon-calendar pr5 vam"></span>{" "}
          {data.antiquity.type === 1
            ? "A estrenar"
            : data.antiquity.type === 2
            ? `${data.antiquity.years} años de antigüedad`
            : "En construcción"}
        </li>
      </>
    );
  };