import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/Footer";
import RealEstateCard from "../components/realEstateList/RealEstateCard";
import { getRealEstates } from "../redux/realEstateSlice";
import { Formik, Field, Form } from "formik";
import { estateSearchSchema } from "../utils/validations/validationSchema";
import loaderIcon from "../assets/img/spinner.png";
import ReactPaginate from "react-paginate";
import { useLocation, useNavigate } from "react-router-dom";

const RealEstateList = () => {
  // * States
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCard, setIsLoadingCard] = useState(true);
  const [page, setPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [field, setField] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const realEstates = useSelector((state) => state.realEstates.realEstates);
  const searchLimit = process.env.REACT_APP_PROPERTIES_LIMIT;
  const location = useLocation();

  // * Methods
  const FetchData = async () => {
    setIsLoadingCard(true);
    setTimeout(async () => {
      await dispatch(getRealEstates(field, page - 1));
      setIsLoading(false);
      setIsLoadingCard(false);
    }, [1000]);
  };

  const HandlePageChange = (page) => setPage(page.selected + 1);

  const Navigate = () => {
    console.log("Navego");
    navigate(`?${field ? `buscar=${field}&` : ""}pagina=${page || 1}`);
    FetchData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ResultsBuilder = () => {
    const limit =
      searchLimit * page > realEstates?.allRealEstateLength
        ? realEstates?.allRealEstateLength
        : searchLimit * page;
    return [
      `Mostrando del ${searchLimit * (page - 1) + 1} al ${limit}`,
      `${realEstates?.allRealEstateLength} ${
        realEstates?.allRealEstateLength === 1
          ? ` resultado encontrado`
          : ` resultados encontrados`
      } `,
    ];
  };

  // * Life Cycle
  useEffect(() => {
    const page = new URLSearchParams(location.search).get("pagina");
    page ? setPage(Number(page)) : setPage(1);
    console.log("page: ", Number(page));
    window.scrollTo({ top: 0 });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    page && Navigate();
    // eslint-disable-next-line
  }, [field, page]);

  useEffect(() => {
    if (realEstates?.allRealEstateLength > 0)
      setTotalPages(
        Math.ceil(
          realEstates.allRealEstateLength /
            Number(process.env.REACT_APP_PROPERTIES_LIMIT)
        )
      );
    else setTotalPages(0);
  }, [realEstates]);

  useEffect(() => console.log(realEstates), [realEstates]);

  return (
    <div className="wrapper">
      {isLoading ? (
        <div className="preloader" />
      ) : (
        <>
          {/* Inner Page Breadcrumb */}
          <section className="inner_page_breadcrumb style4 pb0 pt60">
            <div className="container">
              <div className="row">
                <div className="real-estate-left-col" />
                <div className="">
                  <div className="breadcrumb_content style2 d-flex flex-column">
                    <h2 className="breadcrumb_title">Lista de Inmobiliarias</h2>
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="/">Inicio</a>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Inmobiliarias
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className="real-estate-container container d-flex">
              {/* Search widget */}
              <div className="real-list-search">
                <div className="sidebar">
                  <div className="sidebar_agent_search_widget mb30">
                    <h4 className="title mb15">Buscar Inmobiliaria</h4>
                    <div className="agent_search_form">
                      <Formik
                        initialValues={{
                          field: "",
                        }}
                        validationSchema={estateSearchSchema}
                        onSubmit={(values) => {
                          setPage(1);
                          setField(values.field);
                        }}
                      >
                        {({ errors, touched, values, resetForm }) => (
                          <Form>
                            <div className="form-group">
                              <div className="form-group ">
                                <Field
                                  type="text"
                                  className="form-control form_control"
                                  placeholder="Nombre, teléfono, dirección..."
                                  name="field"
                                  style={{
                                    borderColor:
                                      errors.field && touched.field && "red",
                                  }}
                                />
                                {errors.field && touched.field && (
                                  <div className="error">{errors.field}</div>
                                )}
                              </div>
                              <button
                                type={!values.field ? "button" : "submit"}
                                className="btn btn-block btn-thm agnt_btn mb0"
                                disabled={!values.field}
                              >
                                {!isLoading ? (
                                  <>
                                    <span className="fa fa-search mr10" />
                                    Buscar
                                  </>
                                ) : (
                                  <img
                                    src={loaderIcon}
                                    className="loading-spinner"
                                    alt="loading"
                                  />
                                )}
                              </button>
                              <div
                                className="list-inline-item mb0 cursor-pointer mt-3 d-flex justify-content-center"
                                onClick={() => {
                                  resetForm();
                                  setField("");
                                }}
                              >
                                <span className="vam flaticon-return mr-2" />
                                Resetear búsqueda
                              </div>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </div>
                </div>
              </div>
              {/* Listing Grid View */}
              <div className="d-flex flex-column w-100">
                <div className="row">
                  {realEstates?.allRealEstateLength !== 0 ? (
                    <div className="listing_filter_row dif db-767">
                      <div className="col-sm-12 col-md-4 col-lg-4 col-xl-5">
                        <div className="left_area tac-xsd mb30-767">
                          <div className="mb0">
                            <div>{ResultsBuilder()[1]}</div>
                            <div className="heading-color">
                              {ResultsBuilder()[0]}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    "0 resultados"
                  )}
                </div>
                {realEstates?.allRealEstateLength === 0 ? (
                  <>
                    <div
                      className="w-100 text-center"
                      style={{ position: "relative" }}
                    >
                      {isLoadingCard && <div className="loader-realestate" />}
                      <div className="no-results-found" />
                      <h2>No existen inmobiliarias con esas características</h2>
                    </div>
                  </>
                ) : (
                  <div className="real-list">
                    {isLoadingCard && <div className="loader-realestate" />}
                    {realEstates?.result?.map((estate) => (
                      <RealEstateCard
                        estate={estate}
                        showLink={true}
                        showBranches={true}
                        key={estate.id}
                      />
                    ))}
                  </div>
                )}
                <ReactPaginate
                  breakLabel="..."
                  previousLabel="< Anterior"
                  nextLabel="Siguiente >"
                  onPageChange={HandlePageChange}
                  pageCount={totalPages}
                  renderOnZeroPageCount={null}
                  containerClassName={"pagination"}
                  previousLinkClassName={"pagination__link"}
                  nextLinkClassName={"pagination__link"}
                  disabledClassName={"pagination__link--disabled"}
                  activeClassName={"pagination__link--active"}
                  forcePage={page - 1}
                  pageRangeDisplayed={4}
                  marginPagesDisplayed={2}
                />
              </div>
            </div>
          </section>
          <Footer />
        </>
      )}
    </div>
  );
};

export default RealEstateList;
