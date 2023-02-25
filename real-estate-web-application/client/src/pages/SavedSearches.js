import React, { useEffect, useState } from "react";
import Menu from "../components/favorites/Menu";
import Pagination from "../components/savedSearches/Pagination";
import ResponsiveMenu from "../components/favorites/ResponsiveMenu";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSearches } from "../redux/searchesSlice";

const SavedSearches = () => {
  const dispatch = useDispatch();
  const userLogged = useSelector((state) => state.login.currentUser);
  const data = useSelector((state) => state.searches.searches);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = () => {
    dispatch(getSearches(userLogged.id));
      setIsLoading(false);
  };

  useEffect(() => {
    if (userLogged?.id) {
      fetchData();
    }
  }, [userLogged]);

  return (
    <div className="wrapper bgc-alice-blue mi-actividad">
      <Menu item={4} />
      <section
        style={{ marginTop: -100 }}
        className="our-dashbord dashbord bgc-alice-blue"
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-2 dn-lg pl0"></div>
            <div className="col-xl-10">
              <div className="row">
                <div className="col-lg-12">
                  <ResponsiveMenu />
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
                    {isLoading && <div className="preloader"></div>}
                    {data && data.length > 0 && !isLoading && (
                      <Pagination
                        data={data}
                        fetchData={fetchData}
                        isLoading={isLoading}
                      />
                    )}
                    {data && data.length === 0 && !isLoading && (
                      <div className="w-100 text-center">
                        <h2>No tenés ninguna búsqueda guardada</h2>
                      </div>
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
