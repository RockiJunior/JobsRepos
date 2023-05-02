import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menu from "../components/favorites/Menu";
import ResponsiveMenu from "../components/favorites/ResponsiveMenu";
import { getSearches } from "../redux/searchesSlice";
import SavedSearchItem from "../components/savedSearches/SavedSearchItem";

const SavedSearches = () => {
  const dispatch = useDispatch();
  const userLogged = useSelector((state) => state.login.currentUser);
  const data = useSelector((state) => state.searches.searches);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    await dispatch(getSearches(userLogged.id));
    setIsLoading(false);
  };

  console.log(data);

  useEffect(() => {
    if (userLogged?.id) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLogged]);

  return (
    <div className="wrapper bgc-alice-blue mi-actividad">
      <Menu item={3} />
      <section
        style={{ marginTop: -100 }}
        className="our-dashbord dashbord bgc-alice-blue"
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-2 dn-lg pl0" />
            <div className="col-xl-10">
              <div className="row">
                <div className="col-lg-12">
                  <ResponsiveMenu item={3} />
                </div>
                <div className="col-lg-12 mb50">
                  <div className="breadcrumb_content">
                    <h2 className="breadcrumb_title">Búsquedas guardadas</h2>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="invoice_table faborites table-responsive">
                    {isLoading ? (
                      <div className="preloader" />
                    ) : (
                      <>
                        {data?.allSearchesLength > 0 ? (
                          <table className="table table-borderless mb50">
                            <thead className="thead-light">
                              <tr>
                                <th scope="col">Búsquedas</th>
                                <th scope="col"></th>
                                <th
                                  className="d-flex justify-content-center"
                                  scope="col"
                                >
                                  Alertas
                                </th>
                                <th scope="col">Guardada</th>
                                <th scope="col">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.result.map((search) => (
                                <SavedSearchItem
                                  key={search.id}
                                  data={search}
                                  fetchData={fetchData}
                                />
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="w-100 text-center">
                            <h2 className="m-0">
                              No tenés ninguna búsqueda guardada
                            </h2>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SavedSearches;
