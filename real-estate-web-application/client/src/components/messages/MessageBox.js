import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getConversations, getMessages, readMessage } from "../../redux/messagesSlice";
import axios from "axios";
import messageHandler from "../../utlis/messageHandler";
import "moment/locale/es";
import { Link } from "react-router-dom";
import socket from "../Socket";
moment.locale("es");

const MessageBox = ({ currentChat, userLogged, conversations }) => {
  const ref = useRef(null);
  const dispatch = useDispatch();

  const [newMsg, setNewMsg] = useState("");
  const [messages, setMessages] = useState();
  const [lastMsg, setLastMsg] = useState()

  useEffect(() => {
    const filteredMsg = conversations?.find(
      (conver) => conver.id === currentChat.id
    );
    setMessages(filteredMsg);
    setLastMsg(filteredMsg.messages[filteredMsg.messages.length - 1])
        // lastMsg && dispatch(readMessage(lastMsg.id))
      }, [currentChat, conversations]);


  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMsg) {
      const body = {
        propertyId: currentChat.propertyId,
        clientId: userLogged?.id,
        conversationId: currentChat.id,
        branchOfficeId: currentChat.branchOffice,
        message: newMsg,
      };
      socket.emit("send_message", body);
      setNewMsg("");
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  };

  return (
    <div className="col-lg-7 col-xl-8">
      <div className="message_container mt30-md">
        <div className="user_heading">
          <div className="wrap">
            <span className="contact-status online"></span>
            <img
              className="img-fluid mr10"
              style={{ width: 50, height: 50, border: "1px solid #011B85" }}
              src={messages?.property.images[0]}
              alt="img"
            />
            <div className="meta">
              <Link to={`/propiedad/${messages?.property._id}`}>
                <h5 className="name">{messages?.property.title}</h5>
              </Link>
              <p className="preview">{`${messages?.property.location.street} ${messages?.property.location.number}`}</p>
            </div>
          </div>
        </div>
        <div className="inbox_chatting_box">
          <ul className="chatting_content">
            {messages &&
              messages.messages.map((msg) => (
                <li key={msg.id} className={msg.user ? "sent" : "reply first"}>
                  <p className="mb5">{msg.message}</p>
                  <div className={msg.user ? "df" : "df justify-content-end"}>
                    <small
                      className={msg.user ? "body-color ml5" : "body-color mr5"}
                    >
                      {moment(msg.created_at).format("LT")}
                    </small>
                  </div>
                </li>
              ))}
          </ul>
          <div ref={ref}></div>
        </div>
        <div className="mi_text">
          <div className="message_input">
            <form className="form-inline" onSubmit={sendMessage}>
              <input
                className="form-control"
                type="search"
                placeholder="Escribir mensaje..."
                aria-label="Search"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
              />
              <button className="btn" type="submit">
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
