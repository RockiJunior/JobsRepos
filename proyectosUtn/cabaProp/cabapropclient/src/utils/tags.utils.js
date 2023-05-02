import { totalExtras } from "../components/models/searchInfo";

export const GenerateTags = (filters) => {
  let tagsArray = [filters.operation.label];
  if (filters.property.length > 0)
    filters.property.map((el) => (tagsArray = [...tagsArray, el.label]));
  if (filters.location.length > 0)
    filters.location.map((el) => (tagsArray = [...tagsArray, el.label]));
  if (filters.ambiences !== 0)
    tagsArray = [
      ...tagsArray,
      `${filters.ambiences.name}: ${filters.ambiences.value}`,
    ];
  if (filters.bathRooms !== 0)
    tagsArray = [
      ...tagsArray,
      `${filters.bathRooms.name}: ${filters.bathRooms.value}`,
    ];
  if (filters.bedRooms !== 0)
    tagsArray = [
      ...tagsArray,
      `${filters.bedRooms.name}: ${filters.bedRooms.value}`,
    ];
  if (filters.garages !== 0)
    tagsArray = [
      ...tagsArray,
      `${filters.garages.name}: ${filters.garages.value}`,
    ];
  if (filters.surface.min)
    tagsArray = [...tagsArray, `desde ${filters.surface.min} m2`];
  if (filters.surface.max)
    tagsArray = [...tagsArray, `hasta ${filters.surface.max} m2`];
  if (filters.price.min)
    tagsArray = [
      ...tagsArray,
      `desde ${filters.price.min} ${filters.price.currency}`,
    ];
  if (filters.price.max)
    tagsArray = [
      ...tagsArray,
      `hasta ${filters.price.max} ${filters.price.currency}`,
    ];
  if (filters.extras.length > 0)
    filters.extras.map(
      (extra) =>
        (tagsArray = [
          ...tagsArray,
          totalExtras.find((e) => e.id === extra).name,
        ])
    );
  return tagsArray;
};
