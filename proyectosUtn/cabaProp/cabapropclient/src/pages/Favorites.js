import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menu from "../components/favorites/Menu";
import ResponsiveMenu from "../components/favorites/ResponsiveMenu";
import { getFavorites } from "../redux/favoritesSlice";
import FavoriteCard from "../components/favorites/FavoriteCard";

const Favorites = () => {
  // * States
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const userLogged = useSelector((state) => state.login.currentUser);
  const data = useSelector((state) => state.favorites.favorites)?.result.filter(
    (prop) => prop.property?.status === "published"
  );

  // * Methods
  const fetchData = async () => {
    await dispatch(getFavorites(userLogged?.id, 0));
    setIsLoading(false);
  };

  useEffect(() => {
    if (userLogged?.id) {
      fetchData();
    }
    //eslint-disable-next-line
  }, [userLogged]);

  return (
    <div className="wrapper bgc-alice-blue mi-actividad">
      <Menu item={2} />
      {!data ? (
        <div className="preloader" />
      ) : (
        <>
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
                      <ResponsiveMenu item={2} />
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
                        {isLoading && <div className="preloader" />}
                        {!isLoading && data?.length > 0 ? (
                          <table className="table table-borderless mb50">
                            <tbody>
                              {data.map((prop) => (
                                <FavoriteCard
                                  key={prop.property._id}
                                  prop={prop}
                                  fetchData={fetchData}
                                />
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="w-100 text-center">
                            <h2 className="m-0">
                              No tenés ninguna propiedad guardada
                            </h2>
                          </div>
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
