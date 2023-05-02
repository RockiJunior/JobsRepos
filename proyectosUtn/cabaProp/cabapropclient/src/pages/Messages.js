import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menu from "../components/favorites/Menu";
import ResponsiveMenu from "../components/favorites/ResponsiveMenu";
import List from "../components/messages/List";
import socket from "../components/Socket";
import { getConversations } from "../redux/messagesSlice";

const Messages = () => {
  const dispatch = useDispatch();
  const userLogged = useSelector((state) => state.login.currentUser);
  const [firstJoin, setFirstJoin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState();
  const [refreshList, setRefreshList] = useState(false);

  const fetchConversations = async () => {
    const conver = await dispatch(getConversations(userLogged.id));
    setConversations(conver);
    setIsLoading(false);
  };

  useEffect(() => {
    if (userLogged) {
      fetchConversations();
      socket.emit("joinClient", { clientId: userLogged.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLogged]);

  useEffect(() => {
    socket &&
      conversations &&
      socket.on("get_messages", ({ conversation }) => {
        const filteredConver = conversations.filter(
          (conver) => conver.id !== conversation.id
        );
        filteredConver.unshift(conversation);
        setConversations(filteredConver);
      });
    socket.on("new_conversation", ({ conversation }) => {
      if (conversations) {
        const newConversationsArray = [conversation, ...conversations];
        setConversations(newConversationsArray);
      }
    });
    //eslint-disable-next-line
  }, [socket, conversations, refreshList]);

  useEffect(() => {
    if (firstJoin) {
      conversations?.length > 0 &&
        // eslint-disable-next-line array-callback-return
        conversations?.map((conver) => {
          socket.emit("joinConversation", { conversationId: conver.id });
        });
      conversations?.length > 0 && setFirstJoin(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations]);

  return (
    <div className="wrapper bgc-alice-blue mi-actividad">
      {isLoading ? (
        <div className="preloader" />
      ) : (
        <>
          <Menu item={4} />
          <section
            style={{ marginTop: -100 }}
            className="our-dashbord dashbord bgc-alice-blue pb-0"
          >
            <div className="container-fluid">
              <div className="row">
                <div className="col-xl-2 dn-lg pl0" />
                <div className="col-xl-10">
                  <div className="row">
                    <div className="col-lg-12">
                      <ResponsiveMenu item={4} />
                    </div>
                    <div className="col-lg-12 mb50">
                      <div className="breadcrumb_content">
                        <h2 className="breadcrumb_title">Mensajes</h2>
                      </div>
                    </div>
                  </div>
                  {conversations?.length > 0 ? (
                    <List
                      userLogged={userLogged}
                      // fetchConversations={fetchConversations}
                      isLoading={isLoading}
                      conversations={conversations}
                      refreshList={refreshList}
                      setRefreshList={setRefreshList}
                    />
                  ) : (
                    <div className="invoice_table faborites table-responsive">
                      <div className="w-100 text-center">
                        <h2 className="m-0">
                          No iniciaste ninguna conversación
                        </h2>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Messages;
