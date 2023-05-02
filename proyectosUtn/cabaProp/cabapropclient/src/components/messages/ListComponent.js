import moment from "moment";
import "moment/locale/es";
import React from "react";
moment.locale("es");

const ListComponent = ({
  chat,
  setCurrentChat,
  currentChat,
  refreshList,
  setRefreshList,
}) => {
  const lastMsg = chat.messages[chat.messages.length - 1];
  const lastMsgRead =
    (lastMsg.user && lastMsg.read_at) || !lastMsg.user ? true : false;

  return (
    <li
      style={{
        background: currentChat?.id === chat.id && "rgba(0,0,0,.1)",
      }}
      className="contact px-3 cursor-pointer"
      onClick={() => {
        setCurrentChat({
          id: chat.id,
          propertyId: chat.propertyId,
          branchOffice: chat.branchOffice.id,
        });
        // !lastMsgRead && dispatch(readMessage(lastMsg.id))
        // setRefreshList(!refreshList)
      }}
    >
      <div className="wrap">
        <img
          style={{ height: 50, width: 50 }}
          className="img-fluid"
          src={chat.property.images[0].url}
          alt="s1.jpg"
        />
        <div className="child-wrap df">
          <div className="meta">
            <h5 className="name">
              {chat.property?.title.length < 23
                ? chat.title
                : `${chat.property?.title.substr(0, 22)}...`}
            </h5>
            <p
              style={{ fontWeight: !lastMsgRead && "bold" }}
              className="preview"
            >
              {!lastMsg.user && "Tú: "}
              {lastMsg.message.length < 35
                ? lastMsg.message
                : `${lastMsg.message.substr(0, 34)}...`}
            </p>
            {!lastMsgRead && <div className="m_notif"></div>}
          </div>
          <div className="iul_notific">
            <small className="body-color">
              {moment(chat.updated_at)
                .fromNow()
                .replace("minutos", "min")
                .replace("un minuto", "1 min")
                .replace("horas", "h")
                .replace("una hora", "1 h")
                .replace("unos segundos", "ahora")
                .replace("hace ", "")}
            </small>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ListComponent;
