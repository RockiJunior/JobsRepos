import { apartmentExtras } from "../components/models/searchInfo";

export const UrlBuilder = (data, page, estateName = "") => {
  // console.log("URL DATA ", data);

  // * Build operation, property, and neighbourhood
  const operation = data.operation.label.toLowerCase();

  let property = "";
  for (let i = 0; i < data.property.length; i++)
    property += `-${data.property[i].tag}`;

  let barrios = "";
  for (let i = 0; i < data.location.length; i++)
    barrios += `-${data.location[i].tag}`;

  // * Build price: min, max, and currency
  let price = "";
  if (data.price.main === "ARS") {
    if (data.price.currencyARS.min || data.price.currencyARS.max)
      price = `-${data.price.currencyARS.tag}`;
    if (data.price.currencyARS.min)
      price = price.concat(`_desde_${data.price.currencyARS.min}`);
    if (data.price.currencyARS.max)
      price = price.concat(`_hasta_${data.price.currencyARS.max}`);
  } else {
    price = `-${data.price.currencyUSD.tag}`;
    if (data.price.currencyUSD.min)
      price = price.concat(`_desde_${data.price.currencyUSD.min}`);
    if (data.price.currencyUSD.max)
      price = price.concat(`_hasta_${data.price.currencyUSD.max}`);
  }

  // * Build surface: min, max, and type
  let surface = "";
  if (data.surface.type) {
    if (data.surface.min || data.surface.max) surface = `-${data.surface.tag}`;
    if (data.surface.min)
      surface = surface.concat(`_desde_${data.surface.min}`);
    if (data.surface.max)
      surface = surface.concat(`_hasta_${data.surface.max}`);
  }

  // * Build ambiences, bathrooms, bedrooms, and garages
  let ambiences = "";
  if (data.ambiences && data.ambiences.value !== 0)
    ambiences = ambiences.concat(
      `-${data.ambiences.tag}_${String(data.ambiences.value)}`
    );

  let bathrooms = "";
  if (data.bathRooms && data.bathRooms.value !== 0)
    bathrooms = bathrooms.concat(
      `-${data.bathRooms.tag}_${String(data.bathRooms.value)}`
    );

  let bedrooms = "";
  if (data.bedRooms && data.bedRooms.value !== 0)
    bedrooms = bedrooms.concat(
      `-${data.bedRooms.tag}_${String(data.bedRooms.value)}`
    );

  let garages = "";
  if (data.garages && data.garages.value !== 0)
    garages = garages.concat(
      `-${data.garages.tag}_${String(data.garages.value)}`
    );

  // * Build extras
  let extras = "";
  for (let value of data.extras) {
    let findExtraGeneral = apartmentExtras.caracteristicasGenerales.find(
      (prop) => prop.id === value
    );
    if (findExtraGeneral) extras = extras + `-${findExtraGeneral.label}`;
    let findExtraCharac = apartmentExtras.caracteristicas.find(
      (prop) => prop.id === value
    );
    if (findExtraCharac) extras = extras + `-${findExtraCharac.label}`;
    let findExtraServices = apartmentExtras.servicios.find(
      (prop) => prop.id === value
    );
    if (findExtraServices) extras = extras + `-${findExtraServices.label}`;
    let findExtraAmbiences = apartmentExtras.ambientes.find(
      (prop) => prop.id === value
    );
    if (findExtraAmbiences) extras = extras + `-${findExtraAmbiences.label}`;
  }

  // console.log("me llegó esta Estate ID: ", realEstateId);

  return `${
    estateName && `/${estateName}`
  }/propiedades/${operation}${property}${barrios}${price}${surface}${ambiences}${bathrooms}${bedrooms}${garages}${extras}?page=${page}
  `;
};
