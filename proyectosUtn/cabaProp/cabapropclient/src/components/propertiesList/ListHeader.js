import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ListHeader = ({ page }) => {
  // * States
  const [data, setData] = useState();
  const searchLimit = process.env.REACT_APP_PROPERTIES_LIMIT;

  // * Hooks
  const storeData = useSelector((state) => state.properties.properties);

  // * Methods
  const ResultsBuilder = () => {
    const limit =
      searchLimit * page > data.allPropertiesLength
        ? data.allPropertiesLength
        : searchLimit * page;
    return [
      `Mostrando del ${searchLimit * (page - 1) + 1} al ${limit}`,
      `${data.allPropertiesLength} ${
        data.allPropertiesLength === 1
          ? " resultado encontrado"
          : " resultados encontrados"
      }`,
    ];
  };

  // * Life Cycle
  useEffect(() => {
    storeData && setData(storeData);
  }, [storeData]);

  return (
    <div className="row">
      {data && data.allPropertiesLength !== 0 ? (
        <div className="listing_filter_row dif db-767">
          <div className="col-sm-12 col-md-4 col-lg-4 col-xl-5">
            <div className="left_area tac-xsd mb30-767">
              <div className="mb0">
                <div>{ResultsBuilder()[1]}</div>
                <div className="heading-color">{ResultsBuilder()[0]}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        "0 resultados"
      )}
    </div>
  );
};

export default ListHeader;
