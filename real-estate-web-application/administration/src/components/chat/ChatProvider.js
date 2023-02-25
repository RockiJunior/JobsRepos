import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChatContext } from 'context/Context';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getPropsArrayByBranchOffice } from 'redux/propsSlice';
import { getConversationsAndMessages, readMessage } from 'redux/conversationsSlice';
import socket from 'Socket';

const ChatProvider = ({ children }) => {
  const dispatch = useDispatch()
  const token = localStorage.getItem("token")
  const [isOpenThreadInfo, setIsOpenThreadInfo] = useState(false);
  const [scrollToBottom, setScrollToBottom] = useState(true);
  const [threads, setThreads] = useState();
  const [messages, setMessages] = useState()
  const userLogged = useSelector((state) => state.login.currentUser)
  const officesArray = userLogged?.typeOfUser !== 'admin' ? userLogged?.branchOffices : userLogged?.realEstate.branchOffice

  const [currentThread, setCurrentThread] = useState([]);
  const [textAreaInitialHeight, setTextAreaInitialHeight] = useState(32);

  const props = useSelector((state) => state.props.allPropsByBranchOffice)


  //Cuando recibo el usuario/las oficinas, busca las propiedades
  //Get props
  useEffect(() => {
    dispatch(getPropsArrayByBranchOffice(officesArray, token))
  }, [userLogged, officesArray])
  //Cuando obtengo las propiedades, busco las conversaciones creadas en cada una y las guarda en el reducer
  //Get conversations and messagges
  useEffect(() => {
    props &&
      fetchConversations()
  }, [props])

  const fetchConversations = async () => {
    const response = await dispatch(getConversationsAndMessages(props, token))
    if (response.conversations && response.conversations.length > 0) {
      const sortedThreads = response.conversations.sort((a, b) => {
        return b.lastUpdate.getTime() - a.lastUpdate.getTime()
      })
      setThreads(sortedThreads)
    }
    if (response.messages && response.messages.length > 0) {
      setMessages(response.messages)
    }
  }
  //Al recibir las conversaciones por primera vez, se joinea a la room de cada conversacion
  useEffect(() => {
    threads &&
      threads?.map((conver) => {
        socket.emit('joinConversation', { conversationId: conver.id });
      })
  }, [threads])

  useEffect(() => {
    socket && messages &&
      socket.on("get_messages", async ({ conversation }) => {
        const filteredConver = messages.filter(
          (conver) => conver.id !== conversation.id
        );
        const updatedConver = {
          branchOffice: conversation.branchOffice.id,
          id: conversation.id,
          content: conversation.messages
        }
        filteredConver.unshift(updatedConver);
        setMessages(filteredConver);
        const lastMessage = conversation.messages[conversation.messages.length - 1]
        const updatedThread = threads.find((thread) => thread.id === conversation.id)
        if (updatedThread) {
          const filteredThreads = threads.filter((thread) => thread.id !== conversation.id)
          const isRead = lastMessage.user === null ? currentThread.id === updatedThread.id ? true : false : true
          filteredThreads.unshift(
            {
              ...updatedThread,
              read: isRead
            })
          const patchRead = currentThread.id === updatedThread.id && await dispatch(readMessage(lastMessage.id, token))
          setThreads(filteredThreads)
        }
      });
  }, [socket, messages])

  const value = {
    threads,
    messages,
    setThreads,
    setMessages,
    textAreaInitialHeight,
    setTextAreaInitialHeight,
    isOpenThreadInfo,
    setIsOpenThreadInfo,
    currentThread,
    setCurrentThread,
    scrollToBottom,
    setScrollToBottom,
    props
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

ChatProvider.propTypes = { children: PropTypes.node.isRequired };

export default ChatProvider;
