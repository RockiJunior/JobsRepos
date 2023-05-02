import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import messageHandler from 'utils/messageHandler';

const propsSlice = createSlice({
  name: 'props',
  initialState: {
    branchOfficeProps: { list: [], length: 0 },
    allPropsByBranchOffice: []
  },
  reducers: {
    setPropsArray: (state, { payload }) => {
      state.branchOfficeProps.list = payload.response;
      state.branchOfficeProps.length = payload.length;
    },
    setPropsArrayByBranchOffice: (state, { payload }) => {
      state.allPropsByBranchOffice = [
        ...state.allPropsByBranchOffice,
        ...payload
      ];
    }
  }
});

export const { setPropsArray, setPropsArrayByBranchOffice } =
  propsSlice.actions;

export const getPropertiesByFilters =
  (filtersAndSort, page, propsLimit, token, searchProp) => async dispatch => {
    //Retorna todas las props en un objeto por oficina
    if (filtersAndSort.branchOffices[0]) {
      const response = await axios({
        method: 'POST',
        url: `${process.env.REACT_APP_SERVER}/properties/branch-office?offset=${
          page - 1
        }&limit=${propsLimit}&field=${searchProp}`,
        data: filtersAndSort,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = {
        response: response.data.result,
        length: response.data.allPropertiesLength
      };
      dispatch(setPropsArray(data));
    }
  };

export const getPropsArrayByBranchOffice =
  (branchOffices, token) => async dispatch => {
    //Retorna todas las props en un solo array
    let propertiesArray = [];
    branchOffices?.map(async branch => {
      const response = await axios({
        method: 'GET',
        url: `${process.env.REACT_APP_SERVER}/properties/real-estate/${branch.id}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch(setPropsArrayByBranchOffice(response.data));
    });
  };

export const getPropById = (id, token) => async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${process.env.REACT_APP_SERVER}/properties/${id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const createProp = (info, token) => async () => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER}/properties`,
      data: info,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.propertyId;
  } catch (e) {
    console.log(e);
  }
};

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
    return response.status;
  } catch (e) {
    messageHandler('error', e.response.data.message);
    return e.response.status;
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
    return response.status;
  } catch (e) {
    messageHandler('error', e.response.data.message);
    return e.response.status;
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
    messageHandler('success', 'Propiedad eliminada correctamente');
    return response.status;
  } catch (e) {
    messageHandler('error', e.response.data.message);
    return e.response.status;
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
      data: {
        ...prop
      },
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
    });
    return response;
  } catch (e) {
    messageHandler('error', e.response.data.message);
    return e.response;
  }
};

export const imageDelete = (propertyId, fileName) => async () => {
  try {
    const response = await axios({
      url: `${process.env.REACT_APP_SERVER}/properties/delete-image/${propertyId}`,
      method: 'DELETE',
      data: {
        filename: fileName
      }
      /* headers:{
        Authorization: `Bearer ${token}`
      } */
    });
    return response;
  } catch (e) {
    messageHandler('error', e.response.data.message);
    return e.response;
  }
};

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
