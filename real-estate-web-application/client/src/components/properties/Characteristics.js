export const DepartamentoCharacteristics = ({ data }) => {
  return (
    <>
      <div className="col-md-6 col-lg-6 col-xl-4">
        <ul className="list-inline-item">
          <li className="d-flex">
            <p className="flaticon-price pr-2"></p>
            <p>Precio:</p>
          </li>
          {/* {data.price.expenses > 0 && (
            <li className="d-flex">
              <p className="flaticon-price pr-2"></p>
              <p>Expensas:</p>
            </li>
          )} */}
          <li className="d-flex">
            <p className="flaticon-ruler pr-2"></p>
            <p>Superficie total:</p>
          </li>
          <li className="d-flex">
            <p className="flaticon-ruler pr-2"></p>
            <p>Superficie cubierta:</p>
          </li>
        </ul>
        <ul className="list-inline-item">
          {/* <li>
            <p>
              <span>
                {data.price.currency === 1 ? "USD " : "$"}
                {Number(data.price.total).toLocaleString("en-US")}
              </span>
            </p>
          </li>
          {data.price.expenses > 0 && (
            <li>
              <p>
                <span>
                  ${Number(data.price.expenses).toLocaleString("en-US")}
                </span>
              </p>
            </li>
          )}
          <li>
            <p>
              <span>{data.surface.totalSurface} m²</span>
            </p>
          </li>
          <li>
            <p>
              <span>{data.surface.coveredSurface} m²</span>
            </p>
          </li> */}
        </ul>
      </div>
      <div className="col-md-6 col-lg-6 col-xl-4">
        <ul className="list-inline-item">
          <li className="d-flex">
            <p className="flaticon-living-room pr-2"></p>
            <p>Ambientes:</p>
          </li>
          <li className="d-flex">
            <p className="flaticon-bed pr-2"></p>
            <p>Dormitorios:</p>
          </li>
          <li className="d-flex">
            <p className="flaticon-bath pr-2"></p>
            <p>Baños:</p>
          </li>
          {data.characteristics.toilettes > 0 && (
            <li className="d-flex">
              <p className="flaticon-bath pr-2"></p>
              <p>Toilettes:</p>
            </li>
          )}
          {data.characteristics.garages > 0 && (
            <li className="d-flex">
              <p className="flaticon-car pr-2"></p>
              <p>Garages:</p>
            </li>
          )}
        </ul>
        <ul className="list-inline-item">
          <li>
            <p>
              <span>{data.characteristics.ambience}</span>
            </p>
          </li>
          <li>
            <p>
              <span>{data.characteristics.bedrooms}</span>
            </p>
          </li>
          <li>
            <p>
              <span>{data.characteristics.bathrooms}</span>
            </p>
          </li>
          {data.characteristics.toilettes > 0 && (
            <li>
              <p>
                <span>{data.characteristics.toilettes}</span>
              </p>
            </li>
          )}
          {data.characteristics.garages > 0 && (
            <li>
              <p>
                <span>{data.characteristics.garages}</span>
              </p>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export const CocheraCharacteristics = ({ data }) => {
  return (
    <>
      <div className="col-md-6 col-lg-6 col-xl-4">
        <ul className="list-inline-item">
          <li className="d-flex">
            <p className="flaticon-price pr-2"></p>
            <p>Precio:</p>
          </li>
          {data.price.expenses > 0 && (
            <li className="d-flex">
              <p className="flaticon-price pr-2"></p>
              <p>Expensas:</p>
            </li>
          )}
          <li className="d-flex">
            <p className="flaticon-ruler pr-2"></p>
            <p>Superficie:</p>
          </li>
        </ul>
        <ul className="list-inline-item">
          <li>
            <p>
              <span>
                {data.price.currency === 1 ? "USD " : "$"}
                {Number(data.price.total).toLocaleString("en-US")}
              </span>
            </p>
          </li>
          {data.price.expenses > 0 && (
            <li>
              <p>
                <span>
                  ${Number(data.price.expenses).toLocaleString("en-US")}
                </span>
              </p>
            </li>
          )}
          <li>
            <p>
              <span>{data.surface.totalSurface} m²</span>
            </p>
          </li>
        </ul>
      </div>
      <div className="col-md-6 col-lg-6 col-xl-4">
        <ul className="list-inline-item">
          <li className="d-flex">
            <p className="flaticon-living-room pr-2"></p>
            <p>Cubierta</p>
          </li>
          <li className="d-flex">
            <p className="flaticon-bed pr-2"></p>
            <p>Montacargas</p>
          </li>
          <li className="d-flex">
            <p className="flaticon-bath pr-2"></p>
            <p>Adentro de un edificio</p>
          </li>
          <li className="d-flex">
            <p className="flaticon-bath pr-2"></p>
            <p>En subsuelo</p>
          </li>
        </ul>
      </div>
    </>
  );
};

export const LocalCharacteristics = ({ data }) => {
  return (
    <>
      <div className="col-md-6 col-lg-6 col-xl-4">
        <ul className="list-inline-item">
          <li className="d-flex">
            <p className="flaticon-price pr-2"></p>
            <p>Precio:</p>
          </li>
          {data.price.expenses > 0 && (
            <li className="d-flex">
              <p className="flaticon-price pr-2"></p>
              <p>Expensas:</p>
            </li>
          )}
          <li className="d-flex">
            <p className="flaticon-ruler pr-2"></p>
            <p>Superficie total:</p>
          </li>
          <li className="d-flex">
            <p className="flaticon-ruler pr-2"></p>
            <p>Superficie cubierta:</p>
          </li>
        </ul>
        <ul className="list-inline-item">
          <li>
            <p>
              <span>
                {data.price.currency === 1 ? "USD " : "$"}
                {Number(data.price.total).toLocaleString("en-US")}
              </span>
            </p>
          </li>
          {data.price.expenses > 0 && (
            <li>
              <p>
                <span>
                  $ {Number(data.price.expenses).toLocaleString("en-US")}
                </span>
              </p>
            </li>
          )}
          <li>
            <p>
              <span>{data.surface.totalSurface} m²</span>
            </p>
          </li>
          <li>
            <p>
              <span>{data.surface.coveredSurface} m²</span>
            </p>
          </li>
        </ul>
      </div>
      <div className="col-md-6 col-lg-6 col-xl-4">
        <ul className="list-inline-item">
          <li className="d-flex">
            <p className="flaticon-living-room pr-2"></p>
            <p>Ambientes:</p>
          </li>
          <li className="d-flex">
            <p className="flaticon-bath pr-2"></p>
            <p>Baños:</p>
          </li>
          {data.characteristics.toilettes > 0 && (
            <li className="d-flex">
              <p className="flaticon-bath pr-2"></p>
              <p>Toilettes:</p>
            </li>
          )}
          {data.characteristics.garages > 0 && (
            <li className="d-flex">
              <p className="flaticon-car pr-2"></p>
              <p>Garages:</p>
            </li>
          )}
        </ul>
        <ul className="list-inline-item">
          <li>
            <p>
              <span>{data.characteristics.ambience}</span>
            </p>
          </li>
          <li>
            <p>
              <span>{data.characteristics.bathrooms}</span>
            </p>
          </li>
          {data.characteristics.toilettes > 0 && (
            <li>
              <p>
                <span>{data.characteristics.toilettes}</span>
              </p>
            </li>
          )}
          {data.characteristics.garages > 0 && (
            <li>
              <p>
                <span>{data.characteristics.garages}</span>
              </p>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export const TerrenoCharacteristics = ({ data }) => {
  return (
    <div className="col-md-6 col-lg-6 col-xl-4">
      <ul className="list-inline-item">
        <li className="d-flex">
          <p className="flaticon-price pr-2"></p>
          <p>Precio:</p>
        </li>
        <li className="d-flex">
          <p className="flaticon-ruler pr-2"></p>
          <p>Superficie:</p>
        </li>
      </ul>
      <ul className="list-inline-item">
        <li>
          <p>
            <span>
              {data.price.currency === 1 ? "USD " : "$"}
              {Number(data.price.total).toLocaleString("en-US")}
            </span>
          </p>
        </li>
        <li>
          <p>
            <span>{data.surface.totalSurface} m²</span>
          </p>
        </li>
      </ul>
    </div>
  );
};
