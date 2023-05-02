import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const conversationsSlice = createSlice({
  name: 'conversation',
  initialState: {
    conversations: [],
    messages: []
  },
  reducers: {
    setConversationsAndMessages: (state, { payload }) => {
      state.conversations = payload.conversations;
      state.messages = payload.messages
    }
  }
});

export const { setConversationsAndMessages } = conversationsSlice.actions;

export const getConversationsAndMessages = (branchOffices, token) => async (dispatch) => {
  try {
    const conversations = []
    const messages = []
    for (const office of branchOffices) {
      const response = await axios({
        method: 'GET',
        url: `${process.env.REACT_APP_SERVER}/conversations/branchOfficeId/${office.id}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.length > 0) {
        response.data.forEach((conver) => {
          const messagesData = [...conver.messages]
          const chat = {
            id: conver.id,
            branchOffice: conver.branchOffice.id,
            content: messagesData.sort((a,b) => a.created_at > b.created_at ? 1 : -1)
          }
          if (!messages.some((elem) => elem.id === chat.id)) messages.push(chat)
          const lastMessage = conver.messages.pop()
          const conversation = {
            name: `${conver.client.firstName} ${conver.client.lastName}`,
            status: lastMessage?.read_at !== null ? 'seen' : 'delivered',
            id: conver.id,
            clientId: 1,
            userId: null,
            type: 'user',
            messagesId: conver.id,
            propertyId: conver.propertyId,
            lastUpdate: new Date (lastMessage.created_at),
            //Está leido y fue enviado por un client? entonces esta leido, sino, fue mandado por un user? esta leido para no marcar sin leer los enviados por uno mismo. 
            //Sino, la unica opcion que queda es que no este leido y haya sido enviado por un cliente, por lo cual es la unica opcion false
            read: lastMessage?.read_at !== null && lastMessage?.user === null ? true : lastMessage?.user !== null ? true : false
          }
          if (!conversations.some((elem) => elem.id === conversation.id)) conversations.push(conversation)
        })
      }
    }

    return {
      conversations: conversations,
      messages: messages
    }

  } catch (e) {
    return e.response;
  }
};

export const createMessage = (newMessage, token) => async () => {
  try{
      const response = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER}/messages/user`,
        data: newMessage,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data.message
  }catch(e){
    return e.response.data.message
  }
}

export const readMessage = (id, token) => async () => {
  try {
    const response = await axios({
      method: "PATCH",
      url: `${process.env.REACT_APP_SERVER}/messages/update-read-at/${id}`,
      headers: {
        Authorization: `Bearer ${token}`        
      }
    })
    return response
  } catch (error) {
    console.log(error)
  }
}

export default conversationsSlice.reducer;
