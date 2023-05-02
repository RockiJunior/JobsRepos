import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChatContext } from 'context/Context';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getPropsArrayByBranchOffice } from 'redux/propsSlice';
import {
  getConversationsAndMessages,
  readMessage
} from 'redux/conversationsSlice';
import socket from 'Socket';
import { HavePermission } from 'utils/HavePermission';

const ChatProvider = ({ children }) => {
  const dispatch = useDispatch();

  const token = localStorage.getItem('token');
  const userLogged = useSelector(state => state.login.currentUser);
  const props = useSelector(state => state.props.allPropsByBranchOffice);

  const [isOpenThreadInfo, setIsOpenThreadInfo] = useState(false);
  const [scrollToBottom, setScrollToBottom] = useState(true);
  const [threads, setThreads] = useState([]);
  const [newThread, setNewThread] = useState({});
  const [messages, setMessages] = useState([]);
  const officesArray =
    userLogged?.typeOfUser !== 'admin'
      ? userLogged?.branchOffices
      : userLogged?.realEstate.branchOffice;

  const [allowedOfficesConversation, setAllowedOfficesConversation] = useState(
    officesArray?.filter(office => {
      return HavePermission('Messages', userLogged, office.id);
    })
  );

  const [currentThread, setCurrentThread] = useState([]);
  const [textAreaInitialHeight, setTextAreaInitialHeight] = useState(32);

  useEffect(() => {
    setAllowedOfficesConversation(
      officesArray?.filter(office => {
        return HavePermission('Messages', userLogged, office.id);
      })
    );
  }, [officesArray, userLogged]);

  //Cuando recibo el usuario/las oficinas, busca las propiedades
  //Get props
  useEffect(() => {
    dispatch(getPropsArrayByBranchOffice(allowedOfficesConversation, token));
  }, [userLogged, officesArray]);

  //Cuando obtengo las oficinas, busca las conversaciones
  //Get conversations and messagges
  useEffect(() => {
    allowedOfficesConversation && fetchConversations();
    allowedOfficesConversation?.map(office => {
      socket.emit('joinBranchOffice', { branchOfficeId: office.id });
    });
  }, [allowedOfficesConversation]);

  const fetchConversations = async () => {
    const response = await dispatch(
      getConversationsAndMessages(allowedOfficesConversation, token)
    );
    if (response.conversations && response.conversations.length > 0) {
      const sortedThreads = response.conversations.sort((a, b) => {
        return b.lastUpdate.getTime() - a.lastUpdate.getTime();
      });
      setThreads(sortedThreads);
    }
    if (response.messages && response.messages.length > 0) {
      setMessages(response.messages);
    }
  };

  //Al recibir las conversaciones por primera vez, se joinea a la room de cada conversacion
  useEffect(() => {
    threads &&
      threads?.map(conver => {
        socket.emit('joinConversation', { conversationId: conver.id });
      });
  }, [threads]);

  useEffect(() => {
    if (newThread.id) {
      !threads.some(t => t.id === newThread.id) &&
        setThreads([newThread, ...threads]);
    }
  }, [newThread]);

  useEffect(() => {
    socket &&
      messages &&
      //Listener de socket para nuevos mensajes de conversaciones existentes
      socket.on('get_messages', async ({ conversation }) => {
        const filteredConver = messages.filter(
          conver => conver.id !== conversation.id
        );
        const updatedConver = {
          branchOffice: conversation.branchOffice.id,
          id: conversation.id,
          content: conversation.messages
        };
        filteredConver.unshift(updatedConver);
        setMessages(filteredConver);
        const lastMessage =
          conversation.messages[conversation.messages.length - 1];
        const updatedThread = threads.find(
          thread => thread.id === conversation.id
        );
        if (updatedThread) {
          const filteredThreads = threads.filter(
            thread => thread.id !== conversation.id
          );
          const isRead = !lastMessage.user
            ? currentThread.id === updatedThread.id
            : true;
          filteredThreads.unshift({
            ...updatedThread,
            read: isRead
          });
          currentThread.id === updatedThread.id &&
            (await dispatch(readMessage(lastMessage.id, token)));
          setThreads(
            filteredThreads.sort((a, b) => {
              a.lastUpdate.getTime() > b.lastUpdate.getTime()
                ? 1
                : a.lastUpdate.getTime() < b.lastUpdate.getTime()
                ? -1
                : 0;
            })
          );
        }
      });
    //Listener de socket para nuevas conversaciones recibidas
    socket.on('new_conversation', async ({ conversation }) => {
      const newConversation = {
        id: conversation.id,
        branchOffice: conversation.branchOffice.id,
        content: conversation.messages
      };
      if (messages) setMessages([newConversation, ...messages]);
      /* 
        filteredConver.unshift(updatedConver);
      } */
      const lastMessage =
        conversation.messages[conversation.messages.length - 1];
      const thread = {
        name: `${conversation.client.firstName} ${conversation.client.lastName}`,
        status: 'delivered',
        id: conversation.id,
        clientId: conversation.client.id,
        userId: null,
        type: 'user',
        messagesId: conversation.id,
        propertyId: conversation.propertyId,
        lastUpdate: lastMessage.created_at,
        //Está leido y fue enviado por un client? entonces esta leido, sino, fue mandado por un user? esta leido para no marcar sin leer los enviados por uno mismo.
        //Sino, la unica opcion que queda es que no este leido y haya sido enviado por un cliente, por lo cual es la unica opcion false
        read: false
      };
      setNewThread(thread);
      /* 
        filteredThreads.unshift(thread);
        setThreads(filteredThreads);
      } */
      /* if (updatedThread) {
        const filteredThreads = threads.filter(
          thread => thread.id !== conversation.id
        );
        filteredThreads.unshift({
          ...updatedThread,
          read: false
        });
        currentThread.id === updatedThread.id &&
          (await dispatch(readMessage(lastMessage.id, token)));
        setThreads(
          filteredThreads.sort((a, b) => {
            a.lastUpdate.getTime() > b.lastUpdate.getTime()
              ? 1
              : a.lastUpdate.getTime() < b.lastUpdate.getTime()
              ? -1
              : 0;
          })
        );
      } */
    });
  }, [socket, messages]);

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
