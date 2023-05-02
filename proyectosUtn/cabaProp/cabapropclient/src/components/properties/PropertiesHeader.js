export const ApartmentHeader = ({ data }) => {
  return (
    <>
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-ruler pr5 vam" />
          {data.surface.totalSurface} m²
        </div>
      </li>
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-living-room pr5 vam" />
          {data.characteristics.ambience} Ambientes
        </div>
      </li>
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-bed pr5 vam" />
          {data.characteristics.bedrooms} Dormitorios
        </div>
      </li>
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-bath pr5 vam" />
          {data.characteristics.bathrooms} Baños
        </div>
      </li>
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-bath pr5 vam" />
          {data.characteristics.toilettes} Toilettes
        </div>
      </li>
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-car pr5 vam" />
          {data.characteristics.garages} Cocheras
        </div>
      </li>
      <li className="list-inline-item mr20">
        <span className="flaticon-calendar pr5 vam" />
        {data.antiquity.type === 1
          ? "A estrenar"
          : data.antiquity.type === 2
          ? `${data.antiquity.years} años de antigüedad`
          : "En construcción"}
      </li>
    </>
  );
};

export const SurfaceHeader = ({ data }) => {
  return (
    <>
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-ruler pr5 vam" />
          {data.surface.totalSurface} m²
        </div>
      </li>
      {data.property_type !== 10 && (
        <li className="list-inline-item mr20">
          <span className="flaticon-calendar pr5 vam" />
          {data.antiquity.type === 1
            ? "A estrenar"
            : data.antiquity.type === 2
            ? `${data.antiquity.years} años de antigüedad`
            : "En construcción"}
        </li>
      )}
    </>
  );
};

export const ShopHeader = ({ data }) => {
  return (
    <>
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-ruler pr5 vam" />
          {data.surface.totalSurface} m²
        </div>
      </li>
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-living-room pr5 vam" />
          {data.characteristics.ambience} Ambientes
        </div>
      </li>
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-bath pr5 vam" />
          {data.characteristics.bathrooms} Baños
        </div>
      </li>
      <li className="list-inline-item mr20">
        <span className="flaticon-calendar pr5 vam" />
        {data.antiquity.type === 1
          ? "A estrenar"
          : data.antiquity.type === 2
          ? `${data.antiquity.years} años de antigüedad`
          : "En construcción"}
      </li>
    </>
  );
};

export const HotelHeader = ({ data }) => {
  return (
    <>
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-ruler pr5 vam" />
          {data.surface.totalSurface} m²
        </div>
      </li>
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-bed pr5 vam" />
          {data.characteristics.bedrooms} Habitaciones
        </div>
      </li>
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-car pr5 vam" />
          {data.characteristics.garages} Cocheras
        </div>
      </li>
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-bath pr5 vam" />
          Baño privado: {data.characteristics.privateBathRooms ? "Si" : "No"}
        </div>
      </li>
      <li className="list-inline-item mr20">
        <span className="flaticon-calendar pr5 vam" />
        {data.antiquity.type === 1
          ? "A estrenar"
          : data.antiquity.type === 2
          ? `${data.antiquity.years} años de antigüedad`
          : "En construcción"}
      </li>
    </>
  );
};

export const BuildingHeader = ({ data }) => {
  return (
    <>
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-ruler pr5 vam" />
          {data.surface.totalSurface} m²
        </div>
      </li>
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-ruler pr5 vam" />
          {data.characteristics.floors} Pisos
        </div>
      </li>
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-house pr5 vam" />
          {data.characteristics.apartments} Departamentos totales
        </div>
      </li>
      <li className="list-inline-item mr20">
        <div className="mr20">
          <span className="flaticon-car pr5 vam" />
          {data.characteristics.garages} Cocheras
        </div>
      </li>
      <li className="list-inline-item mr20">
        <span className="flaticon-calendar pr5 vam" />
        {data.antiquity.type === 1
          ? "A estrenar"
          : data.antiquity.type === 2
          ? `${data.antiquity.years} años de antigüedad`
          : "En construcción"}
      </li>
    </>
  );
};
