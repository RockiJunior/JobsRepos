import axios from "axios";
import React, { useState } from "react";
import messageHandler from "../../utlis/messageHandler";

const Contact = ({ userLogged, property, type, setShowModal }) => {
  const token = localStorage.getItem("token");
  const [errorMsg, setErrorMsg] = useState(false)
  const [data, setData] = useState({
    name: userLogged ? `${userLogged.firstName} ${userLogged.lastName}` : "",
    phone: "",
    email: userLogged ? userLogged.email : "",
    message: "Hola, estoy interesado en esta propiedad",
    termsAndConditions: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!errorMsg){
      try {
        await axios
          .get(
            `${process.env.REACT_APP_SERVER}/conversations/conversation/${userLogged.id}/${property._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            if (res.data.id) {
              const body = {
                propertyId: property._id,
                clientId: userLogged.id,
                conversationId: res.data.id,
                branchOfficeId: property.branch_office,
                message: data.message,
              };
              sendMessage(body);
            } else {
              const body = {
                propertyId: property._id,
                clientId: userLogged.id,
                branchOfficeId: property.branch_office,
                message: data.message,
              };
              sendMessage(body);
            }
          })
          .catch((res) => messageHandler("error", "Error"));
      } catch (error) {}
    }
  };

  const sendMessage = async (body) => {
    await axios
      .post(`${process.env.REACT_APP_SERVER}/messages/client`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 201)
          messageHandler("success", "Mensaje enviado con éxito");
        setData({
          name: userLogged
            ? `${userLogged.firstName} ${userLogged.lastName}`
            : "",
          phone: "",
          email: userLogged ? userLogged.email : "",
          message: "",
          termsAndConditions: false,
        });
        type === "modal" && setShowModal(false)
      })
      .catch((res) => messageHandler("error", "Error"));
  };

  return (
    <>
      {/* <div className="listing_single_sidebar"> */}
        <div className="sidebar_agent_search_widget mb30">
          <div className="media">
            <img
              className="mr-3 author_img"
              src={"/assets/images/inmobiliaria/1.jpg"}
              alt="author.png"
            />
            <div className="media-body">
              <h5 className="mt10 mb5 fz16 heading-color fw600">
                Inmobiliaria Gonzalez
              </h5>
              <p className="mb0">(123)456-7890</p>
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
                style={{borderColor: errorMsg && "red"}}
                value={data.message}
                placeholder="Mensaje..."
                onChange={(e) => {
                  setData({ ...data, message: e.target.value })
                  e.target.value.trim() !== "" && setErrorMsg(false)
                }}
                onBlur={()=>data.message.trim() === "" && setErrorMsg(true)}
              ></textarea>
            {errorMsg && <div style={{color: 'red'}}>
              Este campo es obligatorio
            </div>}
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
                onClick={handleSubmit}
              >
                CONTACTAR INMOBILIARIA
              </button>
            ) : (
              <button
                data-toggle="modal"
                data-target="#logInModal"
                // type="submit"
                className="btn btn-block btn-thm mb10"
              >
                CONTACTAR INMOBILIARIA
              </button>
            )}
            <button type="submit" className="btn btn-block btn-whatsapp mb0">
              WHATSAPP
            </button>
            {/* </form> */}
          </div>
        </div>
      {/* </div> */}
    </>
  );
};

export default Contact;
