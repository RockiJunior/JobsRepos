import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import messageHandler from "../../utils/messageHandler";
import socket from "../Socket";
import loaderIcon from "../../assets/img/spinner.png";
import { ErrorHandler } from "../../utils/errorHandler.utils";
import { Link } from "react-router-dom";

const Contact = ({ setShowModal, property }) => {
  // * States
  const token = localStorage.getItem("token");
  const userLogged = useSelector((state) => state.login.currentUser);
  const [errorMsg, setErrorMsg] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    name: userLogged ? `${userLogged.firstName} ${userLogged.lastName}` : "",
    phone: (userLogged && userLogged.phoneNumber) || "",
    email: userLogged ? userLogged.email : "",
    message: "Hola, estoy interesado en esta propiedad",
  });

  // * Methods
  const HandleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!errorMsg) {
      try {
        // Check if the conversation exists
        const res = await axios({
          method: "GET",
          url: `${process.env.REACT_APP_SERVER}/conversations/conversation/${userLogged.id}/${property._id}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // If it does, sends a message with the conver ID and the B.O. id
        if (res.data.id) {
          const body = {
            propertyId: property._id,
            clientId: userLogged.id,
            branchOfficeId: property.branch_office.id,
            message: data.message,
            conversationId: res.data.id,
          };
          sendMessage(body);
          // Else, sends a message without a conver ID and the entire B.O. object
        } else {
          const body = {
            propertyId: property._id,
            clientId: userLogged.id,
            branchOfficeId: property.branch_office,
            message: data.message,
          };
          sendMessage(body);
        }
      } catch (error) {
        ErrorHandler(null, error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const sendMessage = (body) => {
    socket.emit("send_message", body);
    messageHandler("success", "Mensaje enviado con éxito.");
    if (setShowModal) setShowModal();
  };

  return (
    <>
      {/* <div className="listing_single_sidebar"> */}
      <div className="sidebar_agent_search_widget mb30">
        <div className="media">
          <img
            className="mr-3 author_img"
            src={property.real_estate.logo}
            alt={property.real_estate.name}
          />
          <div className="media-body">
            <h5 className="mt10 mb5 fz16 heading-color fw600">
              {property.real_estate.name}
            </h5>
            <p className="mb0">{property.branch_office.phoneNumber}</p>
            {/* <a className="tdu text-thm">Ver todas las propiedades</a> */}
          </div>
        </div>
        <div className="agent_search_form">
          {/* <form> */}
          <div className="mb30">
            <h5 className="m-0 pt-4 font-weight-bold">Nombre</h5>
            <input
              type="text"
              className="form-control form_control pl-1 m-0"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>
          <div className="mb30">
            <h5 className="m-0 font-weight-bold">Email</h5>
            <input
              type="email"
              className="form-control form_control pl-1"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>
          <div className="mb30">
            <h5 className="m-0 font-weight-bold">Teléfono</h5>
            <input
              type="number"
              className="form-control form_control pl-1"
              value={data.phone}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
            />
          </div>
          <div className="mb30">
            <textarea
              name="form_message"
              className="form-control"
              rows="5"
              style={{ borderColor: errorMsg && "red" }}
              value={data.message}
              placeholder="Mensaje..."
              onChange={(e) => {
                setData({ ...data, message: e.target.value });
                e.target.value.trim() !== "" && setErrorMsg(false);
              }}
              onBlur={() => data.message.trim() === "" && setErrorMsg(true)}
            />
            {errorMsg && (
              <div style={{ color: "red" }}>Este campo es obligatorio</div>
            )}
          </div>
          {/* <div className="ui_kit_checkbox">
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="customCheck1"
                    value={data.termsAndConditions}
                    onChange={(e) =>
                      setData({
                        ...data,
                        termsAndConditions: !data.termsAndConditions,
                      })
                    }
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="customCheck1"
                  >
                    Acepto los términos y condiciones
                  </label>
                </div>
              </div> */}
          {userLogged ? (
            <button
              type="submit"
              className="btn btn-block btn-thm mb10"
              onClick={HandleSubmit}
            >
              {!isLoading ? (
                "CONTACTAR INMOBILIARIA"
              ) : (
                <img
                  src={loaderIcon}
                  className="loading-spinner"
                  alt="loading"
                />
              )}
            </button>
          ) : (
            <button
              data-toggle="modal"
              data-target="#logInModal"
              type="button"
              className="btn btn-block btn-thm mb10"
            >
              CONTACTAR INMOBILIARIA
            </button>
          )}
          <Link
            href="https://api.whatsapp.com/send?phone=34695685920"
            target="_blank"
            rel="noreferrer"
          >
            <button type="submit" className="btn btn-block btn-whatsapp mb0">
              WHATSAPP
            </button>
          </Link>
          {/* </form> */}
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default Contact;
