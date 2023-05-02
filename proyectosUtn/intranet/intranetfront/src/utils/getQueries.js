export const getQueries = queries => {
  if (queries) {
    const queryObject = Object.keys(queries);

    const query = queryObject
      .map(key => (queries[key] ? `${key}=${queries[key]}` : ''))
      .filter(q => !!q)
      .join('&');

    return query ? `?${query}` : '';
  }
  return '';
};
