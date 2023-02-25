import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import messageHandler from 'utils/messageHandler';

const propsSlice = createSlice({
  name: 'props',
  initialState: {
    branchOfficeProps: {},
    allPropsByBranchOffice: []
  },
  reducers: {
    setPropsByBranchOffice: (state, { payload }) => {
      state.branchOfficeProps[payload.id] = payload.response;
    },
    setPropsArrayByBranchOffice: (state, { payload }) => {
      state.allPropsByBranchOffice = [...state.allPropsByBranchOffice, ...payload];
    }
  }
});

export const { setPropsByBranchOffice, setPropsArrayByBranchOffice } = propsSlice.actions;

export const getPropsByBranchOffice = (branchOffices, token) => async (dispatch) => {
  //Retorna todas las props en un objeto por oficina
  branchOffices?.map(async branch => {
    const response = await axios({
      method: 'GET',
      url: `${process.env.REACT_APP_SERVER}/properties/real-estate/${branch.id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = {
      response: response.data.sort((a, b) =>
        a.updated_at < b.updated_at ? 1 : a.updated_at > b.updated_at ? -1 : 0
      ),
      id: branch.id
    };
    dispatch(setPropsByBranchOffice(data));
  });
};

export const getPropsArrayByBranchOffice = (branchOffices, token) => async (dispatch) => {
  //Retorna todas las props en un solo array
  let propertiesArray = []
  branchOffices?.map(async branch => {
    const response = await axios({
      method: 'GET',
      url: `${process.env.REACT_APP_SERVER}/properties/real-estate/${branch.id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(setPropsArrayByBranchOffice(response.data))
  });
};

export const getPropById = (id, token) => async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: `http://localhost:3001/properties/${id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (e) {
    console.log(e)
  }
}

export const createProp = (info, token) => async () => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER}/properties`,
      data: info,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data.propertyId
  } catch (e) {
    console.log(e)
  }
}

export const changeStatus = (id, status, token) => async () => {
  try {
    const response = await axios({
      method: 'PATCH',
      url: `${process.env.REACT_APP_SERVER}/properties/upload-characteristics/${id}`,
      data: {
        status: status
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    messageHandler('success', response.data.message);
    return response.status
  } catch (e) {
    messageHandler('error', e.response.data.message);
    return e.response.status
  }
};

export const setPropActive = (id, token) => async () => {
  try {
    const response = await axios({
      method: 'PATCH',
      url: `${process.env.REACT_APP_SERVER}/properties/publish/${id}`,
      data: {
        status: 'published'
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    messageHandler('success', response.data.message);
    return response.status
  } catch (e) {
    messageHandler('error', e.response.data.message);
    return e.response.status
  }
};

export const deleteProp = (id, token) => async () => {
  try {
    let response = await axios({
      method: 'DELETE',
      url: `${process.env.REACT_APP_SERVER}/properties/logical/${id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    messageHandler('success', response.data.message);
    return response.status
  } catch (e) {
    messageHandler('error', e.response.data.message);
    return e.response.status
  }
};

export const physicDelete = (id, token) => async () => {
  try {
    let response = await axios({
      method: 'DELETE',
      url: `${process.env.REACT_APP_SERVER}/properties/phisical/${id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    messageHandler('success', response.data.message);
  } catch (e) {
    messageHandler('error', e.response.data.message);
  }
};

export const uploadCharacteristics = (prop, id, token) => async () => {
  try {
    const response = await axios({
      method: 'PATCH',
      url: `${process.env.REACT_APP_SERVER}/properties/upload-characteristics/${id}`,
      data: prop,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (e) {
    return e.response;
  }
};

export const uploadImage = (id, formData, token) => async () => {
  try {
    const response = await axios({
      url: `${process.env.REACT_APP_SERVER}/properties/upload-multimedia/${id}`,
      method: 'PATCH',
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (e) {
    messageHandler('error', e.response.data.message)
    return e.response
  }
};

export const imageDelete = (propertyId, fileUrl, imageType, token) => async () => {
  try {
    const response = await axios({
      url: `${process.env.REACT_APP_SERVER}/properties/delete-image/${propertyId}`,
      method: 'DELETE',
      data: {
        imageType: imageType,
        fileUrl: fileUrl
      },
      /* headers:{
        Authorization: `Bearer ${token}`
      } */
    })
    return response
  } catch (e) {
    messageHandler('error', e.response.data.message)
    return e.response
  }
}

export const editBasicData = (prop, id, token) => async () => {
  try {
    const response = await axios({
      method: 'PATCH',
      url: `${process.env.REACT_APP_SERVER}/properties/basic-data/${id}`,
      data: prop,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (e) {
    return e.response;
  }
};


export default propsSlice.reducer;
