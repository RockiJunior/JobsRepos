import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import messageHandler from 'utils/messageHandler';

const colabsSlice = createSlice({
  name: 'colaboradores',
  initialState: {
    data: [],
    invitacion: null
  },
  reducers: {
    setColabs: (state, { payload }) => {
      state.data = payload;
    },
    setInvitacion: (state, { payload }) => {
      state.invitacion = payload
    }
  }
});

export const { setColabs, setInvitacion } = colabsSlice.actions;

export const getColabs = (token) => async (dispatch) => {
  try {
    if (token) {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_SERVER}/users/collab-users/`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      dispatch(setColabs(response.data)
      )
    }
  } catch (e) {
    console.log(e)
  }
}

export const createColab = (userData, token) => async () => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER}/users/create-user/`,
      data: userData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    messageHandler('success', response.data.message)
    return response
  } catch (e) {
    messageHandler('error', e.response.data.message)
    return e
  }
}

export const confirmAccount = (userData) => async (dispatch) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER}/users/verify-user`,
      data: userData
    })
    messageHandler('success', 'La cuenta ha sido confirmada, ya puede ingresar a la plataforma')
  } catch (e) {
    messageHandler('error', e.response.data.message)
  }
}

export const getInvitation = (token) => async (dispatch) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_SERVER}/invitations/${token}`
    })
    dispatch(setInvitacion(response.data))
  } catch (e) {
    console.log(e)
  }
}

export const editProfile = (id, changes, token) => async (dispatch) => {
  try {
    const response = await axios({
      method: "PATCH",
      url: `${process.env.REACT_APP_SERVER}/users/edit-profile/${id}`,
      data: changes,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    messageHandler('success', response.data.message)
    return response
  } catch (e) {
    messageHandler('error', e.response.data.message)
    return e.response.status
  }
}

export const changePassword = (id, changes, token) => async (dispatch) => {
  try {
    const response = await axios({
      method: "PATCH",
      url: `${process.env.REACT_APP_SERVER}/users/edit-profile/${id}`,
      data: changes,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    messageHandler('success', response.data.message)
    return response.status
  } catch (e) {
    messageHandler('error', e.response.data.message)
    return e.response.status
  }
}

export const resendInvitation = (data, token) => async () => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER}/users/resend-confirmation`,
      data: data,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    messageHandler('success', response.data.message)
  } catch (e) {
    messageHandler('error', e.response.data.message)
  }
}

export const editCollab = (id, data, branchOffices, token) => async () => {
  try {
    //Objeto de datos personales y su peticion
    const newData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      dni: data.dni,
    }
    const response = await axios({
      method: "PATCH",
      url: `${process.env.REACT_APP_SERVER}/users/edit-data/${id}`,
      data: newData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    //Paso el objeto de roles y oficinas a array
    const branchOfficesArray = Object.values(branchOffices)
    //Mapeo los roles asignados y ejecuto peticion por cada rol
    branchOfficesArray.map(async (office) => {
      const officeResponse = await axios({
        method: "PATCH",
        url: `${process.env.REACT_APP_SERVER}/users/edit-roles/${id}`,
        data: {
          branchOfficeId: office.branchOfficeId,
          roleId: office.roleId,
          active: office.active
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    })
    messageHandler('success', response.data.message)
    return response.status
  } catch (e) {
    messageHandler('error', e.response.data.message)
  }
}

export const deleteCollab = (id, token) => async () => {
  try {
    const response = await axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_SERVER}/users/${id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    messageHandler('success', response.data.message)
    return response.status
  } catch (e) {
    messageHandler('error', e.response.data.message)
    return e.response.status
  }
}

export const activeCollab = (id, token) => async () => {
  try {
    const response = await axios({
      method: "PATCH",
      url: `${process.env.REACT_APP_SERVER}/users/active-user/${id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    messageHandler('success', response.data.message)
  } catch (e) {
    messageHandler('error', e.response.data.message)
  }
}

export const changeCollabStatus = (id, status, token) => async () => {
  try {
    const response = await axios({
      method: "PATCH",
      url: `${process.env.REACT_APP_SERVER}/users/edit-data/${id}`,
      data: {
        status: status
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    messageHandler('success', response.data.message)
  } catch (e) {
    messageHandler('error', e.response.data.message)
  }
}

export const getCollabById = (id, token) => async () => {
  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_SERVER}/users/${id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (e) {
    messageHandler('error', e.response.data.message)
  }
}

export const RecoverPassword = (email, token) => async () => {
  try {
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER}/users/recover-password`,
      data: email,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    messageHandler('success', `Un enlace para restablecer la contraseña fue enviado al mail ${email}. Tiene 24hs para actualizarla.`)
  } catch (e) {
    messageHandler('error', 'El email o la contraseña son incorrectos')
  }
}

export default colabsSlice.reducer