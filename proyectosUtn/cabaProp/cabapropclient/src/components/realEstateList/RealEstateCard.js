import { getSingleRealEstate } from "../../redux/realEstateSlice";
import { useDispatch } from "react-redux";
import { NormalizeString } from "../../utils/normalize.utils";
import { useNavigate } from "react-router-dom";
import { BsHouseDoor } from "react-icons/bs";
import { BiTime } from "react-icons/bi";
import { AiOutlinePhone, AiOutlineMail } from "react-icons/ai";
import { Link } from "react-router-dom";
// import { TbLicense } from "react-icons/tb";

const RealEstateCard = ({ estate, showLink, showBranches }) => {
  // * States
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // * Methods
  const FetchEstate = async (id, name) => {
    await dispatch(getSingleRealEstate(id));
    const realEstateName = NormalizeString(name);
    const url = `/${realEstateName}/propiedades/alquiler?page=1`;
    // window.open(`${process.env.REACT_APP_CLIENT}${url}`, "_blank");
    navigate(url);
  };

  return (
    <div className="row">
      <div className="col-12 mb-4 real-list-single-container">
        <div className="feat_property list agent real-list-single d-flex flex-column">
          <div className="real-estate-content">
            <div className="thumb real-list-single-thumb">
              <img className="img-whp" src={estate.logo} alt={estate.name} />
            </div>
            <div className="details" style={{ width: "100%" }}>
              <div className="real-estate-tc_content">
                <h4>{estate.name}</h4>
                <div className="real-estate-details">
                  <div className="mr-5">
                    <ul className="prop_details mb0">
                      {/* <li>
                        <span
                          className="mr-1"
                          style={{
                            fontWeight: "500",
                            color: "black",
                          }}
                        >
                          <TbLicense size={18} /> Matrícula:
                        </span>
                        {estate.license}
                      </li> */}
                      <li className="real-estate-item">
                        <span
                          className="mr-1"
                          style={{
                            fontWeight: "500",
                            color: "black",
                          }}
                        >
                          <BsHouseDoor size={18} /> Dirección:
                        </span>
                        <span>{estate.branchOffice[0].address}</span>
                      </li>
                      <li className="real-estate-item">
                        <span
                          className="mr-1"
                          style={{
                            fontWeight: "500",
                            color: "black",
                          }}
                        >
                          <BiTime size={18} /> Horario de atención:
                        </span>
                        <span>{estate.branchOffice[0].openingHours}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mr-5">
                    <ul className="prop_details mb0">
                      <li>
                        <span
                          className="mr-1"
                          style={{
                            fontWeight: "500",
                            color: "black",
                          }}
                        >
                          <AiOutlinePhone size={18} /> Teléfono:
                        </span>
                        <span>{estate.branchOffice[0].phoneNumber}</span>
                      </li>
                      <li>
                        <span
                          className="mr-1"
                          style={{
                            fontWeight: "500",
                            color: "black",
                          }}
                        >
                          <AiOutlineMail size={18} /> Correo:
                        </span>
                        <Link to="mailto:info@colegioinmobiliario.org.ar?subject=Info - Mensaje Web">
                          <span>info@colegioinmobiliario.org.ar</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {showLink && (
                <div className="fp_footer">
                  <div
                    className="fp_pdate float-left text-thm cursor-pointer"
                    onClick={() => FetchEstate(estate.id, estate.name)}
                  >
                    Lista de propiedades
                  </div>
                </div>
              )}
            </div>
          </div>

          {showBranches &&
            estate.branchOffice.map((office) => {
              if (office.isCentral) return null;
              return (
                <div
                  className="sidebar_accordion_widget"
                  style={{ margin: "0 20px" }}
                  key={office.id}
                >
                  <div id="accordion" className="panel-group">
                    <div className="panel" key={office.id}>
                      <div className="panel-heading">
                        <h4 className="panel-title other_fet">
                          <a
                            href={`#office${office.id}`}
                            className="accordion-toggle link text-thm"
                            data-toggle="collapse"
                            data-parent="#accordion"
                          >
                            <i className="icon fa fa-plus" />{" "}
                            {office.branch_office_name}
                          </a>
                        </h4>
                      </div>
                      <div
                        id={`office${office.id}`}
                        className="panel-collapse collapse"
                        style={{ marginLeft: "2rem" }}
                      >
                        <div className="panel-body" style={{ width: "100%" }}>
                          <ul className="ui_kit_checkbox selectable-list mb-4">
                            <div className="tc_content" key={office.id}>
                              <div className="prop_details d-flex flex-wrap">
                                <div className="mr-3 mb-1">
                                  <span
                                    className="mr-1"
                                    style={{
                                      fontWeight: "500",
                                      color: "black",
                                    }}
                                  >
                                    <span>
                                      <BsHouseDoor size={18} /> Dirrección:
                                    </span>
                                  </span>
                                  {office.address}
                                </div>
                                <div className="mr-3">
                                  <span
                                    className="mr-1"
                                    style={{
                                      fontWeight: "500",
                                      color: "black",
                                    }}
                                  >
                                    <span>
                                      {" "}
                                      <BiTime size={18} /> Horario de atención:
                                    </span>
                                  </span>
                                  {office.openingHours}
                                </div>
                                <div className="mr-3">
                                  <span
                                    className="mr-1"
                                    style={{
                                      fontWeight: "500",
                                      color: "black",
                                    }}
                                  >
                                    <span>
                                      <AiOutlinePhone size={18} /> Teléfono:
                                    </span>
                                  </span>
                                  {office.phoneNumber}
                                </div>
                                <div>
                                  <span
                                    className="mr-1"
                                    style={{
                                      fontWeight: "500",
                                      color: "black",
                                    }}
                                  >
                                    <span>
                                      <AiOutlineMail size={18} /> Correo:
                                    </span>
                                  </span>
                                  mail@mail.com
                                </div>
                              </div>
                            </div>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default RealEstateCard;
