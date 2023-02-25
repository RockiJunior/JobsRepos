import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import List from "../components/favorites/List";
import Menu from "../components/favorites/Menu";
import Pagination from "../components/favorites/Pagination";
import ResponsiveMenu from "../components/favorites/ResponsiveMenu";
import { getFavorites } from "../redux/favoritesSlice";
import { getPopularProperties } from "../redux/propertiesSlice";

const Favorites = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector((state) => state.favorites.favorites);
  const userLogged = useSelector((state) => state.login.currentUser);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = () => {
    dispatch(getFavorites(userLogged?.id));
    setIsLoading(false);
  };

  useEffect(() => {
    if (userLogged?.id) {
      fetchData();
    }
  }, [userLogged]);

  return (
    <div className="wrapper bgc-alice-blue mi-actividad">
      <Menu item={3} />
      {!data ? (
      <div className="preloader"></div>
      ) : (
        <>
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
                        <h2 className="breadcrumb_title">Mis Favoritos</h2>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="invoice_table faborites table-responsive">
                        {isLoading && <div className="preloader"></div>}
                        {data && !isLoading && (
                          <Pagination
                            data={data}
                            fetchData={fetchData}
                            isLoading={isLoading}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Favorites;
